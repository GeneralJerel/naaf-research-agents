"""NAAF Layer Agents - 8 specialized agents for each assessment layer.

Each agent is responsible for researching one specific layer of the
NAAF framework and returning a score with justification.
"""

from typing import List, Dict, Any

try:
    from google.adk import Agent
    HAS_ADK = True
except ImportError:
    # Mock Agent class if ADK not installed
    class Agent:
        def __init__(self, **kwargs):
            self.name = kwargs.get("name", "mock_agent")
            self.model = kwargs.get("model", "gemini-2.0-flash-exp")
            self.system_instruction = kwargs.get("system_instruction", "")
            self.tools = kwargs.get("tools", [])
    HAS_ADK = False

from .tools import search_layer_info, get_live_news, search_with_exa, get_layer_info


# Layer definitions for agent creation
LAYER_DEFINITIONS = {
    1: {
        "name": "Power",
        "full_name": "Power & Electricity",
        "weight": 20,
        "max_points": 20,
        "metrics": [
            "Industrial electricity generation capacity (TWh)",
            "Industrial electricity price (USD/kWh)",
            "Grid reliability and clean energy mix (%)",
            "National electricity output percentile ranking"
        ],
        "key_sources": ["IEA", "World Bank", "EIA", "IRENA"],
    },
    2: {
        "name": "Chips",
        "full_name": "Chipset Manufacturers",
        "weight": 15,
        "max_points": 15,
        "metrics": [
            "Semiconductor fabrication capacity (leading node in nm)",
            "Control of chipmaking equipment and materials supply chain"
        ],
        "key_sources": ["SEMI.org", "CHIPS.gov", "ASML reports"],
    },
    3: {
        "name": "Cloud",
        "full_name": "Cloud & Data Centers",
        "weight": 15,
        "max_points": 15,
        "metrics": [
            "Hyperscale data center count",
            "Sovereign vs foreign cloud provider market share"
        ],
        "key_sources": ["Synergy Research", "DataCenterMap", "Cloudscene"],
    },
    4: {
        "name": "Models",
        "full_name": "Model Developers",
        "weight": 10,
        "max_points": 10,
        "metrics": [
            "Domestic foundation models (LLMs on benchmarks)",
            "Supercomputing capacity (TOP500 rankings)",
            "AI patents filed"
        ],
        "key_sources": ["TOP500.org", "Stanford AI Index", "WIPO", "arXiv"],
    },
    5: {
        "name": "Data",
        "full_name": "Platform & Data",
        "weight": 10,
        "max_points": 10,
        "metrics": [
            "Open government data accessibility index",
            "Internet population size (data generation potential)"
        ],
        "key_sources": ["OECD OURdata Index", "Open Data Watch", "ITU"],
    },
    6: {
        "name": "Apps",
        "full_name": "Applications & Startups",
        "weight": 10,
        "max_points": 10,
        "metrics": [
            "AI venture capital investment (USD billions)",
            "Number of AI unicorn companies"
        ],
        "key_sources": ["Dealroom", "Crunchbase", "CB Insights"],
    },
    7: {
        "name": "Talent",
        "full_name": "Education & Consulting",
        "weight": 10,
        "max_points": 10,
        "metrics": [
            "Annual CS/AI graduates (thousands)",
            "Top university research rankings and h-index"
        ],
        "key_sources": ["UNESCO", "QS Rankings", "Times Higher Education"],
    },
    8: {
        "name": "Adoption",
        "full_name": "Implementation",
        "weight": 10,
        "max_points": 10,
        "metrics": [
            "Government AI readiness index",
            "Enterprise AI adoption rate"
        ],
        "key_sources": ["Oxford Insights", "OECD AI Policy Observatory"],
    },
}


def create_layer_agent(layer_number: int) -> Agent:
    """Create a specialized agent for a specific NAAF layer.

    Args:
        layer_number: Layer number (1-8)

    Returns:
        Configured Agent instance
    """
    layer = LAYER_DEFINITIONS[layer_number]

    metrics_list = "\n".join(f"  - {m}" for m in layer["metrics"])
    sources_list = ", ".join(layer["key_sources"])

    system_instruction = f"""You are a specialist researcher for NAAF Layer {layer_number}: {layer["full_name"]}.

## Your Role
Research and score this layer for country AI readiness assessments.
This layer has a weight of {layer["weight"]}% (max {layer["max_points"]} points).

## Metrics to Research
{metrics_list}

## Key Data Sources
Prioritize data from: {sources_list}

## Research Process
1. Use search_layer_info to find authoritative data for each metric
2. Use search_with_exa for recent developments (last 30-90 days)
3. Extract specific numbers with years and source citations
4. Assess data quality and assign confidence levels

## Scoring Guidelines
- Score range: 0 to {layer["max_points"]} points
- Base score on data availability and quality
- Higher scores require strong evidence from authoritative sources
- Document your reasoning for each sub-score

## Output Format
Return a structured assessment with:
1. Score (0-{layer["max_points"]})
2. Key findings for each metric
3. Data sources used
4. Confidence level (low/medium/high)
5. Brief justification

Be concise but thorough. Focus on factual data over speculation."""

    return Agent(
        name=f"layer_{layer_number}_{layer['name'].lower()}_agent",
        model="gemini-2.0-flash-exp",
        system_instruction=system_instruction,
        tools=[search_layer_info, search_with_exa, get_layer_info],
    )


# Create all 8 layer agents
layer_1_power_agent = create_layer_agent(1)
layer_2_chips_agent = create_layer_agent(2)
layer_3_cloud_agent = create_layer_agent(3)
layer_4_models_agent = create_layer_agent(4)
layer_5_data_agent = create_layer_agent(5)
layer_6_apps_agent = create_layer_agent(6)
layer_7_talent_agent = create_layer_agent(7)
layer_8_adoption_agent = create_layer_agent(8)

# List of all layer agents for easy iteration
ALL_LAYER_AGENTS = [
    layer_1_power_agent,
    layer_2_chips_agent,
    layer_3_cloud_agent,
    layer_4_models_agent,
    layer_5_data_agent,
    layer_6_apps_agent,
    layer_7_talent_agent,
    layer_8_adoption_agent,
]


def get_layer_agent(layer_number: int) -> Agent:
    """Get the agent for a specific layer number.

    Args:
        layer_number: Layer number (1-8)

    Returns:
        The corresponding layer agent
    """
    if layer_number < 1 or layer_number > 8:
        raise ValueError(f"Invalid layer number: {layer_number}. Must be 1-8.")
    return ALL_LAYER_AGENTS[layer_number - 1]


__all__ = [
    "layer_1_power_agent",
    "layer_2_chips_agent",
    "layer_3_cloud_agent",
    "layer_4_models_agent",
    "layer_5_data_agent",
    "layer_6_apps_agent",
    "layer_7_talent_agent",
    "layer_8_adoption_agent",
    "ALL_LAYER_AGENTS",
    "get_layer_agent",
    "create_layer_agent",
    "LAYER_DEFINITIONS",
]
