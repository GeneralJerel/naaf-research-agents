# CLAUDE.md - AI Assistant Guidelines for NAAF Research Agents

## Critical Security Rules

### NEVER commit secrets
- **NEVER** include API keys, tokens, or credentials in code, docs, or config files
- Use environment variables or secret managers for all sensitive values
- Use placeholder values like `YOUR_API_KEY` or `your-api-key-here` in examples
- A pre-push hook with trufflehog is installed - it will block pushes with secrets

### If you receive API keys in chat
- Store them ONLY in environment variables
- NEVER write them to files that will be committed
- Use them directly via `os.getenv()` in code

## Project Structure

```
naaf-research-agents/
├── backend/           # FastAPI + research agents
│   ├── run.py         # Entry point
│   ├── api/           # REST endpoints
│   ├── agents/        # NAAF research agent
│   ├── framework/     # 8-layer definitions
│   └── tools/         # You.com, Exa search
├── web/               # React frontend (optional)
└── docs/              # Documentation
```

## Environment Variables

Required:
- `YDC_API_KEY` - You.com Search API key

Optional:
- `GOOGLE_API_KEY` - Google Gemini API key
- `EXA_API_KEY` - Exa AI search key

## Running Locally

```bash
cd backend
export YDC_API_KEY=<key>  # Get from team, never commit
python run.py
```

Web UI: http://localhost:8000/ui

## Key Commands

```bash
# Start server
python run.py

# Run single assessment
python run.py --assess "Brazil"

# Deploy to Cloud Run
./deploy.sh
```

## Code Style

- Python 3.11+
- Use async/await for I/O operations
- Graceful fallbacks when optional APIs unavailable
- All search tools should catch exceptions and return error strings

## Testing Changes

Before committing:
1. `python -m py_compile <file>` - Check syntax
2. `python run.py --help` - Verify CLI works
3. Check `/health` endpoint shows correct API status

## Git Workflow

- Pre-push hook runs trufflehog to scan for secrets
- If blocked, remove secrets and recommit
- Use `git push --no-verify` ONLY for false positives (rare)
