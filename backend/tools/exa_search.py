"""Exa AI Search API integration.

Provides semantic search with date range filtering for:
1. Historical backfill - Get news from specific time periods
2. Layer-specific research - Category and domain filtering
3. Rubric evolution monitoring - Track trusted source publications

Exa advantages over You.com:
- Date range filtering (startPublishedDate, endPublishedDate)
- Semantic/neural search
- Category filtering (news, research paper, company, etc.)
- Domain filtering
"""

import os
import requests
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta

EXA_API_URL = "https://api.exa.ai/search"
EXA_CONTENTS_URL = "https://api.exa.ai/contents"

# Trusted sources for rubric evolution monitoring
TRUSTED_RUBRIC_SOURCES = [
    "aiindex.stanford.edu",          # Stanford HAI AI Index
    "oxfordinsights.com",            # Oxford Insights AI Readiness
    "oecd.ai",                       # OECD AI Policy Observatory
    "weforum.org",                   # World Economic Forum
    "brookings.edu",                 # Brookings Institution
    "nature.com",                    # Nature (AI research)
    "arxiv.org",                     # ArXiv preprints
    "nist.gov",                      # NIST AI standards
]

# NAAF layer-specific domains for targeted research
NAAF_LAYER_DOMAINS = {
    1: ["iea.org", "eia.gov", "irena.org", "ember-climate.org"],  # Power & Electricity
    2: ["semiconductors.org", "asml.com", "tsmc.com"],  # Chipset
    3: ["top500.org", "cloudflare.com", "datacentermap.com"],  # Cloud & Data Centers
    4: ["openai.com", "anthropic.com", "deepmind.com", "huggingface.co"],  # Model Developers
    5: ["kaggle.com", "datahub.io"],  # Platform & Data
    6: ["crunchbase.com", "techcrunch.com", "pitchbook.com"],  # Startups
    7: ["csrankings.org", "timeshighereducation.com"],  # Education
    8: ["oecd.ai", "digital.gov"],  # Implementation
}


@dataclass
class ExaSearchResult:
    """A search result from Exa API."""
    title: str
    url: str
    published_date: Optional[str]
    author: Optional[str]
    score: float
    text: Optional[str] = None
    highlights: Optional[List[str]] = None


def exa_search(
    query: str,
    num_results: int = 10,
    start_published_date: Optional[str] = None,
    end_published_date: Optional[str] = None,
    include_domains: Optional[List[str]] = None,
    exclude_domains: Optional[List[str]] = None,
    category: Optional[str] = None,
    use_autoprompt: bool = True,
    include_text: bool = False,
) -> List[ExaSearchResult]:
    """
    Search using Exa AI with optional date filtering.

    Args:
        query: Search query
        num_results: Max results to return
        start_published_date: ISO date string for start of date range
        end_published_date: ISO date string for end of date range
        include_domains: Only include results from these domains
        exclude_domains: Exclude results from these domains
        category: Filter by category (news, research paper, company, etc.)
        use_autoprompt: Let Exa optimize the query
        include_text: Include full text content in results

    Returns:
        List of ExaSearchResult objects
    """
    api_key = os.getenv("EXA_API_KEY")
    if not api_key:
        raise Exception("EXA_API_KEY not configured")

    payload = {
        "query": query,
        "numResults": num_results,
        "useAutoprompt": use_autoprompt,
    }

    if start_published_date:
        payload["startPublishedDate"] = start_published_date
    if end_published_date:
        payload["endPublishedDate"] = end_published_date
    if include_domains:
        payload["includeDomains"] = include_domains
    if exclude_domains:
        payload["excludeDomains"] = exclude_domains
    if category:
        payload["category"] = category

    # Add contents options if text requested
    if include_text:
        payload["contents"] = {"text": True, "highlights": True}

    print(f"🔍 Exa search: {query}")
    if start_published_date:
        print(f"   Date range: {start_published_date} to {end_published_date or 'now'}")

    response = requests.post(
        EXA_API_URL,
        json=payload,
        headers={
            "x-api-key": api_key,
            "Content-Type": "application/json"
        },
        timeout=30
    )
    response.raise_for_status()

    data = response.json()
    results = []

    for result in data.get("results", []):
        results.append(ExaSearchResult(
            title=result.get("title", ""),
            url=result.get("url", ""),
            published_date=result.get("publishedDate"),
            author=result.get("author"),
            score=result.get("score", 0.0),
            text=result.get("text"),
            highlights=result.get("highlights"),
        ))

    print(f"✅ Found {len(results)} Exa results")
    return results


def search_date_range(
    query: str,
    days_back: int = 7,
    num_results: int = 10,
    include_domains: Optional[List[str]] = None,
) -> List[ExaSearchResult]:
    """
    Search with a relative date range (last N days).

    Args:
        query: Search query
        days_back: Number of days to look back
        num_results: Max results
        include_domains: Domain filter

    Returns:
        List of ExaSearchResult
    """
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days_back)

    return exa_search(
        query=query,
        num_results=num_results,
        start_published_date=start_date.strftime("%Y-%m-%dT00:00:00.000Z"),
        end_published_date=end_date.strftime("%Y-%m-%dT23:59:59.999Z"),
        include_domains=include_domains,
    )


def search_naaf_layer(
    country: str,
    layer_number: int,
    layer_name: str,
    days_back: int = 30,
    num_results: int = 5,
) -> List[ExaSearchResult]:
    """
    Search for layer-specific news/research for a country.

    Uses layer-specific domains and date filtering for targeted results.
    """
    query = f"{country} {layer_name} AI development policy"
    domains = NAAF_LAYER_DOMAINS.get(layer_number, [])

    return search_date_range(
        query=query,
        days_back=days_back,
        num_results=num_results,
        include_domains=domains if domains else None,
    )


def monitor_rubric_sources(
    days_back: int = 7,
    num_results: int = 10,
) -> List[ExaSearchResult]:
    """
    Monitor trusted sources for new AI assessment methodology publications.

    Used for the self-updating rubric feature - detects new research
    that might inform framework updates.
    """
    queries = [
        "AI readiness index methodology framework",
        "national AI strategy assessment metrics",
        "AI governance measurement indicators",
        "artificial intelligence policy evaluation criteria",
    ]

    all_results = []
    seen_urls = set()

    for query in queries:
        try:
            results = search_date_range(
                query=query,
                days_back=days_back,
                num_results=num_results // len(queries),
                include_domains=TRUSTED_RUBRIC_SOURCES,
            )
            for r in results:
                if r.url not in seen_urls:
                    seen_urls.add(r.url)
                    all_results.append(r)
        except Exception as e:
            print(f"⚠️ Rubric monitor query failed: {e}")
            continue

    # Sort by date (newest first)
    all_results.sort(
        key=lambda x: x.published_date or "",
        reverse=True
    )

    return all_results


def backfill_country_news(
    country: str,
    start_date: str,
    end_date: str,
    num_results: int = 20,
) -> List[ExaSearchResult]:
    """
    Backfill historical news for a country.

    Used to populate news snapshots for reports generated in the past.

    Args:
        country: Country name
        start_date: ISO date string
        end_date: ISO date string
        num_results: Max results

    Returns:
        List of ExaSearchResult
    """
    return exa_search(
        query=f"{country} artificial intelligence AI technology policy",
        num_results=num_results,
        start_published_date=start_date,
        end_published_date=end_date,
        category="news",
        include_text=True,
    )


def results_to_dict(results: List[ExaSearchResult]) -> List[Dict[str, Any]]:
    """Convert ExaSearchResult objects to dictionaries for JSON serialization."""
    return [
        {
            "title": r.title,
            "url": r.url,
            "published_date": r.published_date,
            "author": r.author,
            "score": r.score,
            "text": r.text,
            "highlights": r.highlights,
        }
        for r in results
    ]
