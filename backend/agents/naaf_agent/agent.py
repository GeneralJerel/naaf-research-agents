"""NAAF Research Agent - Main ADK agent definition.

This module defines the main NAAF (National AI Assessment Framework) agent
using Google's Agent Development Kit (ADK).

The agent conducts comprehensive assessments of countries' AI capabilities
across 8 layers, from physical infrastructure to economic implementation.
"""

from dataclasses import dataclass
from typing import Optional, List, Dict, Any

from google.adk import Agent
from google.adk.models import Gemini

from .prompts import NAAF_SYSTEM_PROMPT, LAYER_RESEARCH_PROMPT, SCORING_PROMPT
from .tools import (
    search_layer_info,
    get_live_news,
    calculate_score,
    search_with_exa,
    check_rubric_updates,
    get_layer_info,
    get_all_layers_summary,
)
from ...framework import NAAF_LAYERS, get_tier


@dataclass
class NAAFAgentConfig:
    """Configuration for the NAAF Research Agent."""
    model: str = "gemini-2.0-flash"
    max_research_loops: int = 3
    include_news: bool = True
    check_rubric_updates: bool = False
    verbose: bool = True


def create_layer_research_agent(config: NAAFAgentConfig) -> Agent:
    """
    Create a sub-agent specialized for researching individual layers.

    This agent focuses on finding metrics and data for a specific NAAF layer.
    """
    return Agent(
        name="layer_researcher",
        model=Gemini(model=config.model),
        description="Researches a specific NAAF layer for a country, finding metrics and data from authoritative sources.",
        instructions="""You are a research specialist focused on finding specific metrics for NAAF layers.

Your task is to:
1. Search for authoritative data using the provided tools
2. Extract specific metrics with values and years
3. Identify the source URLs for all data points
4. Report findings in a structured format

Always prioritize government and international organization sources.
Report the year of the data and note any data gaps.""",
        tools=[
            search_layer_info,
            search_with_exa,
            get_layer_info,
        ]
    )


def create_scoring_agent(config: NAAFAgentConfig) -> Agent:
    """
    Create a sub-agent specialized for calculating scores.

    This agent analyzes research findings and calculates layer and overall scores.
    """
    return Agent(
        name="scorer",
        model=Gemini(model=config.model),
        description="Calculates NAAF scores based on research findings.",
        instructions="""You are a scoring specialist for the NAAF framework.

Your task is to:
1. Analyze the research findings for each layer
2. Calculate scores based on the metrics found
3. Apply the correct weights for each layer
4. Determine the overall AI Power Score and tier

Be objective and data-driven. Clearly explain your scoring rationale.""",
        tools=[
            calculate_score,
            get_layer_info,
            get_all_layers_summary,
        ]
    )


def create_naaf_agent(config: Optional[NAAFAgentConfig] = None) -> Agent:
    """
    Create the main NAAF Research Agent.

    This is the orchestrating agent that coordinates layer research
    and scoring across all 8 NAAF layers.

    Args:
        config: Optional configuration for the agent

    Returns:
        Configured ADK Agent for NAAF research
    """
    if config is None:
        config = NAAFAgentConfig()

    # Create sub-agents
    layer_agent = create_layer_research_agent(config)
    scoring_agent = create_scoring_agent(config)

    # Build tool list
    tools = [
        search_layer_info,
        get_live_news,
        calculate_score,
        search_with_exa,
        get_layer_info,
        get_all_layers_summary,
    ]

    if config.check_rubric_updates:
        tools.append(check_rubric_updates)

    # Create main agent
    naaf_agent = Agent(
        name="naaf_research_agent",
        model=Gemini(model=config.model),
        description="Conducts comprehensive AI readiness assessments of countries across 8 NAAF layers.",
        instructions=NAAF_SYSTEM_PROMPT,
        tools=tools,
        sub_agents=[layer_agent, scoring_agent]
    )

    return naaf_agent


async def assess_country(
    country: str,
    year: int = 2024,
    config: Optional[NAAFAgentConfig] = None
) -> Dict[str, Any]:
    """
    Run a full NAAF assessment for a country.

    This is a convenience function that creates an agent and runs
    a complete assessment across all 8 layers.

    Args:
        country: Country name to assess
        year: Target year for data
        config: Optional agent configuration

    Returns:
        Dictionary with assessment results
    """
    if config is None:
        config = NAAFAgentConfig()

    agent = create_naaf_agent(config)

    prompt = f"""Conduct a comprehensive NAAF assessment for {country} for the year {year}.

Research all 8 layers:
1. Power & Electricity (20%)
2. Chipset Manufacturers (15%)
3. Cloud & Data Centers (15%)
4. Model Developers (10%)
5. Platform & Data (10%)
6. Applications & Startups (10%)
7. Education & Consulting (10%)
8. Implementation (10%)

For each layer:
1. Search for authoritative data
2. Extract specific metrics with values
3. Calculate a score from 0 to the layer's max points
4. Cite your sources

After researching all layers, calculate:
- Overall AI Power Score (0-100)
- Power Tier (Hegemon, Strategic Specialist, Adopter, or Consumer)
- Key findings and recommendations

Be thorough and data-driven. Cite all sources with URLs."""

    # Run the agent
    result = await agent.run(prompt)

    return {
        "country": country,
        "year": year,
        "response": result,
        "agent_name": agent.name,
        "model": config.model,
    }


# Export main functions
__all__ = [
    "create_naaf_agent",
    "NAAFAgentConfig",
    "assess_country",
    "create_layer_research_agent",
    "create_scoring_agent",
]
