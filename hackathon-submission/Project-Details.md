# National AI Deep Research Agents

**Project Name:** National AI Deep Research Agents (NAAF Research Agents)

---

> ### Judging Criteria Alignment
>
> | Criteria | How We Address It |
> |---|---|
> | **Autonomy** | Zero human intervention — type a country name and 9 agents autonomously research, score, and compile a full report from live web data |
> | **Idea** | First framework to measure true AI sovereignty across the full supply chain (power grids to model labs) — real-world value for policymakers, investors, and national security analysts |
> | **Technical Implementation** | Supervisor + 8 sub-agent architecture on Google ADK, structured JSON persistence, domain-restricted search, weighted scoring engine with tier classification |
> | **Tool Use** | **You.com Search API** (primary research engine), **Google ADK + Gemini** (agent orchestration + LLM), **Supabase** (data layer), **Lovable** (frontend scaffolding) |
> | **Presentation** | Live demo: type "United States" → watch 8 agents research in real-time → receive scored, cited report with tier classification in ~3 minutes |

---

## Inspiration

The global AI race is accelerating, but there is no standardized, data-driven way to measure which countries are truly AI-capable versus which are simply consuming imported AI technology. Existing indices (like the Oxford AI Readiness Index) cover governance readiness but miss the physical supply chain — the power grids, semiconductor fabs, cloud infrastructure, and talent pipelines that determine whether a nation can actually *build* AI or just *buy* it.

We wanted to build something with **real-world policy value**: a system that a government advisor, defense analyst, or venture investor could use right now to get a rigorous, source-cited assessment of any country's AI capability — without spending weeks on manual research. The question we set out to answer: **"If every import stopped tomorrow, how much AI could this country still produce?"**

The NAAF (National AI Assessment Framework) breaks AI capability into 8 weighted layers — mirroring how the semiconductor and AI industries are actually structured. It's the first framework designed to measure full-stack AI sovereignty, from atoms (electricity, chips) to bits (models, data, adoption).

---

## What it does

National AI Deep Research Agents is a **fully autonomous multi-agent research system**. The user provides a single input — a country name — and the system does everything else without any human intervention:

1. **A Supervisor Agent receives the country** and autonomously delegates research across 8 specialized Layer Agents — one for each layer of the AI stack:
   - Power & Electricity (20%), Chipset Manufacturers (15%), Cloud & Data Centers (15%), Model Developers (10%), Platform & Data (10%), Applications & Startups (10%), Education & Talent (10%), Government Adoption (10%)

2. **Each agent independently searches live web data** using the You.com Search API, targeting authoritative sources (IEA, World Bank, OECD, EIA.gov, TOP500, WIPO, Stanford AI Index, etc.) to find real, current data (2023-2025). No pre-loaded datasets — every fact comes from real-time web research.

3. **Agents extract specific metrics, score each layer 0-100** relative to the global leader, and produce justifications with source citations — all autonomously.

4. **The Supervisor aggregates all 8 layer scores** into a weighted overall AI Power Score and classifies the country into a Power Tier:
   - **Hegemon** (80-100): Full-stack sovereignty — controls atoms and bits
   - **Strategic Specialist** (50-79): World-class in specific layers, dependent on others
   - **Adopter** (30-49): Growing ecosystem, follows leaders
   - **Consumer** (0-29): Relies entirely on imported AI technology

5. **Persists structured JSON reports** with per-layer scores, justifications, every source URL, and an executive summary — automatically saved to disk and ready for the web dashboard.

6. **A React web dashboard** lets users view country rankings, drill into layer-by-layer assessments, and explore the full source citations backing each score.

**Key autonomy feature:** From the moment the user types a country name to the final report, there are zero prompts, zero confirmations, zero manual steps. The agents decide what to search, how to evaluate the data, how to score, and how to compile the final assessment entirely on their own.

---

## How we built it

### Sponsor Tools & Technologies

| Sponsor Tool | How We Used It |
|---|---|
| **You.com Search API** | Primary research engine for all 8 layer agents. Powers both open web search (`youcom_web_search`) and domain-restricted search (`youcom_domain_search`) for targeting authoritative sources. Every data point in our reports originates from a You.com API call. Source URLs are tracked in session state and persisted to `sources.json` for full auditability. |
| **Google ADK + Gemini 3 Flash** | Agent orchestration framework. The Supervisor and all 8 Layer Agents are `LlmAgent` instances running on Gemini 3 Flash Preview. ADK provides sub-agent delegation, session state management, tool context injection, and the `adk web` development server. |
| **Supabase** | Data layer integration in the web dashboard for storing and querying country assessment data, enabling persistent storage and real-time data access across sessions. |
| **Lovable** | Used to scaffold and rapidly build the React frontend dashboard — country ranking views, layer drill-downs, agent research progress views, and the report visualization UI. |

### Architecture — Supervisor + 8 Layer Agents

- A **Supervisor Agent** receives the country name and autonomously delegates research to 8 specialized **Layer Agents**, then aggregates their results into a final scored report.
- Each Layer Agent has a **dynamically generated instruction prompt** built from a `source_registry.py` and `layer_researcher.py` — containing layer-specific metrics, preferred authoritative domains, scoring rubrics, and a strict research protocol.
- A **Source Registry** maps each layer to curated authoritative domains (e.g., Layer 1 Power targets `iea.org`, `eia.gov`, `irena.org`; Layer 2 Chips targets `semi.org`, `chips.gov`, `tsmc.com`). This domain-restriction strategy was the single biggest improvement to research quality.

### Search & Real-Time Data

- **You.com Web Search API** — agents perform live web searches during every run. No cached or pre-loaded data. Each research session queries real-time web sources.
- **Domain-restricted search** — the `youcom_domain_search` tool restricts results to authoritative domains per layer, dramatically reducing noise and hallucination.
- **Source tracking** — every URL returned by You.com is automatically tracked in ADK session state and written to `sources.json`, providing a full audit trail of what the agent actually found vs. what it reported.

### Scoring Engine

- Implements the Relative Power Index (RPI) formula with weighted layer contributions.
- Scores are persisted both as individual layer JSON files (real-time during research) and aggregated into `final_report.json` with tier classification.
- Pydantic schemas (`schemas.py`) define the structured output contract: `MetricResult`, `LayerResult`, `CountryReport`.

### Persistence Layer

- Timestamped report directories: `reports/{country}_{timestamp}/`
- Individual layer JSONs written in real-time as each agent completes
- `final_report.json` — complete aggregated assessment
- `sources.json` — deduplicated list of every source URL with metadata
- Session state bridges independent agent runs into a coherent final output

### Frontend — React + Vite + Lovable

- React/TypeScript web app scaffolded with **Lovable**, styled with Tailwind CSS and Radix UI
- Country ranking dashboard with comparative scores
- Layer-by-layer drill-down with justifications and source citations
- Agent research view showing real-time multi-agent progress
- **Supabase** integration for persistent data storage
- TanStack Query for data fetching and cache management

### Full Tech Stack

- **Backend:** Python 3.11+ / Google ADK 1.24 / Gemini 3 Flash Preview / Pydantic / httpx
- **Research:** You.com Search API (web search + domain-restricted search)
- **Data:** Supabase / structured JSON persistence
- **Frontend:** React 18 / Vite / TypeScript / Tailwind CSS / Radix UI / Recharts / TanStack Query
- **Tooling:** Lovable (frontend scaffolding) / Vitest (testing)

---

## Challenges we ran into

1. **Migrating from AWS Strands to Google ADK mid-hackathon.** We initially built on the AWS Strands Agents SDK but decided to migrate to Google ADK for better multi-agent orchestration and native sub-agent support. This required rearchitecting tool definitions, agent composition, and state management — a significant pivot during a time-constrained event.

2. **You.com API migration.** The You.com Search API migrated from the legacy `api.ydc-index.io` endpoint to `api.you.com/v1` with a different response schema (`results.web[]` vs the old flat format). We updated parsing logic and added startup key validation to surface bad keys at import time, not mid-research.

3. **Multi-agent state coordination.** Getting 8 independent sub-agents to write results into shared session state that the supervisor could later aggregate was non-trivial. We built a persistence layer that writes individual layer JSONs to disk in real-time *and* accumulates data in session state for final report assembly — making the system both incremental and fault-tolerant.

4. **Ensuring source auditability.** AI agents can hallucinate sources. We mitigated this by: (a) restricting searches to authoritative domains per layer via the Source Registry, (b) requiring 2023-2025 data only, (c) tracking every URL returned by the You.com API in session state, and (d) persisting the full source trail to `sources.json`. If a fact is in the report, the URL that produced it is traceable.

5. **Consistent scoring across agents.** Getting 8 different agents to score consistently on a 0-100 scale relative to the global leader (not in absolute terms) required extensive prompt engineering with explicit scoring rubrics, metric definitions, and calibration anchors per layer.

---

## Accomplishments that we're proud of

- **Fully autonomous end-to-end pipeline.** Type a country name → 9 agents research, score, and compile a complete report from live web data → zero human intervention. This is real agent autonomy, not a chat wrapper.

- **Real research, real citations, real-time data.** Every data point traces back to an actual URL from an authoritative source retrieved via the You.com API during that session. No pre-loaded datasets, no fabricated citations. The `sources.json` file provides a complete audit trail.

- **A novel assessment framework.** The 8-layer NAAF framework is a genuine contribution — no existing index captures the full AI supply chain from electricity to adoption with weighted scoring and tier classification. Layer weights reflect real supply chain dependencies (power and chips matter more than apps).

- **Effective use of 4 sponsor tools working together.** You.com powers the research, Google ADK/Gemini orchestrates the agents, Supabase provides data persistence, and Lovable accelerated the frontend build. Each tool plays a distinct, essential role.

- **Structured, machine-readable output.** Reports are JSON (not markdown), immediately consumable by dashboards, APIs, and downstream analysis. The Pydantic schemas define a clear contract between agents and the frontend.

- **Production-quality agent architecture.** The supervisor-delegate pattern with dynamic prompt generation, a source registry, and structured persistence is reusable for any domain requiring multi-dimensional autonomous research.

---

## What we learned

- **Autonomy requires architecture, not just prompts.** Making agents truly autonomous (no human in the loop) required careful design of delegation flows, state management, persistence, and error handling — not just good system prompts.

- **Domain-restricted search is the key to trustworthy agent research.** Open web search produces noisy, unreliable results. Restricting to curated authoritative domains per layer (our Source Registry pattern) was the single biggest improvement to output quality and citation trustworthiness.

- **Prompt engineering is business logic.** The quality difference between a generic "research this layer" prompt and one with specific metrics, scoring rubrics, source preferences, and research protocols is enormous. Our prompt templates are effectively the domain expertise of the system.

- **Google ADK's multi-agent patterns are powerful.** Sub-agent delegation, session state sharing, tool context injection, and output keys create a clean composition model. The `adk web` dev server made rapid iteration possible.

- **You.com's Search API is uniquely suited for research agents.** The combination of web search + domain restriction + snippet extraction gives agents targeted, high-quality data retrieval — exactly what autonomous research systems need to produce cited, trustworthy outputs.

- **Sponsor tool synergy matters.** The best results came from tools that complemented each other: Lovable for rapid frontend scaffolding, Supabase for data persistence, You.com for real-time research, and Google ADK/Gemini for intelligent orchestration.

---

## What's next for National AI Deep Research Agents

1. **Complete all 8 layers end-to-end** — Our current demo produces production-quality research for layers 1-4 (Power, Chips, Cloud, Models). Layers 5-8 (Data, Apps, Talent, Adoption) have prompts and scoring defined and are ready for full deployment.

2. **Multi-country comparison mode** — Run assessments for multiple countries in parallel and produce comparative dashboards showing relative strengths across the AI stack. Enable "US vs China vs India" side-by-side reports.

3. **Historical tracking and trend analysis** — Store timestamped assessments in Supabase to track how countries' AI capabilities change over time, enabling trend analysis and early warning on capability shifts.

4. **Enhanced interactive dashboard** — Build out the React frontend with radar charts for country profiles, animated layer drill-downs, and a global map visualization of AI power tiers.

5. **Additional research sources** — Integrate Exa Search for academic paper analysis, add You.com News API for real-time capability monitoring, and incorporate structured databases (World Bank API, OECD iLibrary) for direct metric extraction.

6. **Cloud deployment** — Deploy on GCP Cloud Run with Secret Manager for API keys, enabling on-demand country assessments via a public API that anyone can query.

7. **Policy recommendation agent** — Add a synthesis agent that takes the 8-layer assessment and generates actionable policy recommendations for governments seeking to improve their AI sovereignty position.
