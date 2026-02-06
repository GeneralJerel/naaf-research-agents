"""You.com Search API integration.

This module provides web search capabilities using the You.com Search API,
which is a hackathon sponsor tool for the Continual Learning Hackathon.

Migrated from Strands to Google ADK - tool decorators removed.
"""

import os
import requests
from typing import List, Dict, Any, Optional
from datetime import datetime


def _try_youcom_search(
    query: str,
    num_results: int = 10,
    country: Optional[str] = None,
    site_filter: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    """
    Execute a search using the You.com Search API.

    Args:
        query: The search query string
        num_results: Number of results to return (max 10)
        country: Optional country code for localized results
        site_filter: Optional list of domains to restrict search to

    Returns:
        List of search result dictionaries with title, link, snippet, source
    """
    api_key = os.getenv("YOUCOM_API_KEY")

    if not api_key:
        raise Exception("You.com API key not configured. Set YOUCOM_API_KEY environment variable.")

    # Build the query with site filters if provided
    search_query = query
    if site_filter:
        site_queries = " OR ".join([f"site:{domain}" for domain in site_filter])
        search_query = f"{query} ({site_queries})"

    # You.com Search API endpoint
    url = "https://api.ydc-index.io/search"

    headers = {
        "X-API-Key": api_key,
        "Content-Type": "application/json"
    }

    params = {
        "query": search_query,
        "num_web_results": min(num_results, 10)
    }

    if country:
        params["country"] = country

    print(f"🔍 You.com searching: {search_query}")

    response = requests.get(url, headers=headers, params=params, timeout=15)
    response.raise_for_status()

    data = response.json()
    results = []

    # Process You.com search results
    hits = data.get("hits", [])
    for hit in hits[:num_results]:
        results.append({
            "title": hit.get("title", ""),
            "link": hit.get("url", ""),
            "snippet": hit.get("description", "") or hit.get("snippet", ""),
            "source": "You.com"
        })

    print(f"✅ You.com returned {len(results)} results")
    return results


def _format_youcom_results(results: List[Dict[str, Any]], query: str) -> str:
    """Format You.com search results for the agent."""
    if not results:
        return f"No search results found for query: {query}"

    formatted = f"""## You.com Search Results
**Query**: {query}
**Results Count**: {len(results)}
**Search Time**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Results

"""

    for i, result in enumerate(results, 1):
        title = result.get("title", "N/A")[:200]
        url = result.get("link", "N/A")
        snippet = result.get("snippet", "N/A")[:500]

        formatted += f"### {i}. {title}\n"
        formatted += f"**URL**: {url}\n"
        formatted += f"**Summary**: {snippet}\n\n"
        formatted += "---\n\n"

    return formatted


def youcom_search(
    query: str,
    num_results: int = 10,
    country: Optional[str] = None
) -> str:
    """
    Search the web using You.com Search API.

    You.com is a privacy-focused search engine that provides high-quality
    search results with AI-powered summarization capabilities.

    Args:
        query: The search query string
        num_results: Number of results to return (default: 10, max: 10)
        country: Optional country code for localized results (e.g., "US", "UK")

    Returns:
        Formatted search results with titles, URLs, and snippets
    """
    print(f"🔍 You.com searching for: {query}")

    try:
        results = _try_youcom_search(query, num_results, country)
        if results:
            return _format_youcom_results(results, query)
        else:
            return f"No results found for query: '{query}'"
    except Exception as e:
        return f"You.com search failed: {str(e)}\nPlease check YOUCOM_API_KEY environment variable."


def youcom_search_with_domains(
    query: str,
    domains: List[str],
    num_results: int = 10
) -> str:
    """
    Search the web using You.com API with domain filtering.

    This is useful for restricting searches to specific authoritative sources
    like government websites (gov.xx), international organizations (worldbank.org,
    iea.org, oecd.org), or academic sources.

    Args:
        query: The search query string
        domains: List of domains to restrict search to (e.g., ["iea.org", "worldbank.org"])
        num_results: Number of results to return (default: 10, max: 10)

    Returns:
        Formatted search results filtered to specified domains
    """
    print(f"🔍 You.com searching '{query}' on domains: {domains}")

    try:
        results = _try_youcom_search(query, num_results, site_filter=domains)
        if results:
            return _format_youcom_results(results, query)
        else:
            return f"No results found for query: '{query}' on domains: {domains}"
    except Exception as e:
        return f"You.com domain search failed: {str(e)}"


# NAAF-specific search functions for the 8-layer framework

# Layer-specific authoritative source domains
NAAF_SOURCE_REGISTRY = {
    1: {  # Power & Electricity
        "name": "Power & Electricity",
        "domains": [
            "iea.org",
            "worldbank.org",
            "globalpetrolprices.com",
            "oecd.org",
            "eia.gov",
            "irena.org"
        ]
    },
    2: {  # Chipset Manufacturers
        "name": "Chipset Manufacturers",
        "domains": [
            "semi.org",
            "chips.gov",
            "oecd.org",
            "asml.com",
            "tsmc.com",
            "intel.com"
        ]
    },
    3: {  # Cloud & Data Centers
        "name": "Cloud & Data Centers",
        "domains": [
            "datacentermap.com",
            "telegeography.com",
            "itu.int",
            "synergyrg.com",
            "cloudscene.com"
        ]
    },
    4: {  # Model Developers
        "name": "Model Developers",
        "domains": [
            "top500.org",
            "wipo.int",
            "aiindex.stanford.edu",
            "arxiv.org",
            "github.com"
        ]
    },
    5: {  # Platform & Data
        "name": "Platform & Data",
        "domains": [
            "oecd.org",
            "worldbank.org",
            "opendatawatch.com",
            "thegovlab.org"
        ]
    },
    6: {  # Applications & Startups
        "name": "Applications & Startups",
        "domains": [
            "dealroom.co",
            "crunchbase.com",
            "cbinsights.com",
            "pitchbook.com",
            "github.com"
        ]
    },
    7: {  # Education & Consulting
        "name": "Education & Consulting",
        "domains": [
            "unesco.org",
            "uis.unesco.org",
            "topuniversities.com",
            "timeshighereducation.com",
            "linkedin.com"
        ]
    },
    8: {  # Implementation
        "name": "Implementation",
        "domains": [
            "oxfordinsights.com",
            "eurostat.ec.europa.eu",
            "oecd.org",
            "worldbank.org"
        ]
    }
}


def naaf_layer_search(
    country: str,
    layer_number: int,
    metric_query: str,
    year: int = 2024
) -> str:
    """
    Search for NAAF layer-specific metrics using authoritative sources.

    This tool searches for country-specific AI readiness metrics using
    the You.com API with domain filtering to prioritize government and
    international organization sources.

    Args:
        country: The country to research (e.g., "Brazil", "United States")
        layer_number: NAAF layer number (1-8)
        metric_query: Specific metric to search for
        year: Target year for data (default: 2024)

    Returns:
        Formatted search results from authoritative sources
    """
    if layer_number < 1 or layer_number > 8:
        return f"Invalid layer number: {layer_number}. Must be between 1 and 8."

    layer_info = NAAF_SOURCE_REGISTRY[layer_number]
    layer_name = layer_info["name"]
    domains = layer_info["domains"]

    # Build the search query
    search_query = f"{country} {metric_query} {year}"

    print(f"🔍 NAAF Layer {layer_number} ({layer_name}) search for {country}: {metric_query}")

    try:
        results = _try_youcom_search(search_query, num_results=8, site_filter=domains)

        if results:
            formatted = f"""## NAAF Layer {layer_number}: {layer_name}
**Country**: {country}
**Metric**: {metric_query}
**Year**: {year}
**Authoritative Sources**: {', '.join(domains[:4])}...

{_format_youcom_results(results, search_query)}
"""
            return formatted
        else:
            # Fallback to general search without domain filter
            print(f"⚠️ No domain-filtered results, trying general search...")
            results = _try_youcom_search(search_query, num_results=8)
            if results:
                return _format_youcom_results(results, search_query)
            return f"No results found for {country} {layer_name} metrics."

    except Exception as e:
        return f"NAAF layer search failed: {str(e)}"
