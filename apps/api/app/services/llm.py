from __future__ import annotations

from dataclasses import dataclass

from app.core.config import settings


@dataclass
class LLMResponse:
    text: str
    provider: str


def generate_reply(prompt: str) -> LLMResponse:
    # Placeholder implementation. Wire to provider SDK during integration.
    if not prompt.strip():
        return LLMResponse(text="", provider=settings.llm_provider)
    return LLMResponse(
        text=f"[stubbed-{settings.llm_provider}] {prompt}", provider=settings.llm_provider
    )
