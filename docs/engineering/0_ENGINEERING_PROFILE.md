# NAAF Research Agents — Engineering Profile

## Tech Stack
- **Agent Framework**: Google ADK (Agent Development Kit) Python v1.24.1
- **Model**: Gemini 2.5 Flash via Google AI
- **Search API**: You.com Web Search API (`api.ydc-index.io`)
- **Language**: Python 3.11+
- **Schema Validation**: Pydantic v2
- **HTTP Client**: httpx (async)
- **Dev UI**: `adk web` (built-in ADK dev server)

## Project Structure
```
NAAF-Research-Agents/
  agents/naaf_research/         # ADK agent package
    __init__.py                 # from . import agent
    agent.py                    # root_agent (Supervisor)
    tools/
      youcom_search.py          # You.com API search tools
      scoring.py                # Scoring engine tools
    sub_agents/
      layer_agent.py            # Factory for 8 layer agents
    prompts/
      supervisor.py             # Supervisor instruction
      layer_researcher.py       # Per-layer prompt templates
    schemas.py                  # Pydantic output models
    source_registry.py          # Domain allowlist per layer
  requirements.txt              # Python dependencies
  .env.example                  # API key template
  architecture.md               # System design document
  assessment-framework.md       # NAAF scoring framework
```

## Key Design Decisions
1. **ADK web-compatible layout**: `__init__.py` → `agent.py` → `root_agent` pattern
   enables `adk web agents/` auto-discovery.
2. **Plain functions as tools**: ADK auto-wraps Python functions as `FunctionTool`.
   No decorator needed — just pass functions in `tools=[]`.
3. **Async You.com client**: Uses `httpx.AsyncClient` for non-blocking search calls.
4. **Layer agent factory**: Single `create_layer_agents()` generates all 8 agents
   with layer-specific prompts and domain filters.
5. **Scoring as tools**: Both `score_layer` and `calculate_overall_score` are tools
   so the LLM can call them during the research workflow.

## How It Works
1. User types country name in `adk web` chat
2. `naaf_supervisor` (root_agent) receives the message
3. Supervisor transfers control to layer sub-agents one by one
4. Each layer agent runs 2-3 searches via `youcom_web_search` / `youcom_domain_search`
5. Layer agent calls `score_layer` with its assessment
6. After all layers complete, supervisor calls `calculate_overall_score`
7. Supervisor synthesizes final report and returns to user

## Environment Variables
| Variable | Required | Description |
|---|---|---|
| `GOOGLE_API_KEY` | Yes | Gemini API key for ADK agents |
| `YDC_API_KEY` | Yes | You.com Search API key |
