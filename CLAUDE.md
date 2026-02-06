# CLAUDE.md - NAAF Research Agents

> AI Assistant Guidelines for the National AI Assessment Framework

## Critical Security Rules

### NEVER Commit Secrets
- **NEVER** include API keys, tokens, or credentials in code, docs, or config files
- Use environment variables (`os.getenv()`) for all sensitive values
- Use placeholder values like `your-api-key-here` in examples and documentation
- A pre-push hook with trufflehog is installed - it will block pushes containing secrets
- If blocked, remove the secret, amend or create a new commit, and push again

### Handling API Keys in Chat
When a user shares API keys:
1. Store them ONLY as environment variables (`export KEY=value`)
2. NEVER write them to any files
3. NEVER echo or log them
4. Reference via `os.getenv("KEY")` in code

---

## Project Overview

NAAF (National AI Assessment Framework) is an autonomous research agent system that assesses countries' AI readiness across 8 layers, from physical infrastructure to economic implementation.

**Built for**: Continual Learning Hackathon 2026 @ Intercom, SF
**Partner APIs**: You.com Search ($100 credit), Google Gemini ($20 credit)

### The 8-Layer Framework

| Layer | Name | Weight | Description |
|-------|------|--------|-------------|
| 1 | Power & Electricity | 20% | Energy infrastructure for data centers |
| 2 | Chipset Manufacturers | 15% | Semiconductor supply chain control |
| 3 | Cloud & Data Centers | 15% | Compute infrastructure sovereignty |
| 4 | Model Developers | 10% | Foundation model training capacity |
| 5 | Platform & Data | 10% | Data accessibility and governance |
| 6 | Applications & Startups | 10% | AI ecosystem and venture capital |
| 7 | Education & Consulting | 10% | Talent pipeline and research |
| 8 | Implementation | 10% | Government and enterprise adoption |

### Power Tiers

| Tier | Score Range | Description |
|------|-------------|-------------|
| Tier 1: Hegemon | 80-100 | Full-stack AI sovereignty |
| Tier 2: Strategic Specialist | 50-79 | Strong in specific layers, dependent on others |
| Tier 3: Adopter | 30-49 | Consumes foreign AI technology |
| Tier 4: Consumer | 0-29 | Fully dependent on imports |

---

## Project Structure

```
naaf-research-agents/
├── CLAUDE.md              # This file - AI assistant guidelines
├── backend/
│   ├── run.py             # CLI entry point
│   ├── deploy.sh          # Cloud Run deployment script
│   ├── Dockerfile         # Container build
│   ├── requirements.txt   # Python dependencies
│   ├── api/
│   │   └── app.py         # FastAPI endpoints + embedded Web UI
│   ├── agents/
│   │   └── naaf_agent/
│   │       ├── agent.py   # Main NAAFAgent class
│   │       ├── tools.py   # Search tool wrappers
│   │       └── prompts.py # System prompts
│   ├── framework/
│   │   ├── naaf_framework.py  # 8-layer definitions
│   │   └── research_store.py  # Persistence layer
│   └── tools/
│       ├── youcom_search.py   # You.com Search API
│       ├── youcom_news.py     # You.com News API
│       └── exa_search.py      # Exa AI (optional)
├── web/                   # React frontend (optional)
└── docs/
    └── ADK_MIGRATION_PLAN.md  # Architecture decisions
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `YDC_API_KEY` | **Yes** | You.com Search API key |
| `GOOGLE_API_KEY` | No | Google Gemini API key |
| `EXA_API_KEY` | No | Exa AI search key (adds date filtering) |
| `NAAF_STORAGE_DIR` | No | Storage path for research runs |
| `PORT` | No | Server port (default: 8000) |

**Minimum setup**: Only `YDC_API_KEY` is required. The agent gracefully handles missing optional APIs.

---

## Quick Commands

```bash
# Navigate to backend
cd backend

# Set required environment variable (get from team, NEVER commit)
export YDC_API_KEY=<key>

# Start the server
python run.py

# Run a single country assessment
python run.py --assess "Brazil"

# Deploy to Cloud Run
./deploy.sh
```

### Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `http://localhost:8000/ui` | Built-in Web UI |
| `http://localhost:8000/docs` | Swagger API docs |
| `http://localhost:8000/health` | Health check (shows API availability) |
| `http://localhost:8000/naaf/research` | POST - Run assessment |
| `http://localhost:8000/naaf/research/stream` | POST - Run with SSE streaming |
| `http://localhost:8000/naaf/runs` | GET - List saved runs |

---

## Architecture Decisions

### Agent Design
- Uses Google Gemini (`gemini-2.0-flash-exp`) for LLM reasoning
- Tool-based architecture with function calling
- Async/await throughout for concurrent layer research
- SSE (Server-Sent Events) for real-time progress streaming

### Search Strategy
- **Primary**: You.com Search API for authoritative sources (IEA, World Bank, OECD)
- **Secondary**: Exa AI for date-filtered recent developments (optional)
- **Fallback**: Graceful degradation when APIs unavailable

### Persistence
- JSON-based research store in `data/research_runs/`
- Each run gets a unique ID with timestamp
- Full replay capability in Web UI

---

## Code Conventions

### Python Style
- Python 3.11+
- Async/await for all I/O operations
- Type hints on all function signatures
- Dataclasses for structured data

### Error Handling
- All search tools catch exceptions and return error strings (never raise)
- Optional APIs return informative messages when unavailable
- Health endpoint shows boolean status for each integration

### Import Pattern
The codebase uses try/except for imports to support both package and direct execution:
```python
try:
    from ...framework import NAAF_LAYERS  # Package mode
except ImportError:
    from framework import NAAF_LAYERS      # Direct execution
```

---

## Testing Changes

Before committing:

1. **Syntax check**: `python -m py_compile <file>`
2. **Import check**: `python -c "from agents.naaf_agent import NAAFAgent"`
3. **Server check**: `python run.py` then verify `/health` endpoint
4. **Secret scan**: Pre-push hook runs automatically, but you can run manually:
   ```bash
   trufflehog git file://. --only-verified
   ```

---

## Git Workflow

### Pre-push Hook
A trufflehog-based pre-push hook is installed at `.git/hooks/pre-push`. It:
- Scans all commits for secrets before push
- Blocks push if any secrets detected
- Shows which file/line contains the secret

### If Push is Blocked
1. Remove the secret from the file
2. Commit the fix: `git commit -am "Remove secret"`
3. Push again

Use `git push --no-verify` **ONLY** for verified false positives (rare).

### Commit Messages
- Keep commits atomic and descriptive
- Reference layer numbers when relevant (e.g., "Fix Layer 3 cloud metrics query")

---

## Cloud Run Deployment

### Prerequisites
1. `gcloud` CLI installed and authenticated
2. APIs enabled: `run.googleapis.com`, `secretmanager.googleapis.com`
3. Secrets created in Secret Manager:
   ```bash
   echo -n 'your-key' | gcloud secrets create naaf-ydc-api-key --data-file=-
   echo -n 'your-key' | gcloud secrets create naaf-google-api-key --data-file=-
   ```

### Deploy
```bash
cd backend
./deploy.sh
```

The script handles building, deploying, and secret injection automatically.

---

## Troubleshooting

### "YDC_API_KEY not configured"
Set the environment variable: `export YDC_API_KEY=your-key`

### "Exa search failed: EXA_API_KEY not configured"
This is expected if Exa is not set up. The agent works without it.

### Import errors with relative imports
Run from the `backend/` directory: `cd backend && python run.py`

### trufflehog blocks my push
You have a secret in your commit. Check the output, remove it, and commit again.

---

## Demo Checklist

1. Start server: `python run.py`
2. Open Web UI: `http://localhost:8000/ui`
3. Run assessment for a country (e.g., "Singapore")
4. Watch real-time progress via SSE
5. Check "Saved Runs" tab for replay
6. Verify `/health` shows `ydc_available: true`
