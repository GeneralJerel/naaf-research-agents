from fastapi import APIRouter
from pydantic import BaseModel

from app.services.llm import generate_reply

router = APIRouter(prefix="/copilot", tags=["copilot"])


class CopilotRequest(BaseModel):
    prompt: str


class CopilotResponse(BaseModel):
    text: str
    provider: str


@router.post("/message", response_model=CopilotResponse)
def copilot_message(payload: CopilotRequest) -> CopilotResponse:
    response = generate_reply(payload.prompt)
    return CopilotResponse(text=response.text, provider=response.provider)
