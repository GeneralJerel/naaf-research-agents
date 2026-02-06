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
from fastapi.responses import StreamingResponse, HTMLResponse
from pydantic import BaseModel, Field

try:
    # Try relative imports first (when installed as package)
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
except ImportError:
    # Fall back to absolute imports (when running from backend dir)
    from agents.naaf_agent import (
        NAAFAgent,
        NAAFAgentConfig,
        create_naaf_agent,
        assess_country as agent_assess_country,
        get_all_layers_summary,
    )
    from framework import (
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
            "youcom": bool(os.getenv("YOUCOM_API_KEY") or os.getenv("YDC_API_KEY")),
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


# ============================================================================
# BUILT-IN WEB UI
# ============================================================================

WEB_UI_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NAAF Research Agents</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #e0e0e0; min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1 { color: #00d4ff; margin-bottom: 10px; }
        .subtitle { color: #888; margin-bottom: 30px; }
        .tabs { display: flex; gap: 10px; margin-bottom: 20px; }
        .tab { padding: 10px 20px; background: #1a1a1a; border: 1px solid #333; border-radius: 8px; cursor: pointer; color: #888; }
        .tab.active { background: #00d4ff; color: #000; border-color: #00d4ff; }
        .panel { display: none; }
        .panel.active { display: block; }
        .card { background: #1a1a1a; border: 1px solid #333; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .form-row { display: flex; gap: 10px; margin-bottom: 15px; align-items: center; }
        input, select { padding: 10px 15px; background: #0a0a0a; border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 16px; }
        input:focus, select:focus { outline: none; border-color: #00d4ff; }
        button { padding: 10px 25px; background: #00d4ff; color: #000; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
        button:hover { background: #00b8e0; }
        button:disabled { background: #333; color: #666; cursor: not-allowed; }
        .progress { margin-top: 20px; }
        .layer-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #222; }
        .layer-item:last-child { border-bottom: none; }
        .layer-name { font-weight: 500; }
        .layer-bar { flex: 1; margin: 0 20px; height: 8px; background: #222; border-radius: 4px; overflow: hidden; }
        .layer-fill { height: 100%; background: linear-gradient(90deg, #00d4ff, #00ff88); border-radius: 4px; transition: width 0.5s; }
        .layer-score { font-family: monospace; color: #00d4ff; }
        .result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .score-big { font-size: 48px; font-weight: 700; color: #00d4ff; }
        .tier-badge { padding: 8px 16px; background: #00d4ff22; color: #00d4ff; border-radius: 20px; font-weight: 600; }
        .run-item { padding: 15px; border-bottom: 1px solid #222; cursor: pointer; }
        .run-item:hover { background: #222; }
        .run-item:last-child { border-bottom: none; }
        .run-country { font-weight: 600; font-size: 18px; }
        .run-meta { color: #666; font-size: 14px; margin-top: 5px; }
        .run-score { color: #00d4ff; font-weight: 600; }
        .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status.researching { background: #ff980022; color: #ff9800; }
        .status.complete { background: #00ff8822; color: #00ff88; }
        .log { background: #0a0a0a; border: 1px solid #222; border-radius: 8px; padding: 15px; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 13px; margin-top: 15px; }
        .log-entry { padding: 3px 0; color: #888; }
        .log-entry.layer { color: #00d4ff; }
        .log-entry.complete { color: #00ff88; }
        .empty { text-align: center; padding: 40px; color: #666; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .loading { animation: pulse 1.5s infinite; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌍 NAAF Research Agents</h1>
        <p class="subtitle">National AI Assessment Framework - 8-Layer Country Analysis</p>

        <div class="tabs">
            <div class="tab active" onclick="showTab('research')">New Research</div>
            <div class="tab" onclick="showTab('history')">Saved Runs</div>
        </div>

        <!-- Research Panel -->
        <div id="research-panel" class="panel active">
            <div class="card">
                <div class="form-row">
                    <input type="text" id="country-input" placeholder="Enter country (e.g., Brazil)" style="flex:1">
                    <select id="year-select">
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                    <button id="start-btn" onclick="startResearch()">Start Assessment</button>
                </div>
            </div>

            <div id="progress-card" class="card" style="display:none">
                <div class="result-header">
                    <div>
                        <h2 id="result-country">Researching...</h2>
                        <span id="result-status" class="status researching">Researching</span>
                    </div>
                    <div style="text-align:right">
                        <div id="result-score" class="score-big">--</div>
                        <div id="result-tier" class="tier-badge" style="display:none"></div>
                    </div>
                </div>

                <div id="layers-list"></div>

                <div id="log" class="log"></div>
            </div>
        </div>

        <!-- History Panel -->
        <div id="history-panel" class="panel">
            <div class="card">
                <h3 style="margin-bottom:15px">Previous Research Runs</h3>
                <div id="runs-list"><div class="empty">Loading...</div></div>
            </div>

            <div id="run-detail" class="card" style="display:none">
                <div class="result-header">
                    <div>
                        <h2 id="detail-country"></h2>
                        <span id="detail-date" style="color:#666"></span>
                    </div>
                    <div style="text-align:right">
                        <div id="detail-score" class="score-big"></div>
                        <div id="detail-tier" class="tier-badge"></div>
                    </div>
                </div>
                <div id="detail-layers"></div>
            </div>
        </div>
    </div>

    <script>
        const layers = [
            {n:1, name:'Power & Electricity', max:20},
            {n:2, name:'Chipset Manufacturers', max:15},
            {n:3, name:'Cloud & Data Centers', max:15},
            {n:4, name:'Model Developers', max:10},
            {n:5, name:'Platform & Data', max:10},
            {n:6, name:'Applications & Startups', max:10},
            {n:7, name:'Education & Consulting', max:10},
            {n:8, name:'Implementation', max:10}
        ];

        function showTab(tab) {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            document.querySelector(`.tab:nth-child(${tab==='research'?1:2})`).classList.add('active');
            document.getElementById(tab+'-panel').classList.add('active');
            if (tab === 'history') loadRuns();
        }

        function renderLayers(scores = {}) {
            return layers.map(l => {
                const score = scores[l.n]?.score || 0;
                const pct = (score / l.max * 100).toFixed(0);
                return `<div class="layer-item">
                    <span class="layer-name">${l.n}. ${l.name}</span>
                    <div class="layer-bar"><div class="layer-fill" style="width:${pct}%"></div></div>
                    <span class="layer-score">${score.toFixed(1)}/${l.max}</span>
                </div>`;
            }).join('');
        }

        function log(msg, type='') {
            const logEl = document.getElementById('log');
            logEl.innerHTML += `<div class="log-entry ${type}">${new Date().toLocaleTimeString()} - ${msg}</div>`;
            logEl.scrollTop = logEl.scrollHeight;
        }

        async function startResearch() {
            const country = document.getElementById('country-input').value.trim();
            if (!country) return alert('Enter a country name');

            const year = document.getElementById('year-select').value;
            const btn = document.getElementById('start-btn');
            btn.disabled = true;

            document.getElementById('progress-card').style.display = 'block';
            document.getElementById('result-country').textContent = country;
            document.getElementById('result-score').textContent = '--';
            document.getElementById('result-tier').style.display = 'none';
            document.getElementById('result-status').textContent = 'Researching';
            document.getElementById('result-status').className = 'status researching';
            document.getElementById('layers-list').innerHTML = renderLayers();
            document.getElementById('log').innerHTML = '';

            log('Starting NAAF assessment...', 'layer');

            const scores = {};

            try {
                const response = await fetch('/naaf/research/stream', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({country, year: parseInt(year)})
                });

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (true) {
                    const {done, value} = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, {stream: true});
                    const lines = buffer.split('\\n');
                    buffer = lines.pop();

                    for (const line of lines) {
                        if (line.startsWith('data:')) {
                            try {
                                const data = JSON.parse(line.slice(5));

                                if (data.layer_number) {
                                    if (data.score !== undefined) {
                                        scores[data.layer_number] = {score: data.score, max: data.max_score};
                                        document.getElementById('layers-list').innerHTML = renderLayers(scores);
                                        log(`Layer ${data.layer_number} complete: ${data.score.toFixed(1)}/${data.max_score}`, 'layer');
                                    } else {
                                        log(`Researching Layer ${data.layer_number}: ${data.layer_name}...`);
                                    }
                                }

                                if (data.overall_score !== undefined) {
                                    document.getElementById('result-score').textContent = data.overall_score.toFixed(1);
                                    document.getElementById('result-tier').textContent = data.tier;
                                    document.getElementById('result-tier').style.display = 'inline-block';
                                    document.getElementById('result-status').textContent = 'Complete';
                                    document.getElementById('result-status').className = 'status complete';
                                    log(`Assessment complete! Score: ${data.overall_score.toFixed(1)} (${data.tier})`, 'complete');
                                }
                            } catch (e) {}
                        }
                    }
                }
            } catch (e) {
                log('Error: ' + e.message);
            }

            btn.disabled = false;
        }

        async function loadRuns() {
            const list = document.getElementById('runs-list');
            try {
                const res = await fetch('/naaf/runs?limit=20');
                const data = await res.json();

                if (data.runs.length === 0) {
                    list.innerHTML = '<div class="empty">No research runs yet. Start a new assessment!</div>';
                    return;
                }

                list.innerHTML = data.runs.map(r => `
                    <div class="run-item" onclick="loadRun('${r.id}')">
                        <div style="display:flex;justify-content:space-between">
                            <span class="run-country">${r.country}</span>
                            <span class="run-score">${r.overall_score.toFixed(1)}/100</span>
                        </div>
                        <div class="run-meta">${r.tier} • ${new Date(r.created_at).toLocaleString()}</div>
                    </div>
                `).join('');
            } catch (e) {
                list.innerHTML = '<div class="empty">Failed to load runs</div>';
            }
        }

        async function loadRun(id) {
            try {
                const res = await fetch('/naaf/runs/' + id);
                const data = await res.json();

                document.getElementById('detail-country').textContent = data.country;
                document.getElementById('detail-date').textContent = new Date(data.generated_at).toLocaleString();
                document.getElementById('detail-score').textContent = data.overall_score.toFixed(1);
                document.getElementById('detail-tier').textContent = data.tier;

                const scores = {};
                for (const [k, v] of Object.entries(data.layers || {})) {
                    scores[parseInt(k)] = {score: v.score, max: v.max_score};
                }
                document.getElementById('detail-layers').innerHTML = renderLayers(scores);
                document.getElementById('run-detail').style.display = 'block';
            } catch (e) {
                alert('Failed to load run');
            }
        }
    </script>
</body>
</html>
"""


@app.get("/ui", response_class=HTMLResponse)
async def web_ui():
    """Built-in web UI for research and replay."""
    return WEB_UI_HTML


# Run with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
