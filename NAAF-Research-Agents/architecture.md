# Architecture: Country Deep Research (8x8)

## Goal
Given a **country name**, run **8 deep research queries per layer** (64 total) using public government and international sources, extract evidence, normalize metrics, and output a scored AI Power profile.

## High-Level Flow
1. **Input**: Country name + optional year range (default 2023–2025).
2. **Orchestrator** creates a research run and schedules 8 layer tasks.
3. **Layer task** generates 8 search queries from metrics + source registry.
4. **Search + Retrieve** collects sources (prioritize gov + IGO domains).
5. **Extract + Normalize** pulls numeric metrics and policy signals.
6. **Score** per layer + overall AI Power Score.
7. **Output** JSON with evidence links and a human‑readable summary.

## Services & Components

### 1) API (FastAPI)
- `POST /research`
  - Body: `{ "country": "Brazil", "years": [2023, 2025] }`
  - Response: `{ "run_id": "uuid" }`
- `GET /research/{run_id}`
  - Returns progress + partial results.
- `GET /research/{run_id}/report`
  - Returns final JSON + summary markdown.

### 2) Orchestrator (Amazon Strands Agents SDK)
- Creates a `ResearchRun` row in Postgres.
- Spins up a Strands **Supervisor Agent** to coordinate the run.
- Enqueues 8 `LayerTask` jobs (one per layer) or spawns 8 Strands **Layer Agents**.
- Aggregates results into a `CountryReport`.

### 3) Layer Task
- Reads the layer’s **metric definitions** and **source registry**.
- Builds **8 deep queries** from:
  - Metric name
  - Country name
  - Required years (2023–2025)
  - Source filters (gov/IGO)
- Executes search → fetch → extraction → normalization.

### 4) Source Registry
- A structured map of preferred sources per metric and layer.
- Includes domain allowlist + document types.

Example (Power Layer):
- `iea.org` (reports)
- `worldbank.org` (energy data)
- `globalpetrolprices.com` (industrial electricity price)
- `oecd.org` (energy statistics)

### 5) Search & Retrieval
- Uses **You.com Search API** for web retrieval.
- Applies domain filters and year constraints.
- Saves top N results with metadata.

### 6) Extraction & Normalization
- Extract numeric values (unit conversion where needed).
- Map extracted values into schema fields.
- Attach citations and confidence scores.

### 7) Scoring Engine
- Applies layer weights from the AI Power Scorecard.
- Produces `layer_score` and `overall_score`.
- Flags missing data and low confidence layers.

### 8) Action & Export (Composio)
- Optional export to Google Sheets/Notion/Slack via Composio tools.
- Use for collaborator review, scorecard sharing, or judge-ready artifacts.

### 9) Deployment (Render)
- Host `apps/api` on Render (FastAPI service).
- Host `apps/web` on Render (static/Node service).

## Hackathon Partner Integration (Required)
This architecture explicitly uses partner tooling from the official partner resources in `docs/partners/aihack-feb6/README.md`.

- **Amazon Strands Agents SDK**: agent runtime + tool orchestration.
- **You.com Search API**: retrieval for public gov/IGO sources.
- **Composio**: action layer for exporting artifacts or triggering workflows.
- **Render**: deployment target for web + API services.

## Strands Agent Design
- **Supervisor Agent**: owns the run, validates inputs, and composes the final report.
- **Layer Agents** (x8): each focuses on one layer, runs 8 deep queries, extracts metrics, and returns structured evidence.
- **Tooling**: register tools for search, fetch, extract, normalize, score, and export.
- **Guardrails**: enforce a gov/IGO domain allowlist and 2023–2025 year filter for sources.

## You.com Search Integration
- Use the Search API as the primary retrieval tool.
- Enable query operators for `site:` filters, file types, and recency where supported.
- Persist result metadata (title, URL, snippet, published date) for traceable citations.

## Composio Action Layer (Optional)
- Export the final scorecard to Google Sheets for collaboration.
- Post an executive summary to Slack for judging or team review.

## Render Deployment Notes
- `apps/api` as a Render web service (FastAPI).
- `apps/web` as a Render static site or web service, depending on SSR needs.

## Data Model (Minimal)
- `research_runs` (id, country, status, started_at, finished_at)
- `layer_results` (id, run_id, layer, score, status)
- `metric_results` (id, layer_result_id, metric, value, unit, source_url, year, confidence)
- `sources` (id, metric_result_id, title, publisher, url, published_at)

## Query Template Design (8 per layer)
For each layer, generate 8 **query slots** that force depth + coverage:
1. **Official dataset** (primary gov/IGO data)
2. **Annual statistical report** (latest year)
3. **Methodology / metadata** (definitions, units)
4. **Policy / regulation** (national strategy or law)
5. **Cross‑country benchmark** (comparative reports)
6. **Trade / supply chain** (where relevant)
7. **Market / capacity indicator** (counts, capacity, spend)
8. **Independent verification** (secondary IGO or reputable index)

Example (Layer 8: Power & Electricity, Country = Brazil)
- "Brazil industrial electricity price 2024 site:globalpetrolprices.com"
- "Brazil electricity generation capacity GW 2024 site:iea.org"
- "Brazil reserve margin electricity grid site:oecd.org"
- "Brazil energy mix nuclear hydro solar wind 2024 site:worldbank.org"
- "Brazil electricity statistics annual report site:gov.br"
- "Brazil energy policy data center power site:gov.br"
- "Brazil electricity infrastructure report 2023 site:worldbank.org"
- "Brazil electricity price industrial kwh 2024 site:iea.org"

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

## Implementation Notes
- Start with synchronous tasks for simplicity; move to Celery/Redis when scaling.
- Cache results per (country, layer, year range).
- If data is missing, return `null` and mark `confidence: low`.
- Strands agents should only call tools registered in the allowlist (search, fetch, extract, export).
