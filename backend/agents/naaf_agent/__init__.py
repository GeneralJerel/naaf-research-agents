"""NAAF Research Agent - Main orchestration agent."""

from .agent import (
    NAAFAgent,
    NAAFAgentConfig,
    NAAFAssessmentResult,
    LayerResearchResult,
    create_naaf_agent,
    assess_country,
    NAAF_TOOLS,
    TOOL_DEFINITIONS,
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
    # Agent classes
    "NAAFAgent",
    "NAAFAgentConfig",
    "NAAFAssessmentResult",
    "LayerResearchResult",
    # Agent creation
    "create_naaf_agent",
    "assess_country",
    # Tool registry
    "NAAF_TOOLS",
    "TOOL_DEFINITIONS",
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
