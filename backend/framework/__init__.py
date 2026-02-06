"""NAAF Framework - Layer definitions, scoring, and persistence."""

from .naaf_framework import (
    NAAF_LAYERS,
    POWER_TIERS,
    Layer,
    LayerMetric,
    MetricResult,
    LayerResult,
    CountryReport,
    calculate_layer_score,
    calculate_overall_score,
    get_tier,
    get_tier_description,
    generate_layer_queries,
    get_all_layer_queries,
    create_empty_report,
)
from .research_store import ResearchStore, StoredResearch, get_store

__all__ = [
    "NAAF_LAYERS",
    "POWER_TIERS",
    "Layer",
    "LayerMetric",
    "MetricResult",
    "LayerResult",
    "CountryReport",
    "calculate_layer_score",
    "calculate_overall_score",
    "get_tier",
    "get_tier_description",
    "generate_layer_queries",
    "get_all_layer_queries",
    "create_empty_report",
    "ResearchStore",
    "StoredResearch",
    "get_store",
]
