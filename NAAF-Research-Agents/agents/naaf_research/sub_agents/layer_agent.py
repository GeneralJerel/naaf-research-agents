"""Factory for creating the 8 NAAF layer research sub-agents.

Each layer agent is an LlmAgent with:
- A layer-specific instruction prompt (metrics, sources, scoring rules)
- Access to youcom_web_search, youcom_domain_search, and score_layer tools
- An output_key so the supervisor can collect results
"""

from typing import List

from google.adk.agents import LlmAgent

from ..prompts.layer_researcher import get_layer_instruction
from ..source_registry import LAYER_SOURCES
from ..tools.youcom_search import youcom_web_search, youcom_domain_search
from ..tools.scoring import score_layer


def create_layer_agents(model: str = "gemini-3-flash-preview") -> List[LlmAgent]:
    """Create all 8 NAAF layer research agents.

    Args:
        model: The Gemini model to use for each layer agent.

    Returns:
        List of 8 LlmAgent instances, one per layer.
    """
    agents = []

    for layer_number in range(1, 9):
        layer_info = LAYER_SOURCES[layer_number]
        short_name = layer_info["short_name"].lower()

        agent = LlmAgent(
            name=f"layer_{layer_number}_{short_name}_agent",
            model=model,
            description=(
                f"Researches Layer {layer_number}: {layer_info['name']} "
                f"for a country's AI assessment. Searches authoritative sources "
                f"and produces a scored evaluation."
            ),
            instruction=get_layer_instruction(layer_number),
            tools=[youcom_web_search, youcom_domain_search, score_layer],
            output_key=f"layer_{layer_number}_result",
        )
        agents.append(agent)

    return agents
