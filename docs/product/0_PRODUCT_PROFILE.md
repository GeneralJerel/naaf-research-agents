# NAAF Research Agents — Product Profile

## What It Is
An AI-powered research system that assesses any country's AI capability across
8 industry layers and produces a scored **AI Power Report** with evidence citations.

## Core Concept
The **National AI Assessment Framework (NAAF)** views the AI stack as 8 layers —
from physical constraints (power, chips) through infrastructure (cloud, models)
to economic impact (apps, talent, adoption). Each layer is weighted to produce
an overall **AI Power Score (0-100)** and tier classification.

## User Experience
1. Open `adk web` dev UI at http://localhost:8000
2. Select the **naaf_research** agent
3. Type a country name (e.g. "Brazil")
4. The supervisor delegates to 8 specialized layer agents
5. Each agent searches authoritative sources via You.com API
6. Results stream back with per-layer scores and citations
7. Final report includes overall score, tier, and recommendations

## Deliverables
- **AI Power Score**: 0-100 weighted composite
- **Power Tier**: Hegemon / Strategic Specialist / Adopter / Consumer
- **Per-Layer Breakdown**: Score + key metrics + source URLs
- **Executive Summary**: Strengths, weaknesses, strategic recommendations

## The 8 Layers
| # | Layer | Weight |
|---|-------|--------|
| 1 | Power & Electricity | 20% |
| 2 | Chipset Manufacturers | 15% |
| 3 | Cloud & Data Centers | 15% |
| 4 | Model Developers | 10% |
| 5 | Platform & Data | 10% |
| 6 | Applications & Startups | 10% |
| 7 | Education & Consulting | 10% |
| 8 | Implementation | 10% |

## Web Application Pages
| Route | Description |
|-------|-------------|
| `/` | Dashboard — country rankings with layer breakdown bars, framework overview sidebar |
| `/framework` | Deep-dive article explaining the full NAAF methodology, all 8 layers with metrics & scoring rubrics, power tiers, RPI formula, and agent research protocol |
| `/report/:country` | Per-country AI Power Report with score ring, layer-by-layer analysis, sources, strategic summary |
| `/research/:country` | Live agent research view (SSE streaming during assessment) |

## Target Users
- Policy researchers comparing AI readiness across nations
- Think tanks producing AI competitiveness indices
- Government advisors evaluating national AI strategy
