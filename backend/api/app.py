"""FastAPI application for NAAF Research Agents.

This module provides REST and SSE endpoints for the NAAF Research Agent,
enabling country assessments with real-time streaming updates.
"""

import os
import json
import asyncio
from datetime import datetime
from typing import Optional, List, Dict, Any, AsyncGenerator

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from ..agents.naaf_agent import (
    NAAFAgent,
    NAAFAgentConfig,
    create_naaf_agent,
    assess_country as agent_assess_country,
    get_all_layers_summary,
)
from ..framework import (
    NAAF_LAYERS,
    POWER_TIERS,
    StoredResearch,
    ResearchStore,
    get_store,
    get_tier,
    get_tier_description,
)


# Request/Response models
class NAAFResearchRequest(BaseModel):
    """Request to start a NAAF country assessment."""
    country: str = Field(..., description="Country name to assess")
    year: int = Field(default=2024, description="Target year for data")
    include_news: bool = Field(default=True, description="Include live news")
    check_rubric_updates: bool = Field(default=False, description="Check for framework updates")


class LayerScore(BaseModel):
    """Score for a single NAAF layer."""
    layer_number: int
    layer_name: str
    score: float
    max_score: float
    weight: float
    status: str


class NAAFReportResponse(BaseModel):
    """Complete NAAF assessment response."""
    country: str
    year: int
    overall_score: float
    tier: str
    tier_description: str
    layers: List[LayerScore]
    sources: List[str]
    generated_at: str
    run_id: str


class ResearchEvent(BaseModel):
    """SSE event for research progress updates."""
    event: str
    data: Dict[str, Any]


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="NAAF Research Agents API",
        description="National AI Assessment Framework - Country Research API",
        version="0.1.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app = create_app()


@app.get("/")
async def root():
    """API root endpoint."""
    return {
        "name": "NAAF Research Agents API",
        "version": "0.1.0",
        "description": "National AI Assessment Framework - 8-Layer Country Research",
        "endpoints": {
            "research": "/naaf/research",
            "stream": "/naaf/research/stream",
            "layers": "/naaf/layers",
            "tiers": "/naaf/tiers",
            "runs": "/naaf/runs",
            "health": "/health",
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "0.1.0",
        "tools": {
            "youcom": bool(os.getenv("YOUCOM_API_KEY")),
            "exa": bool(os.getenv("EXA_API_KEY")),
            "gemini": bool(os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")),
        }
    }


@app.get("/naaf/layers")
async def get_layers():
    """Get information about all NAAF layers."""
    layers = []
    for layer_num, layer in NAAF_LAYERS.items():
        layers.append({
            "number": layer.number,
            "name": layer.name,
            "short_name": layer.short_name,
            "description": layer.description,
            "weight": layer.weight,
            "max_points": layer.max_points,
            "metrics": [
                {
                    "name": m.name,
                    "description": m.description,
                    "unit": m.unit,
                    "weight": m.weight,
                }
                for m in layer.metrics
            ]
        })
    return {"layers": layers, "total_weight": 100}


@app.get("/naaf/tiers")
async def get_tiers():
    """Get power tier definitions."""
    tiers = []
    for tier_name, (min_score, max_score, description) in POWER_TIERS.items():
        tiers.append({
            "name": tier_name,
            "min_score": min_score,
            "max_score": max_score,
            "description": description,
        })
    return {"tiers": tiers}


@app.get("/naaf/runs")
async def list_runs(
    country: Optional[str] = None,
    limit: int = Query(default=20, le=100)
):
    """List previous research runs."""
    store = get_store()
    runs = store.list(country=country, limit=limit)
    return {
        "runs": [
            {
                "id": r.id,
                "country": r.country,
                "overall_score": r.overall_score,
                "tier": r.tier,
                "created_at": r.created_at or r.generated_at,
            }
            for r in runs
        ],
        "total": len(runs),
    }


@app.get("/naaf/runs/{run_id}")
async def get_run(run_id: str):
    """Get a specific research run."""
    store = get_store()
    run = store.get(run_id)
    if not run:
        raise HTTPException(status_code=404, detail=f"Run {run_id} not found")

    # Convert dataclass to dict safely
    return {
        "id": run.id,
        "country": run.country,
        "country_code": run.country_code,
        "year": run.year,
        "overall_score": run.overall_score,
        "tier": run.tier,
        "layers": run.layers,
        "sources": run.sources,
        "news_snapshot": run.news_snapshot,
        "framework_version": run.framework_version,
        "generated_at": run.generated_at,
        "research_duration_seconds": run.research_duration_seconds,
    }


async def generate_sse_events(
    country: str,
    year: int,
    config: NAAFAgentConfig
) -> AsyncGenerator[str, None]:
    """Generate SSE events for real-time research progress."""

    def format_sse(event: str, data: dict) -> str:
        """Format data as SSE event."""
        return f"event: {event}\ndata: {json.dumps(data)}\n\n"

    run_id = f"naaf_{country.lower().replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    # Start event
    yield format_sse("start", {
        "run_id": run_id,
        "country": country,
        "year": year,
        "message": f"Starting NAAF assessment for {country}",
        "timestamp": datetime.now().isoformat(),
    })

    try:
        # Create the agent
        agent = create_naaf_agent(config)

        # Use callback to emit SSE events
        events_queue = asyncio.Queue()

        def progress_callback(event: str, data: Dict):
            events_queue.put_nowait((event, data))

        # Start assessment in background
        assessment_task = asyncio.create_task(
            agent.assess_country(country, year, progress_callback)
        )

        # Emit events as they come
        layer_scores = {}
        while not assessment_task.done():
            try:
                event, data = await asyncio.wait_for(events_queue.get(), timeout=0.5)
                yield format_sse(event, data)

                # Track layer scores
                if event == "layer_complete":
                    layer_scores[data["layer_number"]] = {
                        "score": data["score"],
                        "max_score": data["max_score"],
                        "status": "complete"
                    }
            except asyncio.TimeoutError:
                continue

        # Get the result
        result = await assessment_task

        # Drain any remaining events
        while not events_queue.empty():
            event, data = events_queue.get_nowait()
            yield format_sse(event, data)

        # Save the result
        run_id = agent.save_result(result)

        # Complete event
        yield format_sse("complete", {
            "run_id": run_id,
            "country": result.country,
            "year": result.year,
            "overall_score": result.overall_score,
            "tier": result.tier,
            "tier_description": result.tier_description,
            "layer_count": 8,
            "message": f"Assessment complete for {country}",
            "timestamp": datetime.now().isoformat(),
        })

    except Exception as e:
        yield format_sse("error", {
            "message": str(e),
            "timestamp": datetime.now().isoformat(),
        })


@app.post("/naaf/research/stream")
async def stream_research(request: NAAFResearchRequest):
    """
    Start a NAAF country assessment with SSE streaming.

    Returns real-time progress updates as the research progresses
    through each of the 8 layers.
    """
    config = NAAFAgentConfig(
        include_news=request.include_news,
        check_rubric_updates=request.check_rubric_updates,
        verbose=False,  # Disable console output for streaming
    )

    return StreamingResponse(
        generate_sse_events(request.country, request.year, config),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


@app.post("/naaf/research")
async def research(request: NAAFResearchRequest):
    """
    Run a complete NAAF country assessment (non-streaming).

    Returns the full assessment report when complete.
    """
    config = NAAFAgentConfig(
        include_news=request.include_news,
        check_rubric_updates=request.check_rubric_updates,
    )

    # Run the actual agent
    result = await agent_assess_country(
        country=request.country,
        year=request.year,
        config=config,
        save=True
    )

    # Build layer scores list
    layer_scores = []
    for layer_num_str, layer_data in result["layers"].items():
        layer_num = int(layer_num_str)
        layer = NAAF_LAYERS[layer_num]
        layer_scores.append(LayerScore(
            layer_number=layer_num,
            layer_name=layer_data["name"],
            score=layer_data["score"],
            max_score=layer_data["max_score"],
            weight=layer.weight,
            status=layer_data["status"]
        ))

    return NAAFReportResponse(
        country=result["country"],
        year=result["year"],
        overall_score=result["overall_score"],
        tier=result["tier"],
        tier_description=result["tier_description"],
        layers=layer_scores,
        sources=[],
        generated_at=result["generated_at"],
        run_id=result["run_id"] or "",
    )


# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
