"""NAAF (National AI Assessment Framework) - 8-Layer Country Research System.

This module implements the 8-layer framework for assessing country AI readiness,
designed for the Continual Learning Hackathon.

The 8 Layers (from physical constraints to economic impact):
1. Power & Electricity - The physical constraint
2. Chipset Manufacturers - The hardware supply chain
3. Cloud & Data Centers - The compute infrastructure
4. Model Developers - The sovereign brain
5. Platform & Data - The raw material
6. Applications & Startups - The innovation engine
7. Education & Consulting - The talent pipeline
8. Implementation - The economic multiplier
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from datetime import datetime


@dataclass
class LayerMetric:
    """A single metric within a layer."""
    name: str
    description: str
    unit: str
    weight: float  # Points allocated to this metric
    formula: str
    sources: List[str]
    search_queries: List[str]  # Query templates with {country} placeholder


@dataclass
class Layer:
    """An assessment layer in the NAAF framework."""
    number: int
    name: str
    short_name: str
    description: str
    weight: float  # Percentage weight (0-100)
    max_points: float
    metrics: List[LayerMetric]


@dataclass
class MetricResult:
    """Result of researching a single metric."""
    metric_name: str
    value: Optional[float]
    unit: str
    year: int
    source_url: str
    source_title: str
    confidence: float  # 0-1 confidence score
    raw_text: str  # Extracted text evidence


@dataclass
class LayerResult:
    """Result of researching a single layer."""
    layer_number: int
    layer_name: str
    score: float
    max_score: float
    metrics: List[MetricResult]
    status: str  # "complete", "partial", "failed"
    research_summary: str


@dataclass
class CountryReport:
    """Complete NAAF assessment report for a country."""
    country: str
    country_code: str
    years: List[int]
    overall_score: float
    tier: str
    layers: Dict[int, LayerResult]
    sources: List[str]
    generated_at: str
    research_loops: int


# Define the 8-layer framework
NAAF_LAYERS: Dict[int, Layer] = {
    1: Layer(
        number=1,
        name="Power & Electricity",
        short_name="Power",
        description="The nation's ability to supply cheap, stable, and sustainable electricity to industrial consumers (specifically data centers).",
        weight=20.0,
        max_points=20.0,
        metrics=[
            LayerMetric(
                name="Industrial Capacity",
                description="Total electricity generation capacity",
                unit="TWh",
                weight=8.0,
                formula="(Country Generation TWh / Global Max TWh) × 8",
                sources=["iea.org", "worldbank.org", "eia.gov"],
                search_queries=[
                    "{country} electricity generation TWh {year}",
                    "{country} total power output capacity {year} site:iea.org",
                    "{country} electricity statistics {year} site:worldbank.org"
                ]
            ),
            LayerMetric(
                name="Cost Efficiency",
                description="Industrial electricity price",
                unit="USD/kWh",
                weight=4.0,
                formula="(Global Min Price / Country Industrial Price) × 4",
                sources=["globalpetrolprices.com", "iea.org"],
                search_queries=[
                    "{country} industrial electricity price kWh {year}",
                    "{country} electricity tariff industrial {year} site:globalpetrolprices.com"
                ]
            ),
            LayerMetric(
                name="Grid Reliability & Clean Mix",
                description="Grid stability and renewable energy percentage",
                unit="%",
                weight=4.0,
                formula="Qualitative scoring based on clean mix % and outage hours",
                sources=["irena.org", "iea.org"],
                search_queries=[
                    "{country} renewable energy mix percentage {year}",
                    "{country} clean energy solar wind nuclear hydro {year}"
                ]
            ),
            LayerMetric(
                name="National Output Percentile",
                description="Percentile rank of total electricity generation",
                unit="percentile",
                weight=4.0,
                formula="(Percentile Rank / 100) × 4",
                sources=["iea.org", "worldbank.org"],
                search_queries=[
                    "{country} electricity generation ranking world {year}",
                    "global electricity production by country {year}"
                ]
            )
        ]
    ),
    2: Layer(
        number=2,
        name="Chipset Manufacturers",
        short_name="Chips",
        description="The nation's control over the semiconductor supply chain, distinguishing between design (IP) and fabrication (manufacturing).",
        weight=15.0,
        max_points=15.0,
        metrics=[
            LayerMetric(
                name="Fabrication Capacity",
                description="Domestic semiconductor fabrication capability",
                unit="node_nm",
                weight=10.0,
                formula="10 pts (<5nm), 7 pts (<14nm), 3 pts (>28nm), 0 pts (none)",
                sources=["semi.org", "chips.gov"],
                search_queries=[
                    "{country} semiconductor fab capacity {year}",
                    "{country} chip manufacturing plants nanometer {year}",
                    "{country} TSMC Intel Samsung fab {year}"
                ]
            ),
            LayerMetric(
                name="Equipment & Supply Chain Control",
                description="Control of critical chipmaking equipment and materials",
                unit="categorical",
                weight=5.0,
                formula="5 pts (monopoly), 3 pts (major supplier), 1 pt (minor)",
                sources=["semi.org", "asml.com"],
                search_queries=[
                    "{country} semiconductor equipment manufacturers {year}",
                    "{country} lithography etching chip equipment {year}",
                    "{country} critical minerals gallium germanium silicon {year}"
                ]
            )
        ]
    ),
    3: Layer(
        number=3,
        name="Cloud & Data Centers",
        short_name="Cloud",
        description="The physical housing and networking for AI workloads and whether compute is sovereign.",
        weight=15.0,
        max_points=15.0,
        metrics=[
            LayerMetric(
                name="Compute Density",
                description="Hyperscale data center count",
                unit="count",
                weight=10.0,
                formula="(Country Hyperscale DC Count / Global Max Count) × 10",
                sources=["datacentermap.com", "synergyrg.com"],
                search_queries=[
                    "{country} hyperscale data centers count {year}",
                    "{country} data center capacity MW {year}",
                    "{country} cloud infrastructure AWS Azure Google {year}"
                ]
            ),
            LayerMetric(
                name="Sovereign Cloud",
                description="Domestic vs foreign cloud provider share",
                unit="%",
                weight=5.0,
                formula="5 pts (>50% domestic), 0 pts (foreign dominated)",
                sources=["synergyrg.com", "cloudscene.com"],
                search_queries=[
                    "{country} sovereign cloud providers market share {year}",
                    "{country} domestic cloud vs AWS Azure {year}"
                ]
            )
        ]
    ),
    4: Layer(
        number=4,
        name="Model Developers",
        short_name="Models",
        description="The ability to train foundation models domestically rather than only using foreign APIs.",
        weight=10.0,
        max_points=10.0,
        metrics=[
            LayerMetric(
                name="Frontier Model Capacity",
                description="Domestic foundation models and supercomputing power",
                unit="count",
                weight=10.0,
                formula="(Domestic LLMs on LMSYS Leaderboard / Global Max) × 10",
                sources=["top500.org", "aiindex.stanford.edu", "arxiv.org"],
                search_queries=[
                    "{country} large language models LLM {year}",
                    "{country} foundation models AI {year}",
                    "{country} TOP500 supercomputer {year}",
                    "{country} AI patents filed {year} site:wipo.int"
                ]
            )
        ]
    ),
    5: Layer(
        number=5,
        name="Platform & Data",
        short_name="Data",
        description="The quality, accessibility, and governance of data needed to feed AI models.",
        weight=10.0,
        max_points=10.0,
        metrics=[
            LayerMetric(
                name="Data Openness",
                description="Open government data accessibility",
                unit="index",
                weight=5.0,
                formula="OECD OURdata Index normalized to 5 points",
                sources=["oecd.org", "opendatawatch.com"],
                search_queries=[
                    "{country} open data index score {year}",
                    "{country} government data portal {year} site:oecd.org"
                ]
            ),
            LayerMetric(
                name="Data Volume Potential",
                description="Internet population as proxy for data generation",
                unit="millions",
                weight=5.0,
                formula="(Internet Population / Global Max) × 5",
                sources=["worldbank.org", "itu.int"],
                search_queries=[
                    "{country} internet users millions {year}",
                    "{country} internet penetration rate {year}"
                ]
            )
        ]
    ),
    6: Layer(
        number=6,
        name="Applications & Startups",
        short_name="Apps",
        description="The commercial ecosystem that turns infrastructure into economic value.",
        weight=10.0,
        max_points=10.0,
        metrics=[
            LayerMetric(
                name="Capital Depth",
                description="AI venture capital investment",
                unit="USD billions",
                weight=10.0,
                formula="(Annual AI VC Investment / Global Max) × 10",
                sources=["dealroom.co", "crunchbase.com", "cbinsights.com"],
                search_queries=[
                    "{country} AI startup funding venture capital {year}",
                    "{country} AI investment billions {year}",
                    "{country} AI unicorn companies {year}"
                ]
            )
        ]
    ),
    7: Layer(
        number=7,
        name="Education & Consulting",
        short_name="Talent",
        description="The human capital required to build and maintain AI systems.",
        weight=10.0,
        max_points=10.0,
        metrics=[
            LayerMetric(
                name="Talent Pool",
                description="Annual CS/AI graduates",
                unit="thousands",
                weight=5.0,
                formula="(Annual CS/AI Graduates / Global Max) × 5",
                sources=["unesco.org", "uis.unesco.org"],
                search_queries=[
                    "{country} computer science graduates {year}",
                    "{country} AI machine learning PhD graduates {year}",
                    "{country} STEM graduates statistics {year}"
                ]
            ),
            LayerMetric(
                name="Research Impact",
                description="University research quality",
                unit="h-index",
                weight=5.0,
                formula="(H-Index of Top University / Global Max H-Index) × 5",
                sources=["topuniversities.com", "timeshighereducation.com"],
                search_queries=[
                    "{country} top university computer science ranking {year}",
                    "{country} AI research publications citations {year}"
                ]
            )
        ]
    ),
    8: Layer(
        number=8,
        name="Implementation",
        short_name="Adoption",
        description="How widely AI is used by government and traditional industries.",
        weight=10.0,
        max_points=10.0,
        metrics=[
            LayerMetric(
                name="Government Readiness",
                description="Government AI readiness index",
                unit="index",
                weight=10.0,
                formula="Oxford Insights Government AI Readiness Index normalized to 10 points",
                sources=["oxfordinsights.com", "oecd.org"],
                search_queries=[
                    "{country} government AI readiness index {year}",
                    "{country} Oxford Insights AI ranking {year}",
                    "{country} national AI strategy {year}",
                    "{country} AI adoption rate businesses {year}"
                ]
            )
        ]
    )
}


# Power tier definitions
POWER_TIERS = {
    "Tier 1: Hegemon": (80, 100, "Full-stack sovereignty. Controls atoms (chips/power) and bits (models/data). Can sanction others effectively."),
    "Tier 2: Strategic Specialist": (50, 79, "World-class in specific layers but dependent on Hegemons for others."),
    "Tier 3: Adopter": (30, 49, "Good infrastructure and talent, but largely consumes foreign AI technology."),
    "Tier 4: Consumer": (0, 29, "Reliant entirely on imported hardware, software, and energy models. High risk of digital dependency.")
}


def get_tier(score: float) -> str:
    """Determine the power tier based on overall score."""
    for tier_name, (min_score, max_score, _) in POWER_TIERS.items():
        if min_score <= score <= max_score:
            return tier_name
    return "Tier 4: Consumer"


def get_tier_description(tier: str) -> str:
    """Get the description for a power tier."""
    for tier_name, (_, _, description) in POWER_TIERS.items():
        if tier_name == tier:
            return description
    return ""


def generate_layer_queries(country: str, layer_number: int, year: int = 2024) -> List[Dict[str, str]]:
    """
    Generate search queries for a specific layer and country.

    Args:
        country: Country name
        layer_number: Layer number (1-8)
        year: Target year for data

    Returns:
        List of query dictionaries with metric info
    """
    if layer_number not in NAAF_LAYERS:
        raise ValueError(f"Invalid layer number: {layer_number}")

    layer = NAAF_LAYERS[layer_number]
    queries = []

    for metric in layer.metrics:
        for query_template in metric.search_queries:
            query = query_template.format(country=country, year=year)
            queries.append({
                "query": query,
                "metric_name": metric.name,
                "layer_number": layer_number,
                "layer_name": layer.name,
                "sources": metric.sources
            })

    return queries


def get_all_layer_queries(country: str, year: int = 2024) -> Dict[int, List[Dict[str, str]]]:
    """
    Generate all queries for all 8 layers for a country.

    Args:
        country: Country name
        year: Target year for data

    Returns:
        Dictionary mapping layer number to list of queries
    """
    all_queries = {}
    for layer_number in range(1, 9):
        all_queries[layer_number] = generate_layer_queries(country, layer_number, year)
    return all_queries


def calculate_layer_score(layer_number: int, metric_results: List[MetricResult]) -> float:
    """
    Calculate the score for a layer based on metric results.

    This is a simplified scoring implementation. In production, this would
    use the actual formulas and global benchmarks.

    Args:
        layer_number: Layer number (1-8)
        metric_results: List of metric results

    Returns:
        Layer score (0 to max_points)
    """
    if layer_number not in NAAF_LAYERS:
        return 0.0

    layer = NAAF_LAYERS[layer_number]

    # Calculate weighted average based on confidence
    total_weight = 0.0
    weighted_score = 0.0

    for result in metric_results:
        # Find the metric definition
        metric_def = next(
            (m for m in layer.metrics if m.name == result.metric_name),
            None
        )
        if metric_def and result.confidence > 0:
            # Simplified scoring: use confidence as a proxy for data quality
            # In production, this would apply the actual formula
            metric_score = result.confidence * metric_def.weight
            weighted_score += metric_score
            total_weight += metric_def.weight

    if total_weight > 0:
        # Normalize to layer's max points
        return (weighted_score / total_weight) * layer.max_points
    return 0.0


def calculate_overall_score(layer_scores: Dict[int, float]) -> float:
    """
    Calculate the overall AI Power Score from layer scores.

    Args:
        layer_scores: Dictionary mapping layer number to layer score

    Returns:
        Overall score (0-100)
    """
    total_score = 0.0
    for layer_number, score in layer_scores.items():
        if layer_number in NAAF_LAYERS:
            total_score += score
    return min(total_score, 100.0)


def create_empty_report(country: str, country_code: str = "") -> CountryReport:
    """Create an empty report structure for a country."""
    return CountryReport(
        country=country,
        country_code=country_code,
        years=[2024],
        overall_score=0.0,
        tier="Tier 4: Consumer",
        layers={},
        sources=[],
        generated_at=datetime.now().isoformat(),
        research_loops=0
    )
