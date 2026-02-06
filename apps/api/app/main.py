from fastapi import FastAPI

from app.api.routes import copilot, health

app = FastAPI(title="Continual Learning Hackathon API")

app.include_router(health.router)
app.include_router(copilot.router)


@app.get("/")
def root() -> dict:
    return {
        "name": "continual-learning-hackathon-api",
        "docs": "/docs",
        "health": "/health",
    }
