# NAAF Research Agents - Backend

National AI Assessment Framework - Autonomous research agents that assess countries' AI readiness across 8 layers.

## Quick Start

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export YDC_API_KEY=your-youcom-api-key
export GOOGLE_API_KEY=your-google-api-key  # optional

# Start the server
python run.py
```

API available at: http://localhost:8000
Docs at: http://localhost:8000/docs

### Run a Single Assessment

```bash
python run.py --assess "Brazil"
```

---

## Cloud Run Deployment

### One-Command Deploy

```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Create secrets (one-time setup)
echo -n "your-ydc-api-key" | gcloud secrets create naaf-ydc-api-key --data-file=-
echo -n "your-google-api-key" | gcloud secrets create naaf-google-api-key --data-file=-

# Deploy
./deploy.sh
```

### Manual Deploy

```bash
gcloud run deploy naaf-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets "YDC_API_KEY=naaf-ydc-api-key:latest,GOOGLE_API_KEY=naaf-google-api-key:latest"
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/naaf/layers` | GET | Get 8-layer framework definition |
| `/naaf/tiers` | GET | Get power tier definitions |
| `/naaf/research` | POST | Run country assessment |
| `/naaf/research/stream` | POST | Run with SSE streaming |
| `/naaf/runs` | GET | List previous runs |
| `/naaf/runs/{id}` | GET | Get specific run |

### Example Request

```bash
curl -X POST http://localhost:8000/naaf/research \
  -H "Content-Type: application/json" \
  -d '{"country": "Brazil", "year": 2024}'
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `YDC_API_KEY` | Yes | You.com Search API key |
| `GOOGLE_API_KEY` | No | Google Gemini API key |
| `EXA_API_KEY` | No | Exa AI search key |
| `PORT` | No | Server port (default: 8000) |
| `NAAF_STORAGE_DIR` | No | Research storage path |

---

## The 8-Layer Framework

| Layer | Weight | Description |
|-------|--------|-------------|
| 1. Power & Electricity | 20% | Energy infrastructure |
| 2. Chipset Manufacturers | 15% | Semiconductor supply chain |
| 3. Cloud & Data Centers | 15% | Compute infrastructure |
| 4. Model Developers | 10% | Foundation models |
| 5. Platform & Data | 10% | Data accessibility |
| 6. Applications & Startups | 10% | AI ecosystem |
| 7. Education & Consulting | 10% | Talent pipeline |
| 8. Implementation | 10% | AI adoption |

### Power Tiers

- **Tier 1: Hegemon** (80-100): Full-stack AI sovereignty
- **Tier 2: Strategic Specialist** (50-79): Strong in specific layers
- **Tier 3: Adopter** (30-49): Consumes foreign AI
- **Tier 4: Consumer** (0-29): Fully dependent

---

## Project Structure

```
backend/
├── run.py              # CLI entry point
├── deploy.sh           # Cloud Run deploy script
├── requirements.txt    # Python dependencies
├── Dockerfile          # Container build
├── api/
│   └── app.py          # FastAPI endpoints
├── agents/
│   └── naaf_agent/     # Main research agent
├── framework/          # Layer definitions, scoring
└── tools/              # Search API integrations
```

---

## License

MIT - Continual Learning Hackathon 2026
