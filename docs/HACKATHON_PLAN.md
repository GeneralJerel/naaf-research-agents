# Hackathon Implementation Plan

## Event: Continual Learning Hackathon
**Date:** February 6, 2026
**Location:** Intercom Inc, 55 2nd St 5th Fl, San Francisco
**Deadline:** 4:30 PM PT (submission)

## Project: NAAF Research Agents

AI-powered autonomous research agents that assess countries across 8 layers of AI readiness to produce an **AI Power Score**.

## Judging Criteria Alignment

| Criteria | Our Approach | Status |
|----------|--------------|--------|
| **Autonomy** | 64 queries per country (8 layers × 8 queries), no human intervention | 🟡 In Progress |
| **Idea** | Novel 8-layer AI Power framework with real policy value | ✅ Complete |
| **Technical Implementation** | Strands SDK + FastAPI + React | 🟡 In Progress |
| **Tool Use (3+ sponsors)** | Strands, You.com, Composio, Render | 🟡 In Progress |
| **Presentation (Demo)** | Live country research with visual scorecard | 🔴 Not Started |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Strands Supervisor Agent                    │
│         (orchestrates country research run)             │
└─────────────────────┬───────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┐
    ▼                 ▼                 ▼
┌────────┐      ┌────────┐       ┌────────┐
│Layer 1 │      │Layer 2 │  ...  │Layer 8 │
│ Agent  │      │ Agent  │       │ Agent  │
└────┬───┘      └────┬───┘       └────┬───┘
     │               │                │
     ▼               ▼                ▼
┌─────────────────────────────────────────────────────────┐
│           You.com Search API (sponsor tool)             │
│    - Domain-filtered searches for gov/IGO sources       │
│    - 8 queries per layer with source registry           │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                 Scoring Engine                           │
│    - Layer scores (0-20, 0-15, 0-10 based on weight)    │
│    - Overall AI Power Score (0-100)                     │
│    - Power Tier classification                          │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Composio Export (sponsor tool)             │
│    - Google Sheets scorecard                            │
│    - Slack notification                                 │
└─────────────────────────────────────────────────────────┘
```

## Sponsor Tool Integration

### 1. Amazon Strands Agents SDK ✅
- Agent orchestration and tool management
- Multi-agent coordination (Supervisor → Layer Agents)
- Streaming responses

### 2. You.com Search API ✅
- Primary search provider (replacing Tavily)
- Domain filtering for authoritative sources
- NAAF layer-specific search tool

### 3. Composio 🔴
- Export scorecard to Google Sheets
- Post summary to Slack
- Action layer for judge-ready artifacts

### 4. Render 🔴
- Deploy FastAPI backend
- Host React frontend

## Repository Structure

```
naaf-research-agents/
├── ideas/NAAF-Research-Agents/     # Framework documentation
│   ├── README.md                    # Concept overview
│   ├── architecture.md              # Technical architecture
│   └── assessment-framework.md      # 8-layer scoring rubric
├── apps/
│   ├── api/                         # FastAPI backend (basic scaffold)
│   └── web/                         # Next.js frontend (basic scaffold)
└── docs/
    └── HACKATHON_PLAN.md           # This file

strands-deepsearch-agent/           # Forked deep research agent
├── backend/src/agent/
│   ├── tools/youcom_search.py      # You.com integration ✅
│   ├── naaf_framework.py           # 8-layer framework ✅
│   └── research_agent.py           # Main orchestrator (needs adaptation)
└── frontend/                        # React UI (can use or replace)

National-AI-Assessment-Ranking/     # Lovable UI prototype
├── src/components/
│   ├── CountryRanking.tsx          # Ranking display
│   └── CreateReportDialog.tsx      # Report trigger
└── src/data/
    └── frameworkData.ts            # Sample data (needs API connection)
```

## Implementation Checklist

### Phase 1: Core Integration (Current)
- [x] Clone strands-deepsearch-agent
- [x] Add You.com Search API tool
- [x] Add NAAF 8-layer framework module
- [ ] Integrate You.com into enhanced_search.py as primary provider
- [ ] Adapt research_agent.py for 8-layer loop

### Phase 2: Scoring & Output
- [ ] Implement scoring engine with global benchmarks
- [ ] Generate structured JSON output matching UI interface
- [ ] Add report generation with citations

### Phase 3: Sponsor Integration
- [ ] Add Composio tools for Google Sheets export
- [ ] Add Composio tools for Slack posting
- [ ] Wire API endpoints to UI

### Phase 4: Deployment & Demo
- [ ] Deploy API to Render
- [ ] Deploy frontend (Render or Lovable)
- [ ] Prepare demo script for judges

## Demo Script

1. **Input**: Enter "Brazil" in the UI
2. **Show Autonomy**: Watch Strands agents spin up, 64 queries execute
3. **Show Tool Use**: You.com search results streaming, Composio export
4. **Output**: AI Power Score with 8-layer breakdown, tier classification
5. **Export**: Google Sheets scorecard for judges

## Team

- **tmc**: Architecture, deployment
- **Jerel**: Research framework, agent design
- **Andy (Claude)**: Implementation, integration

## Timeline

| Time | Task |
|------|------|
| 11:00 AM | Coding begins |
| 12:00 PM | Core integration complete |
| 1:30 PM | Lunch |
| 2:30 PM | Sponsor integration complete |
| 3:30 PM | Demo prep |
| 4:30 PM | Submission |
| 5:00 PM | Presentations |
