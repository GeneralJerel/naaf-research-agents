# Continual Learning Hackathon Workspace

This repository bootstraps a **Copilot UI** strand for the Continual Learning Hackathon, with a modern AI stack and clear project scaffolding.

## Event Notes (Fri, Feb 6, 2026)
- Location: Intercom Inc, 55 2nd St 5th Fl, San Francisco, CA 94105, United States
- Doors open: 9:30 AM (bring Luma QR code)
- Bring government-issued photo ID (must be 18+)
- Limited capacity: entry is first-come, first-served
- No scooters or e-bikes in the venue

## Stack
- Web: Next.js (TypeScript)
- API: FastAPI (Python)
- Data: Postgres + Redis (docker-compose)

## Repo Layout
- `apps/web`: Copilot UI (Next.js)
- `apps/api`: API + agent orchestration (FastAPI)
- `infra`: local infra (Postgres/Redis)
- `skills`: reusable project skills and prompts
- `strands`: strand-specific plans (Copilot UI)
- `docs/partners`: partner docs and tool references

## Quick Start
1. Start local services:
   - `docker compose -f infra/docker-compose.yml up -d`
2. Start API:
   - `cd apps/api`
   - `python -m venv .venv && source .venv/bin/activate`
   - `pip install -r requirements.txt`
   - `uvicorn app.main:app --reload --port 8000`
3. Start web:
   - `cd apps/web`
   - `npm install`
   - `npm run dev`

## Environment
- Copy `apps/api/.env.example` to `apps/api/.env`
- Copy `apps/web/.env.local.example` to `apps/web/.env.local`

## Partner Resources
- Lovable: https://lovable.dev (code: CREATORSLOVABLE)
- Partner tools/docs: https://github.com/Creators-Corner/aihack-feb6
- Devpost & Discord links are in the hackathon announcement

## Strand
- See `strands/copilot-ui/README.md` for the Copilot UI plan, features, and UX direction.
