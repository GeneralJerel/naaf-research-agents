# Google ADK Migration Plan

## Overview

Migrate from AWS Strands Agents SDK to Google Agent Development Kit (ADK) for the NAAF Research Agents project.

**Why ADK:**
- Team preference for Google ecosystem
- Better integration with GCP services
- Gemini models for LLM calls
- Cloud Run deployment support
- Active development and community

## Current State (Strands)

```
strands-deepsearch-agent/
├── backend/src/agent/
│   ├── naaf_research_agent.py    # Strands-based orchestration
│   ├── naaf_framework.py         # Framework definitions (reusable)
│   ├── research_store.py         # Persistence layer (reusable)
│   ├── app.py                    # FastAPI endpoints (reusable)
│   └── tools/
│       ├── youcom_search.py      # You.com Search API (reusable)
│       ├── youcom_news.py        # You.com Live News (reusable)
│       └── exa_search.py         # Exa search (reusable)
```

## Target State (ADK)

```
naaf-research-agents/
├── agents/
│   ├── __init__.py
│   ├── naaf_agent/
│   │   ├── __init__.py
│   │   ├── agent.py              # Main ADK agent definition
│   │   ├── tools.py              # Tool definitions for ADK
│   │   └── prompts.py            # System prompts
│   ├── layer_research_agent/     # Sub-agent for layer research
│   └── scoring_agent/            # Sub-agent for scoring
├── tools/
│   ├── youcom_search.py          # Migrated from strands
│   ├── youcom_news.py            # Migrated from strands
│   └── exa_search.py             # Migrated from strands
├── framework/
│   ├── naaf_framework.py         # Migrated from strands
│   └── research_store.py         # Migrated from strands
├── api/
│   └── app.py                    # FastAPI endpoints
├── pyproject.toml
└── Dockerfile                    # For Cloud Run
```

## Migration Steps

### Phase 1: Setup ADK Project Structure

1. Install ADK:
   ```bash
   pip install google-adk
   ```

2. Create new project structure in naaf-research-agents/backend

3. Configure authentication:
   - Set `GOOGLE_API_KEY` for Google AI Studio, OR
   - Use Application Default Credentials for Vertex AI

### Phase 2: Migrate Framework Code (No Changes)

These files are agent-framework agnostic:
- `naaf_framework.py` - Layer definitions, metrics, scoring
- `research_store.py` - Persistence layer
- `youcom_search.py` - You.com Search API
- `youcom_news.py` - You.com Live News API
- `exa_search.py` - Exa search with date filtering

### Phase 3: Create ADK Agents

#### Main NAAF Agent (`agents/naaf_agent/agent.py`)

```python
from google.adk import Agent, Tool
from google.adk.models import Gemini

# Define tools
search_tool = Tool(
    name="search_country_layer",
    description="Search for information about a country's AI capabilities for a specific layer",
    function=search_country_layer
)

# Define the main agent
naaf_agent = Agent(
    name="NAAF Research Agent",
    model=Gemini(model="gemini-2.0-flash"),
    description="Conducts comprehensive AI readiness assessments across 8 layers",
    tools=[search_tool, news_tool, score_tool],
    sub_agents=[layer_agent, scoring_agent]
)
```

#### Layer Research Agent

```python
layer_agent = Agent(
    name="Layer Research Agent",
    model=Gemini(model="gemini-2.0-flash"),
    description="Researches a specific NAAF layer for a country",
    tools=[youcom_search_tool, exa_search_tool]
)
```

### Phase 4: Update FastAPI Integration

The existing FastAPI endpoints can be updated to call ADK agents:

```python
from agents.naaf_agent import naaf_agent

@app.post("/naaf/research")
async def conduct_research(request: NAAFResearchRequest):
    async for event in naaf_agent.stream(
        f"Assess {request.country} across all 8 NAAF layers for year {request.year}"
    ):
        yield format_sse_event(event)
```

### Phase 5: GCP Deployment

1. **Cloud Run Setup:**
   ```yaml
   # cloudbuild.yaml
   steps:
     - name: 'gcr.io/cloud-builders/docker'
       args: ['build', '-t', 'gcr.io/$PROJECT_ID/naaf-api', '.']
     - name: 'gcr.io/cloud-builders/docker'
       args: ['push', 'gcr.io/$PROJECT_ID/naaf-api']
     - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
       args: ['gcloud', 'run', 'deploy', 'naaf-api',
              '--image', 'gcr.io/$PROJECT_ID/naaf-api',
              '--region', 'us-central1']
   ```

2. **Environment Variables:**
   - `GOOGLE_API_KEY` - Gemini API key
   - `YOUCOM_API_KEY` - You.com API key (sponsor)
   - `EXA_API_KEY` - Exa API key
   - `NAAF_STORAGE_DIR` - Cloud Storage bucket path

3. **Secrets Management:**
   - Use Secret Manager for API keys
   - Mount as environment variables in Cloud Run

## Key Differences: Strands vs ADK

| Feature | Strands | ADK |
|---------|---------|-----|
| LLM Provider | AWS Bedrock | Gemini / Vertex AI |
| Tool Definition | @tool decorator | Tool class |
| Sub-agents | Custom orchestration | Built-in sub_agents |
| Streaming | Custom async generator | agent.stream() |
| Deployment | Render/AWS | Cloud Run/GKE |
| Auth | AWS credentials | GCP credentials |

## Timeline

1. **Day 1 (now):** Create ADK project structure, migrate framework code
2. **Day 1:** Create ADK tool wrappers for You.com, Exa
3. **Day 1:** Implement main NAAF agent with ADK
4. **Day 1:** Update FastAPI to use ADK agents
5. **Day 2:** Configure Cloud Run deployment
6. **Day 2:** End-to-end testing

## Environment Variables Needed

```bash
# Google/Gemini
GOOGLE_API_KEY=your_gemini_api_key

# Sponsor tools (keep these)
YOUCOM_API_KEY=ydc-sk-aef9a934fd32004c-qt1OkE61SUUD7ypntQnAB9bpbx5ffnas-fec2beff
EXA_API_KEY=your_exa_api_key

# Storage
NAAF_STORAGE_DIR=./data/research_runs
```

## Resources

- [ADK Python Documentation](https://google.github.io/adk-docs/get-started/python/)
- [ADK GitHub](https://github.com/google/adk-python)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Vertex AI Agent Builder](https://docs.cloud.google.com/agent-builder/agent-development-kit/overview)
