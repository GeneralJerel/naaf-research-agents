"""Pydantic output schemas for NAAF country assessment reports.

These define the structured JSON contract that the agent pipeline produces.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class MetricResult(BaseModel):
    """A single metric finding with evidence."""

    name: str = Field(description="Metric name (e.g. 'Industrial Capacity')")
    value: Optional[float] = Field(default=None, description="Extracted numeric value")
    unit: str = Field(default="", description="Unit of measurement")
    year: int = Field(default=2024, description="Year the data refers to")
    source_url: str = Field(default="", description="URL of the source")
    source_title: str = Field(default="", description="Title of the source")
    confidence: float = Field(
        default=0.5,
        ge=0.0,
        le=1.0,
        description="Confidence score 0-1 based on source quality",
    )
    raw_text: str = Field(default="", description="Extracted text evidence")


class LayerResult(BaseModel):
    """Assessment result for a single NAAF layer."""

    layer_number: int = Field(ge=1, le=8)
    layer_name: str
    score: float = Field(ge=0.0, le=100.0, description="Layer score (0 to max_points)")
    max_score: float = Field(description="Maximum possible score for this layer")
    metrics: List[MetricResult] = Field(default_factory=list)
    status: str = Field(
        default="pending",
        description="One of: complete, partial, failed, pending",
    )
    research_summary: str = Field(default="", description="Brief summary of findings")


class CountryReport(BaseModel):
    """Complete NAAF assessment report for a country."""

    country: str
    years: List[int] = Field(default_factory=lambda: [2023, 2024, 2025])
    overall_score: float = Field(default=0.0, ge=0.0, le=100.0)
    tier: str = Field(
        default="Tier 4: Consumer",
        description="Power tier: Hegemon, Strategic Specialist, Adopter, or Consumer",
    )
    layers: Dict[str, LayerResult] = Field(
        default_factory=dict,
        description="Layer results keyed by layer short name (e.g. 'power', 'chips')",
    )
    sources: List[str] = Field(
        default_factory=list,
        description="All source URLs collected during research",
    )


# Power tier classification
POWER_TIERS = {
    "Tier 1: Hegemon": {
        "min": 80,
        "max": 100,
        "description": (
            "Full-stack sovereignty. Controls atoms (chips/power) and bits "
            "(models/data). Can sanction others effectively."
        ),
    },
    "Tier 2: Strategic Specialist": {
        "min": 50,
        "max": 79,
        "description": (
            "World-class in specific layers but dependent on Hegemons for others."
        ),
    },
    "Tier 3: Adopter": {
        "min": 30,
        "max": 49,
        "description": (
            "Good infrastructure and talent, but largely consumes foreign AI technology."
        ),
    },
    "Tier 4: Consumer": {
        "min": 0,
        "max": 29,
        "description": (
            "Reliant entirely on imported hardware, software, and energy models. "
            "High risk of digital dependency."
        ),
    },
}


def get_tier(score: float) -> str:
    """Determine the power tier based on overall score."""
    for tier_name, bounds in POWER_TIERS.items():
        if bounds["min"] <= score <= bounds["max"]:
            return tier_name
    return "Tier 4: Consumer"
