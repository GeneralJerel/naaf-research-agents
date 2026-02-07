# National AI Deep Research Agents

**Fully autonomous multi-agent research system** that assesses any country's AI capability across the full supply chain — from power grids and semiconductor fabs to AI models and talent pipelines.

Type a country name. 9 agents autonomously research, score, and compile a cited report. Zero human intervention.

---

## How It Works

A **Supervisor Agent** receives a country name and delegates research to **8 specialized Layer Agents**, each targeting a different layer of the AI stack. Every agent searches live web data via the You.com Search API, scores its layer 0-100 relative to the global leader, and returns structured results with source citations. The Supervisor aggregates all scores into a weighted **AI Power Score** and classifies the country into a Power Tier.

### The 8-Layer Framework

| Layer | Weight | What It Measures |
|-------|--------|------------------|
| 1. Power & Electricity | 20% | Energy infrastructure for AI compute |
| 2. Chipset Manufacturers | 15% | Semiconductor design and fabrication |
| 3. Cloud & Data Centers | 15% | Compute infrastructure and capacity |
| 4. Model Developers | 10% | Foundation model research and training |
| 5. Platform & Data | 10% | Data accessibility and platforms |
| 6. Applications & Startups | 10% | AI ecosystem and commercialization |
| 7. Education & Talent | 10% | AI talent pipeline and research output |
| 8. Government Adoption | 10% | Policy, regulation, and public sector AI |

### Power Tiers

- **Hegemon** (80-100): Full-stack AI sovereignty — controls atoms and bits
- **Strategic Specialist** (50-79): World-class in specific layers, dependent on others
- **Adopter** (30-49): Growing ecosystem, follows leaders
- **Consumer** (0-29): Relies entirely on imported AI technology

---

## Project Structure

```
├── NAAF-Research-Agents/
│   ├── agents/naaf_research/     # Google ADK agent system (primary)
│   │   ├── agent.py              # Supervisor + sub-agent composition
│   │   ├── prompts/              # Layer-specific research prompts
│   │   ├── sub_agents/           # Layer agent factory
│   │   ├── tools/                # Search, scoring, persistence tools
│   │   ├── schemas.py            # Pydantic output contracts
│   │   └── source_registry.py   # Authoritative domains per layer
│   ├── reports/                  # Generated research reports (JSON)
│   ├── webapp/                   # React dashboard (Vite + Tailwind)
│   └── requirements.txt
├── backend/                      # FastAPI backend + alternative agent impl
│   ├── agents/                   # naaf_agent + naaf_multi agents
│   ├── api/app.py                # REST API endpoints
│   ├── tools/                    # You.com + Exa search integrations
│   └── framework/                # Layer definitions + scoring
├── web/                          # Original web UI (React + Lovable)
├── docs/                         # Documentation
│   ├── ai/                       # AI engineering + prompt docs
│   ├── engineering/              # Technical architecture docs
│   ├── product/                  # Product profile
│   └── internal/                 # Session notes + handoffs
└── hackathon-submission/         # Devpost submission materials
```

---

## Quick Start

### ADK Agent System (Primary)

```bash
cd NAAF-Research-Agents

# Create virtual environment
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Set API keys
export GOOGLE_API_KEY=your_gemini_api_key
export YDC_API_KEY=your_youcom_api_key

# Launch the ADK dev server
adk web agents/
```

Open the ADK dev UI, select `naaf_research`, and type a country name to start an assessment.

### Backend API

```bash
cd backend
pip install -r requirements.txt

export YDC_API_KEY=your_youcom_api_key
export GOOGLE_API_KEY=your_gemini_api_key  # optional

python run.py
```

- Web UI: http://localhost:8000/ui
- API Docs: http://localhost:8000/docs

### Web Dashboard

```bash
cd NAAF-Research-Agents/webapp
npm install
npm run dev
```

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Agent Orchestration | Google ADK + Gemini 3 Flash |
| Research Engine | You.com Search API (web + domain-restricted) |
| Data Layer | Supabase + structured JSON persistence |
| Backend API | FastAPI + Uvicorn |
| Frontend | React 18 / Vite / TypeScript / Tailwind CSS / Radix UI |
| Scoring | Weighted Relative Power Index with Pydantic schemas |
| Frontend Scaffolding | Lovable |

### Sponsor Tools

- **You.com Search API** — powers all agent research (web search + domain-restricted search)
- **Google ADK + Gemini** — agent orchestration, sub-agent delegation, session state
- **Supabase** — persistent data storage for the web dashboard
- **Lovable** — rapid frontend scaffolding and UI development

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | Yes | Google Gemini API key |
| `YDC_API_KEY` | Yes | You.com Search API key |
| `EXA_API_KEY` | No | Exa AI search key (optional) |

---

## Sample Reports

Pre-generated research reports are included in `NAAF-Research-Agents/reports/`:

- **United States** — Full 8-layer assessment with final report and source audit trail
- **China** — Partial assessment (layers 1-5)
- **Singapore** — Partial assessment (layers 1-4)

---

## Architecture

```
User Input (country name)
        │
        ▼
┌─────────────────┐
│  Supervisor Agent │  ← Orchestrates research, aggregates scores
└────────┬────────┘
         │ delegates to 8 sub-agents
         ▼
┌──────────────────────────────────────────┐
│  Layer 1  │  Layer 2  │  ...  │  Layer 8 │
│  Power    │  Chips    │       │  Adoption│
└─────┬────┴─────┬────┴───────┴─────┬────┘
      │          │                   │
      ▼          ▼                   ▼
┌──────────────────────────────────────────┐
│         You.com Search API               │
│  (domain-restricted per layer)           │
└──────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────┐
│  Scoring Engine                          │
│  Weighted RPI → Tier Classification      │
└──────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────┐
│  Persistence Layer                       │
│  Layer JSONs → Final Report → Sources    │
└──────────────────────────────────────────┘
```

---

## License

MIT — Continual Learning Hackathon 2026
