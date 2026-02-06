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
    create_naaf_agent,
    NAAFAgentConfig,
    get_all_layers_summary,
)
from ..framework import (
    NAAF_LAYERS,
    POWER_TIERS,
    ResearchStore,
    get_store,
    get_tier,
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
        description="National AI Assessment Framework - Country Research API powered by Google ADK",
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
        "framework": "Google ADK",
        "endpoints": {
            "research": "/naaf/research",
            "stream": "/naaf/research/stream",
            "layers": "/naaf/layers",
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
                "created_at": r.created_at,
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
    return run.__dict__


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

        # Research each layer
        layer_scores = {}
        all_sources = []

        for layer_num, layer in NAAF_LAYERS.items():
            yield format_sse("layer_start", {
                "layer_number": layer_num,
                "layer_name": layer.name,
                "weight": layer.weight,
                "message": f"Researching Layer {layer_num}: {layer.name}",
            })

            # Simulate research progress (in production, this would use agent.stream())
            await asyncio.sleep(0.5)  # Simulated delay

            # For now, generate placeholder scores
            # In production, this would use the actual agent response
            score = layer.max_points * 0.6  # Placeholder

            layer_scores[layer_num] = {
                "score": score,
                "max_score": layer.max_points,
                "status": "complete"
            }

            yield format_sse("layer_complete", {
                "layer_number": layer_num,
                "layer_name": layer.name,
                "score": score,
                "max_score": layer.max_points,
                "weight": layer.weight,
            })

        # Calculate overall score
        overall_score = sum(layer_scores[n]["score"] for n in layer_scores)
        tier = get_tier(overall_score)

        # Get live news if enabled
        if config.include_news:
            yield format_sse("news_start", {
                "message": f"Fetching live news for {country}",
            })
            await asyncio.sleep(0.3)
            yield format_sse("news_complete", {
                "count": 5,
                "message": "News articles retrieved",
            })

        # Save the run
        store = get_store()
        from ..framework import StoredResearch

        stored = StoredResearch(
            id=run_id,
            country=country,
            country_code="",
            year=year,
            overall_score=overall_score,
            tier=tier,
            layer_scores=layer_scores,
            sources=all_sources,
            created_at=datetime.now().isoformat(),
            raw_response="",
        )
        store.save(stored)

        # Complete event
        yield format_sse("complete", {
            "run_id": run_id,
            "country": country,
            "year": year,
            "overall_score": round(overall_score, 2),
            "tier": tier,
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

    # For now, return a placeholder response
    # In production, this would run the full agent
    run_id = f"naaf_{request.country.lower().replace(' ', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    layer_scores = []
    total_score = 0

    for layer_num, layer in NAAF_LAYERS.items():
        score = layer.max_points * 0.6  # Placeholder
        total_score += score
        layer_scores.append(LayerScore(
            layer_number=layer_num,
            layer_name=layer.name,
            score=score,
            max_score=layer.max_points,
            weight=layer.weight,
            status="complete"
        ))

    tier = get_tier(total_score)
    tier_desc = ""
    for tier_name, (min_s, max_s, desc) in POWER_TIERS.items():
        if tier_name == tier:
            tier_desc = desc
            break

    return NAAFReportResponse(
        country=request.country,
        year=request.year,
        overall_score=round(total_score, 2),
        tier=tier,
        tier_description=tier_desc,
        layers=layer_scores,
        sources=[],
        generated_at=datetime.now().isoformat(),
        run_id=run_id,
    )


# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
