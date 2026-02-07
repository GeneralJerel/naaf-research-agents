# NAAF Research Agents — ADK Agent System

The primary autonomous research system built on **Google ADK + Gemini 3 Flash** with **You.com Search API** for real-time web research.

## Overview

A Supervisor agent orchestrates 8 specialized Layer Agents, each researching a specific dimension of a country's AI capability. Agents use domain-restricted search to target authoritative sources, score each layer 0-100 relative to the global leader, and persist structured JSON reports with full source audit trails.

## Running

```bash
# Setup
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# API keys
export GOOGLE_API_KEY=your_gemini_api_key
export YDC_API_KEY=your_youcom_api_key

# Launch ADK dev server
adk web agents/
```

Select `naaf_research` in the ADK UI and type a country name.

## Agent Architecture

```
agents/naaf_research/
├── agent.py                # Root agent — Supervisor + 8 Layer sub-agents
├── prompts/
│   ├── supervisor.py       # Supervisor system prompt
│   └── layer_researcher.py # Dynamic prompt builder per layer
├── sub_agents/
│   └── layer_agent.py      # Layer agent factory
├── tools/
│   ├── youcom_search.py    # You.com web + domain-restricted search
│   ├── scoring.py          # Weighted scoring engine + tier classification
│   └── persistence.py      # Real-time JSON report writer
├── schemas.py              # Pydantic output contracts
└── source_registry.py      # Authoritative domains per layer
```

## The 8 Layers

| # | Layer | Weight | Key Sources |
|---|-------|--------|-------------|
| 1 | Power & Electricity | 20% | IEA, EIA.gov, IRENA |
| 2 | Chipset Manufacturers | 15% | SEMI, CHIPS.gov, TSMC |
| 3 | Cloud & Data Centers | 15% | Synergy Research, TOP500 |
| 4 | Model Developers | 10% | Stanford AI Index, arXiv |
| 5 | Platform & Data | 10% | OECD, World Bank |
| 6 | Applications & Startups | 10% | Crunchbase, WIPO |
| 7 | Education & Talent | 10% | QS Rankings, H-index data |
| 8 | Government Adoption | 10% | OECD AI Policy, UNESCO |

## Output

Reports are written to `reports/{country}_{timestamp}/`:

```
reports/united_states_of_america_20260206_235930/
├── layers/
│   ├── layer_1_power.json
│   ├── layer_2_chips.json
│   ├── ...
│   └── layer_8_adoption.json
├── final_report.json        # Aggregated scores + tier + executive summary
└── sources.json             # Every URL cited, with metadata
```

## Web Dashboard

```bash
cd webapp
npm install
npm run dev
```

React dashboard with country rankings, layer drill-downs, source citations, and agent research progress visualization.
