"""ADK Tools for NAAF Multi-Agent System.

These tools are decorated with @tool for use with Google ADK agents.
"""

import os
from typing import Optional, Dict, Any, List

# Try to import ADK - gracefully handle if not installed
try:
    from google.adk import tool
    HAS_ADK = True
except ImportError:
    # Fallback decorator if ADK not installed
    def tool(fn):
        return fn
    HAS_ADK = False

# Import underlying search functions
try:
    from ...tools import (
        youcom_search as youcom_search_fn,
        youcom_search_with_domains,
        naaf_layer_search as naaf_layer_search_fn,
        NAAF_SOURCE_REGISTRY,
        fetch_live_news,
        NewsArticle,
        exa_search,
        search_date_range,
        search_naaf_layer,
    )
    from ...framework import NAAF_LAYERS, get_tier, get_tier_description
except ImportError:
    from tools import (
        youcom_search as youcom_search_fn,
        youcom_search_with_domains,
        naaf_layer_search as naaf_layer_search_fn,
        NAAF_SOURCE_REGISTRY,
        fetch_live_news,
        NewsArticle,
        exa_search,
        search_date_range,
        search_naaf_layer,
    )
    from framework import NAAF_LAYERS, get_tier, get_tier_description


@tool
def search_layer_info(
    country: str,
    layer_number: int,
    metric_query: str,
    year: int = 2024
) -> str:
    """Search for NAAF layer-specific metrics using authoritative sources like IEA, World Bank, OECD.

    Args:
        country: Country to research (e.g., "Brazil", "Singapore")
        layer_number: NAAF layer number (1-8)
        metric_query: Specific metric to search for
        year: Target year for data (default: 2024)

    Returns:
        Formatted search results from authoritative sources
    """
    return naaf_layer_search_fn(country, layer_number, metric_query, year)


@tool
def get_live_news(
    country: str,
    topic: str = "artificial intelligence",
    count: int = 5
) -> str:
    """Get live news about AI developments for a country using You.com Live News API.

    Args:
        country: Country to get news for
        topic: Topic to search (default: "artificial intelligence")
        count: Number of articles (default: 5)

    Returns:
        Formatted news articles with titles, summaries, and URLs
    """
    query = f"{country} {topic}"
    try:
        articles = fetch_live_news(query, count=count)
        if not articles:
            return f"No recent news found for {country} {topic}"

        formatted = f"## Live News: {country} AI\n\n"
        for i, article in enumerate(articles, 1):
            formatted += f"### {i}. {article.title}\n"
            formatted += f"**Source**: {article.source}\n"
            formatted += f"**Date**: {article.published_at}\n"
            formatted += f"**URL**: {article.url}\n"
            formatted += f"**Summary**: {article.snippet}\n\n"

        return formatted
    except Exception as e:
        return f"Failed to fetch news: {str(e)}"


@tool
def search_with_exa(
    query: str,
    days_back: int = 30,
    num_results: int = 10
) -> str:
    """Search using Exa AI with date filtering for recent developments.

    Args:
        query: Search query
        days_back: Days to look back (default: 30)
        num_results: Max results (default: 10)

    Returns:
        Formatted search results with titles, URLs, and dates
    """
    try:
        results = search_date_range(
            query=query,
            days_back=days_back,
            num_results=num_results,
        )

        if not results:
            return f"No results found for query: {query}"

        formatted = f"## Exa Search Results\n**Query**: {query}\n**Time Range**: Last {days_back} days\n\n"

        for i, r in enumerate(results, 1):
            formatted += f"### {i}. {r.title}\n"
            formatted += f"**URL**: {r.url}\n"
            if r.published_date:
                formatted += f"**Date**: {r.published_date}\n"
            formatted += f"**Relevance**: {r.score:.2f}\n\n"

        return formatted
    except Exception as e:
        return f"Exa search failed: {str(e)}"


@tool
def get_layer_info(layer_number: int) -> Dict[str, Any]:
    """Get detailed information about a NAAF layer including metrics and weights.

    Args:
        layer_number: Layer number (1-8)

    Returns:
        Dictionary with layer details
    """
    if layer_number not in NAAF_LAYERS:
        return {"error": f"Invalid layer number: {layer_number}"}

    layer = NAAF_LAYERS[layer_number]

    return {
        "number": layer.number,
        "name": layer.name,
        "short_name": layer.short_name,
        "description": layer.description,
        "weight": layer.weight,
        "max_points": layer.max_points,
        "metrics": [
            {
                "name": m.name,
                "description": m.description,
                "unit": m.unit,
                "weight": m.weight,
                "sources": m.sources
            }
            for m in layer.metrics
        ]
    }


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
) -> Dict[str, Any]:
    """Calculate the overall NAAF score and determine power tier.

    Args:
        layer_1_score: Power & Electricity score (max 20)
        layer_2_score: Chipset Manufacturers score (max 15)
        layer_3_score: Cloud & Data Centers score (max 15)
        layer_4_score: Model Developers score (max 10)
        layer_5_score: Platform & Data score (max 10)
        layer_6_score: Applications & Startups score (max 10)
        layer_7_score: Education & Consulting score (max 10)
        layer_8_score: Implementation score (max 10)

    Returns:
        Dictionary with overall score, tier, and breakdown
    """
    total = sum([
        layer_1_score,
        layer_2_score,
        layer_3_score,
        layer_4_score,
        layer_5_score,
        layer_6_score,
        layer_7_score,
        layer_8_score,
    ])

    tier = get_tier(total)
    tier_description = get_tier_description(tier)

    return {
        "overall_score": round(total, 2),
        "tier": tier,
        "tier_description": tier_description,
        "layer_scores": {
            "1_power": layer_1_score,
            "2_chips": layer_2_score,
            "3_cloud": layer_3_score,
            "4_models": layer_4_score,
            "5_data": layer_5_score,
            "6_apps": layer_6_score,
            "7_talent": layer_7_score,
            "8_adoption": layer_8_score,
        },
        "max_possible": 100,
    }


# Export all tools
__all__ = [
    "search_layer_info",
    "get_live_news",
    "search_with_exa",
    "get_layer_info",
    "calculate_overall",
    "HAS_ADK",
]
