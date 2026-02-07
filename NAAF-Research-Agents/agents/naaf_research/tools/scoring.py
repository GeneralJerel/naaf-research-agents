"""Scoring engine tools for the NAAF framework.

Implements the Relative Power Index (RPI) formula from assessment-framework.md.
Layer weights: Power 20%, Chips 15%, Cloud 15%, Models 10%, Data 10%,
               Apps 10%, Talent 10%, Adoption 10%.

When a ToolContext is available (ADK runtime), score_layer also:
- Persists each layer result as JSON to reports/{country}_{ts}/layers/
- Stores layer data in session state for the final report assembler
"""

import json
from pathlib import Path
from typing import Optional

from google.adk.tools import ToolContext

# Layer weights (percentage of 100)
LAYER_WEIGHTS = {
    1: 20.0,  # Power & Electricity
    2: 15.0,  # Chipset Manufacturers
    3: 15.0,  # Cloud & Data Centers
    4: 10.0,  # Model Developers
    5: 10.0,  # Platform & Data
    6: 10.0,  # Applications & Startups
    7: 10.0,  # Education & Consulting
    8: 10.0,  # Implementation
}

LAYER_NAMES = {
    1: "Power & Electricity",
    2: "Chipset Manufacturers",
    3: "Cloud & Data Centers",
    4: "Model Developers",
    5: "Platform & Data",
    6: "Applications & Startups",
    7: "Education & Consulting",
    8: "Implementation",
}

LAYER_SHORT_NAMES = {
    1: "power",
    2: "chips",
    3: "cloud",
    4: "models",
    5: "data",
    6: "apps",
    7: "talent",
    8: "adoption",
}


def score_layer(
    layer_number: int,
    score_0_to_100: float,
    justification: str,
    country: str = "",
    tool_context: Optional[ToolContext] = None,
) -> str:
    """Record a scored assessment for a single NAAF layer.

    After researching a layer's metrics using web search, call this tool
    to register the layer's score. The score should be 0-100 based on
    how the country compares to the global leader for that layer.

    Args:
        layer_number: The NAAF layer number (1-8).
        score_0_to_100: The layer score from 0 to 100.
            0 = no capability, 100 = global leader.
        justification: Brief explanation of the score with key data points
            and source URLs that support it.
        country: The country being assessed (e.g. 'China'). Used to name
            the report output folder.
        tool_context: Injected by ADK — used to persist results to disk
            and session state.

    Returns:
        Confirmation of the scored layer with its weighted contribution.
    """
    if layer_number < 1 or layer_number > 8:
        return f"ERROR: layer_number must be 1-8, got {layer_number}"

    if score_0_to_100 < 0 or score_0_to_100 > 100:
        return f"ERROR: score must be 0-100, got {score_0_to_100}"

    weight = LAYER_WEIGHTS[layer_number]
    weighted_contribution = (score_0_to_100 / 100.0) * weight
    name = LAYER_NAMES[layer_number]
    short = LAYER_SHORT_NAMES[layer_number]

    # ------------------------------------------------------------------
    # Persist to session state and disk when running inside ADK
    # ------------------------------------------------------------------
    if tool_context is not None:
        # Store country name in state (first layer to run sets it)
        if country:
            tool_context.state["country"] = country

        # Build the structured layer result dict
        layer_result = {
            "layer_number": layer_number,
            "layer_name": name,
            "short_name": short,
            "score": round(score_0_to_100, 1),
            "max_score": 100.0,
            "weight_pct": weight,
            "weighted_contribution": round(weighted_contribution, 2),
            "justification": justification,
            "status": "complete",
        }

        # Store in session state for save_final_report to pick up
        tool_context.state[f"layer_{layer_number}_json"] = layer_result

        # Write layer JSON to disk
        _write_layer_json(layer_number, short, layer_result, country, tool_context)

    return (
        f"## Layer {layer_number}: {name}\n"
        f"**Raw Score**: {score_0_to_100:.1f} / 100\n"
        f"**Weight**: {weight}%\n"
        f"**Weighted Contribution**: {weighted_contribution:.2f} points\n"
        f"**Justification**: {justification}\n"
    )


def _write_layer_json(
    layer_number: int,
    short_name: str,
    layer_result: dict,
    country: str,
    tool_context: ToolContext,
) -> None:
    """Write an individual layer result JSON file to the report directory."""
    from .persistence import _get_or_create_report_dir

    resolved_country = country or tool_context.state.get("country", "unknown")
    report_dir = _get_or_create_report_dir(resolved_country, tool_context)
    layer_file = report_dir / "layers" / f"layer_{layer_number}_{short_name}.json"
    layer_file.write_text(json.dumps(layer_result, indent=2, ensure_ascii=False))


def calculate_overall_score(
    layer_1_score: float = 0,
    layer_2_score: float = 0,
    layer_3_score: float = 0,
    layer_4_score: float = 0,
    layer_5_score: float = 0,
    layer_6_score: float = 0,
    layer_7_score: float = 0,
    layer_8_score: float = 0,
) -> str:
    """Calculate the overall AI Power Score from all 8 layer scores.

    Call this after scoring all 8 layers to compute the final weighted
    overall score and assign a Power Tier.

    Args:
        layer_1_score: Power & Electricity score (0-100).
        layer_2_score: Chipset Manufacturers score (0-100).
        layer_3_score: Cloud & Data Centers score (0-100).
        layer_4_score: Model Developers score (0-100).
        layer_5_score: Platform & Data score (0-100).
        layer_6_score: Applications & Startups score (0-100).
        layer_7_score: Education & Consulting score (0-100).
        layer_8_score: Implementation score (0-100).

    Returns:
        Formatted overall score with tier classification and breakdown.
    """
    scores = {
        1: layer_1_score,
        2: layer_2_score,
        3: layer_3_score,
        4: layer_4_score,
        5: layer_5_score,
        6: layer_6_score,
        7: layer_7_score,
        8: layer_8_score,
    }

    overall = 0.0
    breakdown_lines = []
    for num in range(1, 9):
        raw = max(0.0, min(100.0, scores[num]))
        weight = LAYER_WEIGHTS[num]
        contribution = (raw / 100.0) * weight
        overall += contribution
        breakdown_lines.append(
            f"  Layer {num} ({LAYER_NAMES[num]}): "
            f"{raw:.1f}/100 x {weight}% = {contribution:.2f} pts"
        )

    overall = min(overall, 100.0)

    # Determine tier
    if overall >= 80:
        tier = "Tier 1: Hegemon"
        tier_desc = "Full-stack sovereignty. Controls atoms and bits."
    elif overall >= 50:
        tier = "Tier 2: Strategic Specialist"
        tier_desc = "World-class in specific layers but dependent on Hegemons for others."
    elif overall >= 30:
        tier = "Tier 3: Adopter"
        tier_desc = "Good infrastructure and talent, but largely consumes foreign AI technology."
    else:
        tier = "Tier 4: Consumer"
        tier_desc = "Reliant on imported hardware, software, and energy models."

    breakdown = "\n".join(breakdown_lines)
    return (
        f"# Overall AI Power Score\n\n"
        f"**Score**: {overall:.2f} / 100\n"
        f"**Tier**: {tier}\n"
        f"**Description**: {tier_desc}\n\n"
        f"## Layer Breakdown\n{breakdown}\n"
    )
