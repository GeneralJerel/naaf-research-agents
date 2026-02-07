"""NAAF Research Agent -- root agent definition for adk web.

This module exports `root_agent`, which is the Supervisor that orchestrates
the 8-layer country AI assessment by delegating to specialized layer
sub-agents and aggregating their scores into a final report.

Run with:
    cd NAAF-Research-Agents
    adk web agents/
"""

from google.adk.agents import LlmAgent

from .prompts.supervisor import SUPERVISOR_INSTRUCTION
from .sub_agents.layer_agent import create_layer_agents
from .tools.youcom_search import youcom_web_search, youcom_domain_search
from .tools.scoring import score_layer, calculate_overall_score
from .tools.persistence import save_final_report

# Create the 8 layer research sub-agents
layer_agents = create_layer_agents(model="gemini-3-flash-preview")

# The root_agent is discovered by `adk web` via __init__.py -> agent.py -> root_agent
root_agent = LlmAgent(
    name="naaf_supervisor",
    model="gemini-3-flash-preview",
    description=(
        "NAAF Research Supervisor: Assesses a country's AI capability across "
        "8 industry layers (Power, Chips, Cloud, Models, Data, Apps, Talent, "
        "Adoption) and produces an AI Power Score with tier classification."
    ),
    instruction=SUPERVISOR_INSTRUCTION,
    sub_agents=layer_agents,
    tools=[youcom_web_search, youcom_domain_search, score_layer, calculate_overall_score, save_final_report],
)
