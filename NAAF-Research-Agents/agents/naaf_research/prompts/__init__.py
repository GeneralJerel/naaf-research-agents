"""Prompt templates for the NAAF Research Agent."""
from .supervisor import SUPERVISOR_INSTRUCTION
from .layer_researcher import get_layer_instruction

__all__ = ["SUPERVISOR_INSTRUCTION", "get_layer_instruction"]
