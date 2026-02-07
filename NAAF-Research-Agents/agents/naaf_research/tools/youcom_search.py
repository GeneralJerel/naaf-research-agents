"""You.com Web Search API tool for ADK agents.

Provides web search capabilities using the You.com Search API,
with support for domain-restricted searches for authoritative sources.

API Endpoint: https://api.you.com/v1/search
Auth: X-API-Key header with YDC_API_KEY
Response schema: { "results": { "web": [ { "url", "title", "description", "snippets": [...] } ] } }
"""

import logging
import os
from typing import Optional

import httpx
from google.adk.tools import ToolContext

logger = logging.getLogger(__name__)

# Current You.com API base URL (migrated from deprecated api.ydc-index.io)
_YOUCOM_BASE = "https://api.you.com/v1"

# ---------------------------------------------------------------------------
# Startup key validation — surfaces bad keys immediately on import
# ---------------------------------------------------------------------------
_YDC_KEY = os.environ.get("YDC_API_KEY", "")
if not _YDC_KEY:
    logger.warning(
        "⚠️  YDC_API_KEY is not set. You.com search tools will not work. "
        "Add it to agents/naaf_research/.env"
    )
else:
    # Fire a lightweight probe so a bad key is caught at startup, not mid-run
    try:
        _probe = httpx.get(
            f"{_YOUCOM_BASE}/search",
            params={"query": "test", "num_web_results": 1},
            headers={"X-API-Key": _YDC_KEY},
            timeout=10.0,
        )
        if _probe.status_code == 403:
            logger.error(
                "❌ YDC_API_KEY returned 403 Forbidden — the key is invalid or "
                "expired. Get a new one at https://you.com/platform and update "
                "agents/naaf_research/.env"
            )
        elif _probe.status_code >= 400:
            logger.warning(
                f"⚠️  YDC_API_KEY probe returned {_probe.status_code}: "
                f"{_probe.text[:200]}"
            )
        else:
            logger.info("✅ YDC_API_KEY validated — You.com search is ready")
    except Exception as exc:
        logger.warning(f"⚠️  Could not validate YDC_API_KEY at startup: {exc}")


def _track_sources(hits: list, query: str, tool_context: Optional[ToolContext]) -> None:
    """Append search result URLs + metadata to session state for later persistence."""
    if tool_context is None:
        return

    collected = tool_context.state.get("collected_sources", [])
    for hit in hits:
        url = hit.get("url", "")
        if url:
            collected.append({
                "url": url,
                "title": hit.get("title", ""),
                "query": query,
                "snippet": (hit.get("snippets", [""])[0][:200]
                            if hit.get("snippets") else hit.get("description", "")[:200]),
            })
    tool_context.state["collected_sources"] = collected


async def youcom_web_search(
    query: str,
    num_results: int = 8,
    tool_context: Optional[ToolContext] = None,
) -> str:
    """Search the web using the You.com Search API.

    Use this tool to find information on the public web. Results include
    titles, URLs, and text snippets that you can cite in your research.

    Args:
        query: The search query. Be specific and include year constraints
               for recency (e.g. 'Brazil electricity generation TWh 2024').
        num_results: Number of results to return (default 8, max 10).
        tool_context: Injected by ADK — used to track source URLs in session state.

    Returns:
        Formatted search results with titles, URLs, and snippets.
    """
    api_key = os.environ.get("YDC_API_KEY")
    if not api_key:
        return "ERROR: YDC_API_KEY environment variable is not set."

    async with httpx.AsyncClient(timeout=20.0) as client:
        try:
            resp = await client.get(
                f"{_YOUCOM_BASE}/search",
                params={
                    "query": query,
                    "num_web_results": min(num_results, 10),
                },
                headers={"X-API-Key": api_key},
            )
            resp.raise_for_status()
            data = resp.json()
        except httpx.HTTPStatusError as e:
            return f"You.com API error: {e.response.status_code} - {e.response.text}"
        except httpx.RequestError as e:
            return f"You.com request failed: {str(e)}"

    # New API schema: results are under data["results"]["web"]
    hits = data.get("results", {}).get("web", [])
    if not hits:
        return f"No results found for: {query}"

    # Track all source URLs in session state for sources.json
    _track_sources(hits, query, tool_context)

    results = []
    for i, hit in enumerate(hits, 1):
        title = hit.get("title", "N/A")
        url = hit.get("url", "N/A")
        snippets = hit.get("snippets", [])
        snippet_text = " ".join(snippets)[:500] if snippets else hit.get("description", "")
        results.append(
            f"### {i}. {title}\n"
            f"**URL**: {url}\n"
            f"**Snippet**: {snippet_text}"
        )

    header = f"## Search Results for: {query}\n**Count**: {len(hits)}\n"
    return header + "\n---\n".join(results)


async def youcom_domain_search(
    query: str,
    domains: str,
    num_results: int = 8,
    tool_context: Optional[ToolContext] = None,
) -> str:
    """Search the web restricted to specific authoritative domains.

    Use this tool when you need results from specific sources like
    government websites, international organizations, or academic sources.

    Args:
        query: The search query (e.g. 'Brazil electricity generation TWh 2024').
        domains: Comma-separated list of domains to restrict to
                 (e.g. 'iea.org,worldbank.org,oecd.org').
        num_results: Number of results to return (default 8, max 10).
        tool_context: Injected by ADK — used to track source URLs in session state.

    Returns:
        Formatted search results filtered to the specified domains.
    """
    domain_list = [d.strip() for d in domains.split(",") if d.strip()]
    if domain_list:
        site_clauses = " OR ".join(f"site:{d}" for d in domain_list)
        full_query = f"{query} ({site_clauses})"
    else:
        full_query = query

    return await youcom_web_search(full_query, num_results, tool_context)
