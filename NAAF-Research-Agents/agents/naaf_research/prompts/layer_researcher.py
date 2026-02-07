"""Per-layer research prompt templates for NAAF layer agents."""

from ..source_registry import LAYER_SOURCES


# Metric definitions per layer (used in prompts)
LAYER_METRICS = {
    1: [
        ("Industrial Capacity", "Total electricity generation (TWh) and installed capacity (GW)"),
        ("Cost Efficiency", "Industrial electricity price (USD/kWh) — lower is better"),
        ("Grid Reliability & Clean Mix", "% from nuclear, hydro, solar, wind; outage frequency"),
        ("National Output Percentile", "Country ranking in global electricity generation"),
    ],
    2: [
        ("Fabrication Capacity", "Domestic fabs: <5nm (10pts), <14nm (7pts), >28nm (3pts), none (0)"),
        ("Equipment & Supply Chain", "Control of lithography/etching tools; critical minerals access"),
    ],
    3: [
        ("Compute Density", "Hyperscale data centers (>50MW); total capacity"),
        ("Sovereign Cloud", "Domestic provider share vs foreign cloud dominance"),
    ],
    4: [
        ("Frontier Model Capacity", "Domestic foundation models >10B params; TOP500 supercomputers; AI patents"),
    ],
    5: [
        ("Data Openness", "Open government data score (OECD OURdata Index)"),
        ("Data Volume Potential", "Internet population as proxy for training data volume"),
    ],
    6: [
        ("Capital Depth", "Annual AI VC investment; AI unicorn count"),
    ],
    7: [
        ("Talent Pool", "Annual CS/AI PhD and Master's graduates"),
        ("Research Impact", "Top university CS/AI ranking; H-index"),
    ],
    8: [
        ("Government Readiness", "Oxford Insights AI Readiness Index; national AI strategy status"),
    ],
}


def get_layer_instruction(layer_number: int) -> str:
    """Generate the instruction prompt for a specific layer agent.

    Args:
        layer_number: The NAAF layer number (1-8).

    Returns:
        Formatted instruction string for the layer agent.
    """
    layer_info = LAYER_SOURCES.get(layer_number)
    if not layer_info:
        return f"Research layer {layer_number} for the given country."

    name = layer_info["name"]
    weight = layer_info["weight"]
    domains = layer_info["domains"]
    metrics = LAYER_METRICS.get(layer_number, [])

    metrics_text = "\n".join(
        f"  - **{m[0]}**: {m[1]}" for m in metrics
    )
    domains_text = ", ".join(domains)

    return f"""You are the **Layer {layer_number}: {name}** research agent.

## Your Task
Research this layer for the country you are given. You must find real data from
authoritative sources, extract specific metrics, and produce a scored assessment.

## Layer Details
- **Name**: {name}
- **Weight**: {weight}% of the overall AI Power Score
- **Description**: {layer_info.get('short_name', name)} assessment

## Metrics to Research
{metrics_text}

## Preferred Authoritative Sources
Search these domains first: {domains_text}

Use the `youcom_domain_search` tool with domains="{domains_text}" to search
these authoritative sources. Fall back to `youcom_web_search` for broader searches
if domain-restricted results are insufficient.

## Research Protocol
1. For each metric, run 2-3 targeted searches with year constraints (2023-2025)
2. Extract specific numeric values where possible
3. Note the source URL for every data point
4. If data is unavailable, explicitly state "data not found" and set confidence low

## Scoring
After gathering evidence, use the `score_layer` tool to record your assessment:
- **country**: the country name you are researching (required for report saving)
- **score_0_to_100**: 0-100 comparing the country to the global leader
- **justification**: cite your key findings and source URLs
- 100 = best in the world for this layer, 0 = no capability

## Output
End your research by calling `score_layer` with your final assessment.
Always include the `country` parameter so the result is saved to disk.
The supervisor will collect your score for the overall report.
"""
