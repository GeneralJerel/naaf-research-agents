# Architecture: Country Deep Research (8x8)

## Goal
Given a **country name**, run **8 deep research queries per layer** (64 total) using public government and international sources, extract evidence, normalize metrics, and output a scored AI Power profile.

## High-Level Flow
1. **Input**: Country name + optional year range (default 2023–2025).
2. **Supervisor Agent** receives the country name via `adk web` chat UI.
3. **Supervisor delegates** to 8 layer sub-agents (one per NAAF layer).
4. **Layer agents** search via You.com API with domain filters, extract metrics, and score.
5. **Supervisor aggregates** layer scores into an overall AI Power Score.
6. **Output**: Formatted report with per-layer scores, evidence citations, and tier classification.

## Agent Runtime: Google ADK + `adk web`

This implementation uses **Google Agent Development Kit (ADK) Python** with the built-in
`adk web` dev UI. No custom frontend required — run `adk web agents/` to launch the
interactive research interface at http://localhost:8000.

### Why ADK?
- Code-first Python agent framework with `LlmAgent`, `AgentTool`, and multi-agent support.
- Built-in `adk web` dev UI for rapid iteration and demo.
- Gemini model integration out of the box.
- Patterns borrowed from the official `deep-search` sample in `google/adk-samples`.

## Agent Architecture

```
                    ┌──────────────────────────────┐
                    │     naaf_supervisor           │
                    │     (root_agent, Gemini)      │
                    │     tools: search, score      │
                    └──────────┬───────────────────┘
                               │ delegates via sub_agents
        ┌──────────┬───────────┼───────────┬──────────┐
        │          │           │           │          │
   Layer 1    Layer 2     Layer 3     ...       Layer 8
   Power      Chips       Cloud                Adoption
   (20%)      (15%)       (15%)                (10%)
        │          │           │           │          │
        └──────────┴───────────┴───────────┴──────────┘
                               │
                    ┌──────────┴──────────┐
                    │  youcom_web_search   │
                    │  youcom_domain_search│
                    │  score_layer         │
                    └─────────────────────┘
```

### Supervisor Agent (`naaf_supervisor`)
- `LlmAgent` with `sub_agents=[layer_1, ..., layer_8]`.
- Receives country name from `adk web` chat.
- Delegates research to each layer agent via ADK's LLM-based transfer.
- Aggregates results using `calculate_overall_score` tool.
- Produces the final Country AI Power Report with tier classification.

### Layer Agents (x8)
- Created by factory in `sub_agents/layer_agent.py`.
- Each gets layer-specific instruction (metrics, preferred sources, scoring rules).
- Tools: `youcom_web_search`, `youcom_domain_search`, `score_layer`.
- `output_key` writes results back for the supervisor to collect.

### Tools

| Tool | Purpose |
|---|---|
| `youcom_web_search` | General web search via You.com API |
| `youcom_domain_search` | Domain-restricted search (gov/IGO sources) |
| `score_layer` | Record a scored assessment for one layer |
| `calculate_overall_score` | Compute weighted overall score + tier |

## Services & Components

### 1) Agent Package (`agents/naaf_research/`)
Standard `adk web`-compatible layout:
- `__init__.py` — `from . import agent`
- `agent.py` — exports `root_agent`
- `tools/` — You.com search + scoring tools
- `sub_agents/` — 8 layer agent factory
- `prompts/` — supervisor + layer instruction templates
- `schemas.py` — Pydantic output models
- `source_registry.py` — domain allowlist per layer

### 2) Search & Retrieval (You.com API)
- Uses **You.com Search API** (`api.ydc-index.io/search`) for web retrieval.
- `youcom_domain_search` applies `site:` filters for authoritative sources.
- Auth via `YDC_API_KEY` environment variable.
- Returns structured results (title, URL, snippet) for traceable citations.

### 3) Source Registry
- Maps each of the 8 layers to preferred domains.
- Layer agents use these domain filters when calling `youcom_domain_search`.

### 4) Scoring Engine
- `score_layer`: records per-layer score (0-100) with justification.
- `calculate_overall_score`: applies layer weights, computes overall score, assigns tier.
- Weights: Power 20%, Chips 15%, Cloud 15%, Models 10%, Data 10%, Apps 10%, Talent 10%, Adoption 10%.

### 5) Action & Export (Composio) — Optional
- Export the final scorecard to Google Sheets/Notion/Slack via Composio tools.
- Use for collaborator review, scorecard sharing, or judge-ready artifacts.

### 6) Deployment (Render) — Optional
- Host a FastAPI wrapper around the agent for production use.
- `adk web` is for development/demo only.

## Hackathon Partner Integration
- **Google ADK**: agent runtime + multi-agent orchestration.
- **You.com Search API**: retrieval for public gov/IGO sources.
- **Composio**: action layer for exporting artifacts (optional).
- **Render**: deployment target (optional).

## You.com Search Integration
- Use the Search API as the primary retrieval tool.
- `youcom_domain_search` enables `site:` filters for authoritative domains.
- Persist result metadata (title, URL, snippet) for traceable citations.

## Query Template Design (8 per layer)
For each layer, generate **query slots** that force depth + coverage:
1. **Official dataset** (primary gov/IGO data)
2. **Annual statistical report** (latest year)
3. **Methodology / metadata** (definitions, units)
4. **Policy / regulation** (national strategy or law)
5. **Cross-country benchmark** (comparative reports)
6. **Trade / supply chain** (where relevant)
7. **Market / capacity indicator** (counts, capacity, spend)
8. **Independent verification** (secondary IGO or reputable index)

Example (Layer 1: Power & Electricity, Country = Brazil)
- "Brazil industrial electricity price 2024 site:globalpetrolprices.com"
- "Brazil electricity generation capacity GW 2024 site:iea.org"
- "Brazil reserve margin electricity grid site:oecd.org"
- "Brazil energy mix nuclear hydro solar wind 2024 site:worldbank.org"

## Output JSON (contract)
```json
{
  "country": "Brazil",
  "years": [2023, 2025],
  "layers": {
    "power": {
      "score": 72.5,
      "metrics": [
        {
          "name": "industrial_electricity_price_usd_kwh",
          "value": 0.12,
          "year": 2024,
          "source_url": "https://...",
          "confidence": 0.84
        }
      ]
    }
  },
  "overall_score": 64.2,
  "sources": ["https://...", "https://..."]
}
```

## Setup & Run

```bash
cd NAAF-Research-Agents
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example agents/naaf_research/.env   # fill in API keys
adk web agents/
```

Open http://localhost:8000, select **naaf_research**, type a country name.

## Implementation Notes
- ADK handles agent-to-agent delegation automatically via LLM-based transfer.
- If data is missing, agents return `null` and mark `confidence: low`.
- Agents only call tools in the registered allowlist (search, score).
- Cache results per (country, layer, year range) for repeated queries.
