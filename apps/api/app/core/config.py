from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    env: str = os.getenv("ENV", "local")
    api_port: int = int(os.getenv("API_PORT", "8000"))
    database_url: str = os.getenv(
        "DATABASE_URL", "postgresql+psycopg2://chalk:chalk@localhost:5432/chalk"
    )
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    llm_provider: str = os.getenv("LLM_PROVIDER", "placeholder")
    llm_api_key: str = os.getenv("LLM_API_KEY", "")


settings = Settings()
