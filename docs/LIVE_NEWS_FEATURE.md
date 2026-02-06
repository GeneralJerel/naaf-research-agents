# Live News Feature Plan

## Overview

Add live AI news monitoring for countries using the You.com Live News API. When a user views a country report, they can toggle "Live News" to see real-time AI-related news for that country, with automatic hourly updates.

## You.com Live News API

**Endpoint:** `GET https://api.ydc-index.io/livenews`

| Parameter | Required | Description |
|-----------|----------|-------------|
| `q` | Yes | Search query |
| `count` | No | Max results to return |
| `X-API-Key` | Yes | API authentication |

**Response:**
```json
{
  "query": { "original": "...", "spellcheck_off": false },
  "results": [
    {
      "title": "Article title",
      "description": "Article summary",
      "url": "https://...",
      "source": "News Source Name",
      "timestamp": "2026-02-06T12:00:00Z",
      "thumbnail": "https://...",
      "id": "article-id"
    }
  ],
  "metadata": { "uuid": "request-id" }
}
```

## Feature Design

### User Flow

1. User clicks on a country in the ranking list
2. Report page shows country AI assessment
3. **NEW:** "Live News" toggle in the header
4. When enabled:
   - Immediately fetch latest AI news for that country
   - Display news cards below the layer breakdown
   - Auto-refresh every hour
   - Show last updated timestamp

### Query Strategy

For each country, generate targeted queries:
```
"{country} artificial intelligence news"
"{country} AI policy regulation"
"{country} AI startup funding"
"{country} AI government strategy"
```

Rotate through queries on each refresh to get diverse coverage.

### UI Components

```
┌─────────────────────────────────────────────────────┐
│  Country Report: Brazil                              │
│  AI Power Score: 52.3 | Tier 3: Adopter             │
├─────────────────────────────────────────────────────┤
│  [Layer 1] [Layer 2] ... [Layer 8]                  │
├─────────────────────────────────────────────────────┤
│  Live News  [Toggle: ON]  Last updated: 2 min ago   │
│  ┌─────────────────────────────────────────────────┐│
│  │ 📰 Brazil announces $2B AI investment plan     ││
│  │    Reuters • 3 hours ago                        ││
│  │    Brazil's government unveiled a comprehensive ││
│  │    AI strategy focusing on...                   ││
│  └─────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────┐│
│  │ 📰 São Paulo startup raises $50M for AI...     ││
│  │    TechCrunch • 5 hours ago                     ││
│  └─────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

## Implementation Plan

### Phase 1: Backend API

**File:** `strands-deepsearch-agent/backend/src/agent/tools/youcom_news.py`

```python
@tool
def fetch_country_ai_news(country: str, count: int = 5) -> List[NewsArticle]:
    """Fetch latest AI news for a country using You.com Live News API."""
    pass
```

**New Endpoint:** `GET /naaf/news/{country}`
- Returns latest AI news for the country
- Caches results for 10 minutes to reduce API calls
- Query rotation for diverse coverage

### Phase 2: Frontend Components

**Files to create:**
1. `web/src/components/LiveNews.tsx` - News card list component
2. `web/src/components/NewsCard.tsx` - Individual news article card
3. `web/src/hooks/useLiveNews.ts` - Hook for fetching + auto-refresh

**Files to modify:**
1. `web/src/pages/Report.tsx` - Add Live News section with toggle
2. `web/src/lib/api.ts` - Add `fetchCountryNews()` function

### Phase 3: Auto-Refresh

- Use `setInterval` with 1-hour refresh (3600000ms)
- Show countdown to next refresh
- Allow manual refresh button
- Pause auto-refresh when tab is hidden (visibility API)

## API Implementation

### Backend: `youcom_news.py`

```python
"""You.com Live News API integration."""

import os
import requests
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass
from functools import lru_cache

YOUCOM_NEWS_URL = "https://api.ydc-index.io/livenews"

# Query templates for AI news
NEWS_QUERIES = [
    "{country} artificial intelligence news",
    "{country} AI policy regulation",
    "{country} AI startup investment",
    "{country} AI technology development",
]

@dataclass
class NewsArticle:
    title: str
    description: str
    url: str
    source: str
    timestamp: str
    thumbnail: Optional[str] = None

def fetch_live_news(
    country: str,
    count: int = 5,
    query_index: int = 0
) -> List[NewsArticle]:
    """Fetch live AI news for a country."""
    api_key = os.getenv("YOUCOM_API_KEY")
    if not api_key:
        raise Exception("YOUCOM_API_KEY not configured")

    # Select query based on rotation
    query_template = NEWS_QUERIES[query_index % len(NEWS_QUERIES)]
    query = query_template.format(country=country)

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
            source=result.get("source", ""),
            timestamp=result.get("timestamp", ""),
            thumbnail=result.get("thumbnail")
        ))

    return articles
```

### Backend: New Endpoint in `app.py`

```python
from .tools.youcom_news import fetch_live_news, NewsArticle

# Simple in-memory cache
_news_cache: Dict[str, tuple] = {}
NEWS_CACHE_TTL = 600  # 10 minutes

@app.get("/naaf/news/{country}")
async def get_country_news(country: str, count: int = 5):
    """Get latest AI news for a country."""
    cache_key = f"{country}:{count}"
    now = datetime.now()

    # Check cache
    if cache_key in _news_cache:
        cached_data, cached_time = _news_cache[cache_key]
        if (now - cached_time).seconds < NEWS_CACHE_TTL:
            return cached_data

    # Fetch fresh news
    try:
        # Rotate query based on hour
        query_index = now.hour % 4
        articles = fetch_live_news(country, count, query_index)

        response = {
            "country": country,
            "articles": [
                {
                    "title": a.title,
                    "description": a.description,
                    "url": a.url,
                    "source": a.source,
                    "timestamp": a.timestamp,
                    "thumbnail": a.thumbnail
                }
                for a in articles
            ],
            "query_type": NEWS_QUERIES[query_index].replace("{country}", country),
            "fetched_at": now.isoformat(),
            "next_refresh": (now + timedelta(seconds=NEWS_CACHE_TTL)).isoformat()
        }

        # Update cache
        _news_cache[cache_key] = (response, now)
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Frontend: `useLiveNews.ts`

```typescript
import { useState, useEffect, useCallback } from "react";

const REFRESH_INTERVAL = 3600000; // 1 hour

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  timestamp: string;
  thumbnail?: string;
}

export interface LiveNewsState {
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  nextRefresh: Date | null;
}

export function useLiveNews(country: string, enabled: boolean) {
  const [state, setState] = useState<LiveNewsState>({
    articles: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    nextRefresh: null,
  });

  const fetchNews = useCallback(async () => {
    if (!enabled || !country) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `${API_BASE_URL}/naaf/news/${encodeURIComponent(country)}`
      );
      if (!response.ok) throw new Error("Failed to fetch news");

      const data = await response.json();
      setState({
        articles: data.articles,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
        nextRefresh: new Date(Date.now() + REFRESH_INTERVAL),
      });
    } catch (e) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: e instanceof Error ? e.message : "Unknown error",
      }));
    }
  }, [country, enabled]);

  // Initial fetch
  useEffect(() => {
    if (enabled) fetchNews();
  }, [enabled, fetchNews]);

  // Auto-refresh
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(fetchNews, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [enabled, fetchNews]);

  return { ...state, refresh: fetchNews };
}
```

### Frontend: `LiveNews.tsx`

```typescript
import { Switch } from "@/components/ui/switch";
import { NewsArticle } from "@/hooks/useLiveNews";
import { formatDistanceToNow } from "date-fns";
import { Newspaper, RefreshCw, ExternalLink } from "lucide-react";

interface LiveNewsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  articles: NewsArticle[];
  isLoading: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

const LiveNews = ({
  enabled,
  onToggle,
  articles,
  isLoading,
  lastUpdated,
  onRefresh,
}: LiveNewsProps) => {
  return (
    <div className="space-y-4">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <span className="font-heading text-sm font-semibold">Live News</span>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </div>

      {/* News cards */}
      {enabled && (
        <div className="space-y-3">
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-border bg-card p-3 transition-colors hover:bg-secondary/50"
            >
              <div className="flex gap-3">
                {article.thumbnail && (
                  <img
                    src={article.thumbnail}
                    alt=""
                    className="h-16 w-24 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {article.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{article.source}</span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(article.timestamp), {
                        addSuffix: true,
                      })}
                    </span>
                    <ExternalLink className="ml-auto h-3 w-3" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default LiveNews;
```

## Hackathon Demo Value

This feature adds:

1. **Autonomy:** Auto-refreshing news without user intervention
2. **Tool Use:** Additional You.com API integration (Live News)
3. **Real-time Data:** Shows the system working with current information
4. **User Engagement:** Interactive toggle, manual refresh

## Implementation Priority

| Priority | Task | Effort |
|----------|------|--------|
| P0 | Backend: `youcom_news.py` + endpoint | 30 min |
| P0 | Frontend: `useLiveNews.ts` hook | 20 min |
| P0 | Frontend: `LiveNews.tsx` component | 30 min |
| P1 | Integrate into Report page | 20 min |
| P2 | Add caching and error handling | 20 min |

**Total estimate:** ~2 hours

## Environment Variables

```bash
# Already using this for search
YOUCOM_API_KEY=your_key_here
```

No new API keys needed - uses the same You.com API key.
