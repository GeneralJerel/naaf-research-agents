# NAAF Research Agents - Session Handoff Document

**Date**: 2026-02-06
**Session Focus**: ADK Migration & End-to-End Implementation
**Project**: National AI Assessment Framework (NAAF) Research Agents
**Hackathon**: Continual Learning Hackathon at Intercom, SF

---

## Project Overview

NAAF (National AI Assessment Framework) is an autonomous agent system that assesses countries' AI readiness across 8 layers, producing a comprehensive "AI Power Score" (0-100) and tier classification.

### The 8-Layer Framework

| Layer | Name | Weight | Description |
|-------|------|--------|-------------|
| 1 | Power & Electricity | 20% | Energy infrastructure for AI workloads |
| 2 | Chipset Manufacturers | 15% | Semiconductor supply chain control |
| 3 | Cloud & Data Centers | 15% | Compute infrastructure sovereignty |
| 4 | Model Developers | 10% | Domestic foundation model capability |
| 5 | Platform & Data | 10% | Data accessibility and governance |
| 6 | Applications & Startups | 10% | Commercial AI ecosystem |
| 7 | Education & Consulting | 10% | AI talent pipeline |
| 8 | Implementation | 10% | Government/enterprise AI adoption |

### Power Tiers

- **Tier 1: Hegemon** (80-100): Full-stack AI sovereignty
- **Tier 2: Strategic Specialist** (50-79): Strong in specific layers
- **Tier 3: Adopter** (30-49): Good infrastructure, consumes foreign AI
- **Tier 4: Consumer** (0-29): Dependent on imported technology

---

## Current Architecture

### Backend Structure (`/backend/`)

```
backend/
├── __init__.py                    # Package init
├── run.py                         # CLI entry point
├── pyproject.toml                 # Dependencies
├── Dockerfile                     # Cloud Run deployment
├── .env.example                   # Environment template
│
├── agents/
│   ├── __init__.py
│   └── naaf_agent/
│       ├── __init__.py            # Agent exports
│       ├── agent.py               # NAAFAgent class
│       ├── tools.py               # Tool wrappers
│       └── prompts.py             # System prompts
│
├── framework/
│   ├── __init__.py
│   ├── naaf_framework.py          # Layer definitions, scoring
│   └── research_store.py          # Persistence layer
│
├── tools/
│   ├── __init__.py
│   ├── youcom_search.py           # You.com Search API
│   ├── youcom_news.py             # You.com Live News API
│   └── exa_search.py              # Exa AI (date filtering)
│
└── api/
    ├── __init__.py
    └── app.py                     # FastAPI endpoints
```

### Key Components

#### 1. NAAFAgent (`agents/naaf_agent/agent.py`)

The main orchestrating agent that:
- Researches each of the 8 layers sequentially
- Uses You.com and Exa search APIs for data collection
- Calculates layer scores based on metric coverage
- Persists results to the research store
- Supports progress callbacks for SSE streaming

```python
agent = create_naaf_agent(NAAFAgentConfig())
result = await agent.assess_country("Brazil", year=2024)
agent.save_result(result)
```

#### 2. Research Store (`framework/research_store.py`)

File-based persistence for research runs:
- Stores JSON files in `./data/research_runs/`
- Maintains an index for quick lookups
- Supports filtering by country
- Tracks framework version for rubric evolution

#### 3. FastAPI Endpoints (`api/app.py`)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check with API key status |
| `/naaf/layers` | GET | Get all 8 layer definitions |
| `/naaf/tiers` | GET | Get power tier definitions |
| `/naaf/research` | POST | Run full assessment (blocking) |
| `/naaf/research/stream` | POST | Run assessment with SSE |
| `/naaf/runs` | GET | List previous runs |
| `/naaf/runs/{id}` | GET | Get specific run details |

---

## External Dependencies

### Hackathon Sponsor Tools (3+ required)

1. **You.com Search API** - Web search with domain filtering
   - Env: `YOUCOM_API_KEY`
   - Used for: Layer-specific metric searches

2. **You.com Live News API** - Real-time news
   - Same key as Search API
   - Used for: Country AI news snapshots

3. **Exa AI** - Semantic search with date filtering
   - Env: `EXA_API_KEY`
   - Used for: Historical backfill, rubric monitoring

4. **Google Gemini** (optional) - LLM for reasoning
   - Env: `GOOGLE_API_KEY` or `GEMINI_API_KEY`
   - Model: `gemini-2.0-flash-exp`

5. **Composio** (pending) - Export integration
   - Not yet implemented

---

## What Was Completed This Session

### 1. ADK Migration
- Migrated from AWS Strands Agents SDK to standalone implementation
- Removed `@tool` decorators from You.com search functions
- Created `NAAFAgent` class with async support
- Added tool registry and Gemini function calling definitions

### 2. End-to-End Implementation
- Created `run.py` CLI entry point
- Connected FastAPI endpoints to actual agent
- Implemented SSE streaming with progress callbacks
- Added persistence integration

### 3. Deployment Configuration
- Created `Dockerfile` for Cloud Run
- Created `cloudbuild.yaml` for CI/CD
- Added `.env.example` template

---

## Pending Tasks

### High Priority

1. **Test End-to-End Flow**
   - Install dependencies: `pip install -e .`
   - Set environment variables
   - Run: `python run.py --assess "United States"`
   - Verify API: `python run.py` then `curl localhost:8000/health`

2. **Fix Scoring Logic**
   - Current scoring is placeholder (70% of max based on data coverage)
   - Need to implement actual metric extraction from search results
   - Consider using Gemini to parse values from search snippets

3. **Composio Integration**
   - Add export tool for Google Sheets
   - Create scheduled report generation
   - Track in hackathon submission

### Medium Priority

4. **Web UI Integration**
   - Frontend exists at `/web/` (React + Vite + shadcn/ui)
   - Has Admin dashboard at `/admin`
   - Needs connection to new backend API

5. **Rubric Evolution Feature**
   - `check_rubric_updates` tool exists but needs refinement
   - Should detect new Stanford HAI, Oxford Insights publications
   - Auto-suggest framework weight adjustments

### Low Priority

6. **Rate Limiting**
   - Add request throttling to avoid API limits
   - Implement caching for repeat searches

7. **Country Code Mapping**
   - Currently `country_code` is empty
   - Add ISO 3166-1 alpha-2 mapping

---

## Running the Project

### Local Development

```bash
cd /workspace/project/naaf-research-agents/backend

# Install dependencies
pip install -e .

# Set environment variables (copy .env.example to .env)
export YOUCOM_API_KEY=<key>
export EXA_API_KEY=<key>
export GOOGLE_API_KEY=<key>  # optional

# Start API server
python run.py

# Or run a single assessment
python run.py --assess "Brazil" --year 2024
```

### Docker

```bash
docker build -t naaf-api -f backend/Dockerfile backend/
docker run -p 8000:8000 \
  -e YOUCOM_API_KEY=<key> \
  -e EXA_API_KEY=<key> \
  naaf-api
```

### Cloud Run Deployment

Secrets should be stored in GCP Secret Manager:
- `naaf-youcom-api-key`
- `naaf-exa-api-key`
- `naaf-google-api-key`

Deploy with Cloud Build:
```bash
gcloud builds submit --config=cloudbuild.yaml
```

---

## Known Issues

1. **Import Paths**: The agent uses relative imports (`...framework`). Must run from backend directory or install as package.

2. **google-generativeai Optional**: Agent works without Gemini if API key not set (falls back to direct search tool calls).

3. **Data Coverage Scoring**: Current scoring is naive - counts "no results" occurrences. Needs proper metric extraction.

4. **News Article Parsing**: `news_articles` in results is raw text, not structured JSON.

---

## File Locations for Key Logic

| Concern | File | Key Functions |
|---------|------|---------------|
| Layer definitions | `framework/naaf_framework.py` | `NAAF_LAYERS`, `POWER_TIERS` |
| Scoring logic | `framework/naaf_framework.py` | `calculate_layer_score()` |
| Agent orchestration | `agents/naaf_agent/agent.py` | `NAAFAgent.assess_country()` |
| Search tools | `tools/youcom_search.py` | `naaf_layer_search()` |
| Persistence | `framework/research_store.py` | `ResearchStore.save()` |
| API endpoints | `api/app.py` | All FastAPI routes |

---

## Hackathon Judging Criteria

1. **Autonomy** - Agent researches independently across 8 layers
2. **Idea** - Novel AI readiness assessment framework
3. **Technical Implementation** - FastAPI + SSE + persistence
4. **Tool Use** - You.com, Exa, Composio (pending), Render
5. **Demo** - Admin dashboard + streaming progress UI

---

## Contact / Attribution

- Team: tmc, Jerel
- Event: Continual Learning Hackathon @ Intercom SF
- Date: February 2026

---

*This document was auto-generated during the ADK migration session. Update as implementation evolves.*
