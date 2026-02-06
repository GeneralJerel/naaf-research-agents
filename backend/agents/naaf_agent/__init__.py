"""NAAF Research Agent - Main orchestration agent using Google ADK."""

from .agent import (
    create_naaf_agent,
    NAAFAgentConfig,
    assess_country,
    create_layer_research_agent,
    create_scoring_agent,
)
from .tools import (
    search_layer_info,
    get_live_news,
    calculate_score,
    search_with_exa,
    check_rubric_updates,
    get_layer_info,
    get_all_layers_summary,
)
from .prompts import NAAF_SYSTEM_PROMPT, LAYER_RESEARCH_PROMPT, SCORING_PROMPT

__all__ = [
    # Agent creation
    "create_naaf_agent",
    "NAAFAgentConfig",
    "assess_country",
    "create_layer_research_agent",
    "create_scoring_agent",
    # Tools
    "search_layer_info",
    "get_live_news",
    "calculate_score",
    "search_with_exa",
    "check_rubric_updates",
    "get_layer_info",
    "get_all_layers_summary",
    # Prompts
    "NAAF_SYSTEM_PROMPT",
    "LAYER_RESEARCH_PROMPT",
    "SCORING_PROMPT",
]
