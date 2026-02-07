# ADK Agent Setup Guide

## Prerequisites
- Python 3.11+
- Google AI API key (Gemini)
- You.com Search API key

## Quick Start

```bash
# Navigate to the project
cd NAAF-Research-Agents

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Configure API keys
cp .env.example agents/naaf_research/.env
# Edit agents/naaf_research/.env with your actual keys

# Launch the ADK dev UI
adk web agents/
```

## Environment Configuration

Create `agents/naaf_research/.env`:
```env
GOOGLE_API_KEY=your-google-ai-key
YDC_API_KEY=your-youcom-api-key
```

### Getting API Keys

**Google AI (Gemini)**:
1. Go to https://aistudio.google.com/apikey
2. Create an API key
3. Set as `GOOGLE_API_KEY`

**You.com Search API**:
1. Go to https://you.com/platform
2. Create an account and generate an API key
3. Set as `YDC_API_KEY`

## Running with `adk web`

```bash
adk web agents/
```

This starts the ADK dev server at http://localhost:8000 with:
- Agent selection dropdown (select `naaf_research`)
- Chat interface for interacting with the supervisor
- Real-time streaming of agent responses
- Tool call visibility

## Usage

1. Open http://localhost:8000 in your browser
2. Select **naaf_research** from the agent dropdown
3. Type a country name (e.g. "Brazil", "United States", "Japan")
4. Watch as the supervisor delegates to layer agents
5. Each layer agent searches, scores, and reports back
6. Final report includes overall score, tier, and citations

## Project Structure

```
agents/naaf_research/
  __init__.py          → from . import agent (ADK discovery)
  agent.py             → root_agent definition
  tools/
    youcom_search.py   → You.com Search API integration
    scoring.py         → RPI scoring engine
  sub_agents/
    layer_agent.py     → Factory for 8 layer research agents
  prompts/
    supervisor.py      → Supervisor instruction prompt
    layer_researcher.py→ Per-layer prompt templates
  schemas.py           → Pydantic output models
  source_registry.py   → Domain allowlist per layer
```

## Troubleshooting

### "YDC_API_KEY environment variable is not set"
Ensure your `.env` file is at `agents/naaf_research/.env` and contains `YDC_API_KEY`.

### "google.adk not found"
Run `pip install -r requirements.txt` with your virtual environment activated.

### Agent not appearing in dropdown
The `__init__.py` must contain `from . import agent` and `agent.py` must export
`root_agent`. Check the file structure matches the expected layout.
