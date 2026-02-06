"""Search and data tools for NAAF Research Agents."""

from .youcom_search import (
    youcom_search,
    youcom_search_with_domains,
    naaf_layer_search,
    NAAF_SOURCE_REGISTRY,
)
from .youcom_news import (
    fetch_live_news,
    fetch_multi_query_news,
    articles_to_dict,
    NewsArticle,
    NEWS_QUERY_TEMPLATES,
)
from .exa_search import (
    exa_search,
    search_date_range,
    search_naaf_layer,
    monitor_rubric_sources,
    backfill_country_news,
    results_to_dict,
    ExaSearchResult,
    TRUSTED_RUBRIC_SOURCES,
)

__all__ = [
    # You.com Search
    "youcom_search",
    "youcom_search_with_domains",
    "naaf_layer_search",
    "NAAF_SOURCE_REGISTRY",
    # You.com News
    "fetch_live_news",
    "fetch_multi_query_news",
    "articles_to_dict",
    "NewsArticle",
    "NEWS_QUERY_TEMPLATES",
    # Exa Search
    "exa_search",
    "search_date_range",
    "search_naaf_layer",
    "monitor_rubric_sources",
    "backfill_country_news",
    "results_to_dict",
    "ExaSearchResult",
    "TRUSTED_RUBRIC_SOURCES",
]
