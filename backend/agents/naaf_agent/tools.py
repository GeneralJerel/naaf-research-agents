"""ADK Tool wrappers for NAAF Research Agent.

These tools wrap the underlying search APIs (You.com, Exa) for use with
Google Agent Development Kit (ADK).
"""

from typing import Optional, List, Dict, Any
from google.adk import Tool

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
    monitor_rubric_sources,
    results_to_dict,
    ExaSearchResult,
)
from ...framework import (
    NAAF_LAYERS,
    calculate_layer_score,
    calculate_overall_score,
    get_tier,
)


def search_layer_info(
    country: str,
    layer_number: int,
    metric_query: str,
    year: int = 2024
) -> str:
    """
    Search for NAAF layer-specific metrics using authoritative sources.

    Uses You.com Search API with domain filtering to find country-specific
    AI readiness data from trusted sources.

    Args:
        country: The country to research (e.g., "Brazil", "United States")
        layer_number: NAAF layer number (1-8)
        metric_query: Specific metric to search for
        year: Target year for data (default: 2024)

    Returns:
        Formatted search results from authoritative sources
    """
    return naaf_layer_search_fn(country, layer_number, metric_query, year)


def get_live_news(
    country: str,
    topic: str = "artificial intelligence",
    count: int = 5
) -> str:
    """
    Get live news about AI developments for a country.

    Uses You.com Live News API to fetch recent news articles.

    Args:
        country: The country to get news for
        topic: Topic to search for (default: "artificial intelligence")
        count: Number of articles to fetch

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


def calculate_score(
    layer_number: int,
    metrics_found: Dict[str, float],
    confidence: float = 0.7
) -> Dict[str, Any]:
    """
    Calculate score for a NAAF layer based on found metrics.

    Args:
        layer_number: The layer number (1-8)
        metrics_found: Dictionary of metric names to values
        confidence: Overall confidence in the data (0-1)

    Returns:
        Dictionary with score, max_score, and breakdown
    """
    from ...framework import MetricResult

    if layer_number not in NAAF_LAYERS:
        return {"error": f"Invalid layer number: {layer_number}"}

    layer = NAAF_LAYERS[layer_number]

    # Create metric results from the found data
    metric_results = []
    for metric_name, value in metrics_found.items():
        metric_results.append(MetricResult(
            metric_name=metric_name,
            value=value,
            unit="",
            year=2024,
            source_url="",
            source_title="",
            confidence=confidence,
            raw_text=""
        ))

    score = calculate_layer_score(layer_number, metric_results)

    return {
        "layer_number": layer_number,
        "layer_name": layer.name,
        "score": round(score, 2),
        "max_score": layer.max_points,
        "weight": layer.weight,
        "metrics_evaluated": len(metrics_found),
        "confidence": confidence
    }


def search_with_exa(
    query: str,
    days_back: int = 30,
    num_results: int = 10,
    include_text: bool = False
) -> str:
    """
    Search using Exa AI with date filtering.

    Exa provides semantic search with date range filtering, useful for
    finding recent developments and historical data.

    Args:
        query: Search query
        days_back: Number of days to look back
        num_results: Maximum number of results
        include_text: Whether to include full text content

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
            if r.author:
                formatted += f"**Author**: {r.author}\n"
            formatted += f"**Relevance**: {r.score:.2f}\n"
            if r.text and include_text:
                formatted += f"**Text**: {r.text[:500]}...\n"
            formatted += "\n"

        return formatted
    except Exception as e:
        return f"Exa search failed: {str(e)}"


def check_rubric_updates(days_back: int = 7) -> str:
    """
    Monitor trusted sources for new AI assessment methodology publications.

    Checks sources like Stanford HAI, Oxford Insights, OECD for new research
    that might inform framework updates.

    Args:
        days_back: Number of days to look back

    Returns:
        Formatted list of recent publications from trusted sources
    """
    try:
        results = monitor_rubric_sources(days_back=days_back)

        if not results:
            return f"No new rubric-relevant publications found in the last {days_back} days."

        formatted = f"## Rubric Update Monitor\n**Checked**: Last {days_back} days\n**Sources**: Stanford HAI, Oxford Insights, OECD, Brookings, etc.\n\n"

        for i, r in enumerate(results, 1):
            formatted += f"### {i}. {r.title}\n"
            formatted += f"**URL**: {r.url}\n"
            if r.published_date:
                formatted += f"**Date**: {r.published_date}\n"
            formatted += "\n"

        return formatted
    except Exception as e:
        return f"Rubric monitoring failed: {str(e)}"


def get_layer_info(layer_number: int) -> Dict[str, Any]:
    """
    Get detailed information about a NAAF layer.

    Args:
        layer_number: Layer number (1-8)

    Returns:
        Dictionary with layer details including metrics and weights
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


def get_all_layers_summary() -> str:
    """
    Get a summary of all 8 NAAF layers.

    Returns:
        Formatted summary of all layers with weights
    """
    summary = "## NAAF 8-Layer Framework\n\n"

    for layer_num, layer in NAAF_LAYERS.items():
        summary += f"### Layer {layer_num}: {layer.name} ({layer.weight}%)\n"
        summary += f"{layer.description}\n"
        summary += f"**Metrics**: {', '.join(m.name for m in layer.metrics)}\n\n"

    return summary


# Export ADK-compatible tool functions
__all__ = [
    "search_layer_info",
    "get_live_news",
    "calculate_score",
    "search_with_exa",
    "check_rubric_updates",
    "get_layer_info",
    "get_all_layers_summary",
]
