# Multi-Agent Architecture for NAAF

This document describes the recommended multi-agent architecture using Google ADK.

## Overview

Instead of a single agent researching all 8 layers sequentially, we use:
- **1 Supervisor Agent** (`naaf_supervisor`) - Orchestrates the assessment
- **8 Layer Agents** - Specialized agents for each NAAF layer
- **1 Aggregation Function** (`calculate_overall`) - Computes final score

## Architecture Diagram

```
                    ┌─────────────────────┐
                    │   naaf_supervisor   │
                    │   (orchestrator)    │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│layer_1_power  │    │layer_2_chips  │    │layer_3_cloud  │
│    agent      │    │    agent      │    │    agent      │
└───────────────┘    └───────────────┘    └───────────────┘
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│layer_4_models │    │layer_5_data   │    │layer_6_apps   │
│    agent      │    │    agent      │    │    agent      │
└───────────────┘    └───────────────┘    └───────────────┘
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│layer_7_talent │    │layer_8_adopt  │    │calculate_     │
│    agent      │    │    agent      │    │   overall     │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Agent Definitions

### Supervisor Agent

```python
from google.adk import Agent, Tool

naaf_supervisor = Agent(
    name="naaf_supervisor",
    model="gemini-2.0-flash-exp",
    system_instruction="""You are the NAAF Research Supervisor.
    Your job is to coordinate a comprehensive AI readiness assessment for a country.

    For each assessment:
    1. Delegate research to each of the 8 layer agents
    2. Wait for all layer scores
    3. Call calculate_overall to compute the final score
    4. Compile the final report with tier classification

    Power Tiers:
    - Tier 1: Hegemon (80-100) - Full-stack AI sovereignty
    - Tier 2: Strategic Specialist (50-79) - Strong in specific layers
    - Tier 3: Adopter (30-49) - Consumes foreign AI
    - Tier 4: Consumer (0-29) - Fully dependent
    """,
    sub_agents=[
        layer_1_power_agent,
        layer_2_chips_agent,
        layer_3_cloud_agent,
        layer_4_models_agent,
        layer_5_data_agent,
        layer_6_apps_agent,
        layer_7_talent_agent,
        layer_8_adoption_agent,
    ],
    tools=[calculate_overall],
)
```

### Layer Agent Template

Each layer agent follows this pattern:

```python
def create_layer_agent(layer_number: int, layer_name: str, weight: float, metrics: list):
    return Agent(
        name=f"layer_{layer_number}_{layer_name.lower().replace(' ', '_')}_agent",
        model="gemini-2.0-flash-exp",
        system_instruction=f"""You are a specialist researcher for NAAF Layer {layer_number}: {layer_name}.

        This layer has a weight of {weight}% in the overall assessment.

        Your metrics to research:
        {chr(10).join(f'- {m}' for m in metrics)}

        For each metric:
        1. Search for authoritative data (IEA, World Bank, OECD, etc.)
        2. Extract specific numbers with years and sources
        3. Assess data quality and confidence

        Return a structured score (0 to {weight}) with justification.
        """,
        tools=[search_layer_info, search_with_exa, get_live_news],
    )
```

### Layer Agent Instances

```python
layer_1_power_agent = create_layer_agent(
    layer_number=1,
    layer_name="Power",
    weight=20,
    metrics=[
        "Industrial electricity capacity (TWh)",
        "Electricity cost (USD/kWh)",
        "Grid reliability & clean energy mix",
        "National output percentile"
    ]
)

layer_2_chips_agent = create_layer_agent(
    layer_number=2,
    layer_name="Chips",
    weight=15,
    metrics=[
        "Semiconductor fabrication capacity (nm node)",
        "Equipment & supply chain control"
    ]
)

layer_3_cloud_agent = create_layer_agent(
    layer_number=3,
    layer_name="Cloud",
    weight=15,
    metrics=[
        "Hyperscale data center count",
        "Sovereign cloud market share"
    ]
)

layer_4_models_agent = create_layer_agent(
    layer_number=4,
    layer_name="Models",
    weight=10,
    metrics=[
        "Domestic foundation models",
        "Supercomputing capacity (TOP500)"
    ]
)

layer_5_data_agent = create_layer_agent(
    layer_number=5,
    layer_name="Data",
    weight=10,
    metrics=[
        "Open data index score",
        "Internet population size"
    ]
)

layer_6_apps_agent = create_layer_agent(
    layer_number=6,
    layer_name="Apps",
    weight=10,
    metrics=[
        "AI venture capital investment",
        "AI unicorn count"
    ]
)

layer_7_talent_agent = create_layer_agent(
    layer_number=7,
    layer_name="Talent",
    weight=10,
    metrics=[
        "CS/AI graduates annually",
        "Top university research rankings"
    ]
)

layer_8_adoption_agent = create_layer_agent(
    layer_number=8,
    layer_name="Adoption",
    weight=10,
    metrics=[
        "Government AI readiness index",
        "Enterprise AI adoption rate"
    ]
)
```

### Aggregation Tool

```python
@tool
def calculate_overall(
    layer_1_score: float,
    layer_2_score: float,
    layer_3_score: float,
    layer_4_score: float,
    layer_5_score: float,
    layer_6_score: float,
    layer_7_score: float,
    layer_8_score: float,
) -> dict:
    """Calculate the overall NAAF score and determine power tier."""
    total = sum([
        layer_1_score,  # max 20
        layer_2_score,  # max 15
        layer_3_score,  # max 15
        layer_4_score,  # max 10
        layer_5_score,  # max 10
        layer_6_score,  # max 10
        layer_7_score,  # max 10
        layer_8_score,  # max 10
    ])

    # Determine tier
    if total >= 80:
        tier = "Tier 1: Hegemon"
        description = "Full-stack AI sovereignty"
    elif total >= 50:
        tier = "Tier 2: Strategic Specialist"
        description = "Strong in specific layers, dependent on others"
    elif total >= 30:
        tier = "Tier 3: Adopter"
        description = "Consumes foreign AI technology"
    else:
        tier = "Tier 4: Consumer"
        description = "Fully dependent on imports"

    return {
        "overall_score": round(total, 2),
        "tier": tier,
        "tier_description": description,
        "layer_scores": {
            "1_power": layer_1_score,
            "2_chips": layer_2_score,
            "3_cloud": layer_3_score,
            "4_models": layer_4_score,
            "5_data": layer_5_score,
            "6_apps": layer_6_score,
            "7_talent": layer_7_score,
            "8_adoption": layer_8_score,
        }
    }
```

## Running with ADK

```python
from google.adk import Application

# Create the application
app = Application(
    name="naaf_research",
    agent=naaf_supervisor,
)

# Run with dev UI
if __name__ == "__main__":
    app.run(port=8000)
```

Access the dev UI at: `http://127.0.0.1:8000/dev-ui/?app=naaf_research`

## Benefits Over Single Agent

| Aspect | Single Agent | Multi-Agent |
|--------|--------------|-------------|
| Execution | Sequential | Parallel |
| Context | Crowded (all 8 layers) | Focused (1 layer each) |
| Debugging | Opaque | Visual via dev-ui |
| Fault tolerance | All or nothing | Partial results possible |
| Demo appeal | Basic | Shows agent orchestration |

## File Structure

```
backend/
├── agents/
│   └── naaf_multi/
│       ├── __init__.py
│       ├── app.py           # ADK Application entry point
│       ├── supervisor.py    # naaf_supervisor agent
│       ├── layer_agents.py  # All 8 layer agents
│       └── tools.py         # search_layer_info, calculate_overall, etc.
└── run_adk.py               # Alternative entry point for ADK
```

## Quick Implementation

To convert the current codebase to multi-agent:

1. Install ADK: `pip install google-adk`
2. Create `agents/naaf_multi/` directory
3. Implement the agents as shown above
4. Create `run_adk.py` that starts the ADK application
5. Run: `python run_adk.py` or `adk run`

The existing tools in `tools/` (youcom_search, exa_search) can be wrapped as ADK tools with the `@tool` decorator.
