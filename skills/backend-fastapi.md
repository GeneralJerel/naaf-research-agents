# Skill: FastAPI Backend

## Goal
Ship a reliable API surface for copilot interactions and agent tool wiring.

## Checklist
- Maintain a `/health` endpoint for quick checks.
- Provide a `/copilot/message` POST endpoint for the UI.
- Validate inputs with Pydantic models.
- Add a stub LLM adapter so switching providers is easy.
- Capture basic telemetry (request id, latency) if time permits.

## Quick Steps
- Update `app/services/llm.py` with the provider SDK.
- Add tool routes under `app/api/routes/` for integrations.
- Update the UI to expose new tools or actions.

## Demo Notes
- Keep response times under 1 second for demo.
- Preload 1-2 canned outputs to avoid runtime surprises.
