"""You.com Live News API integration.

Fetches real-time AI-related news for countries using the You.com Live News API.
This is a hackathon sponsor tool for the Continual Learning Hackathon.
"""

import os
import requests
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from datetime import datetime

YOUCOM_NEWS_URL = "https://api.ydc-index.io/livenews"

# Query templates for AI-related news
NEWS_QUERY_TEMPLATES = [
    "{country} artificial intelligence news",
    "{country} AI policy regulation government",
    "{country} AI startup funding investment",
    "{country} machine learning technology development",
]


@dataclass
class NewsArticle:
    """A news article from the You.com Live News API."""
    title: str
    description: str
    url: str
    source: str
    timestamp: str
    thumbnail: Optional[str] = None
    article_id: Optional[str] = None


def fetch_live_news(
    country: str,
    count: int = 5,
    query_index: int = 0
) -> List[NewsArticle]:
    """
    Fetch live AI news for a country using You.com Live News API.

    Args:
        country: Country name to search news for
        count: Maximum number of articles to return
        query_index: Index of query template to use (for rotation)

    Returns:
        List of NewsArticle objects
    """
    api_key = os.getenv("YOUCOM_API_KEY")
    if not api_key:
        raise Exception("YOUCOM_API_KEY not configured")

    # Select query based on rotation index
    query_template = NEWS_QUERY_TEMPLATES[query_index % len(NEWS_QUERY_TEMPLATES)]
    query = query_template.format(country=country)

    print(f"📰 Fetching news: {query}")

    response = requests.get(
        YOUCOM_NEWS_URL,
        params={"q": query, "count": count},
        headers={"X-API-Key": api_key},
        timeout=10
    )
    response.raise_for_status()

    data = response.json()
    articles = []

    for result in data.get("results", []):
        articles.append(NewsArticle(
            title=result.get("title", ""),
            description=result.get("description", ""),
            url=result.get("url", ""),
            source=result.get("source", "Unknown"),
            timestamp=result.get("timestamp", datetime.now().isoformat()),
            thumbnail=result.get("thumbnail"),
            article_id=result.get("id")
        ))

    print(f"✅ Found {len(articles)} news articles")
    return articles


def fetch_multi_query_news(
    country: str,
    count_per_query: int = 3
) -> List[NewsArticle]:
    """
    Fetch news using multiple query templates for diverse coverage.

    Args:
        country: Country name to search news for
        count_per_query: Number of articles per query template

    Returns:
        Deduplicated list of NewsArticle objects
    """
    all_articles = []
    seen_urls = set()

    for i, template in enumerate(NEWS_QUERY_TEMPLATES):
        try:
            articles = fetch_live_news(country, count_per_query, i)
            for article in articles:
                if article.url not in seen_urls:
                    seen_urls.add(article.url)
                    all_articles.append(article)
        except Exception as e:
            print(f"⚠️ Query {i} failed: {e}")
            continue

    # Sort by timestamp (newest first)
    all_articles.sort(
        key=lambda a: a.timestamp if a.timestamp else "",
        reverse=True
    )

    return all_articles


def articles_to_dict(articles: List[NewsArticle]) -> List[Dict[str, Any]]:
    """Convert NewsArticle objects to dictionaries for JSON serialization."""
    return [
        {
            "title": a.title,
            "description": a.description,
            "url": a.url,
            "source": a.source,
            "timestamp": a.timestamp,
            "thumbnail": a.thumbnail,
            "id": a.article_id
        }
        for a in articles
    ]
