import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";
const REFRESH_INTERVAL = 3600000; // 1 hour in milliseconds

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  timestamp: string;
  thumbnail?: string;
  id?: string;
}

export interface LiveNewsResponse {
  country: string;
  articles: NewsArticle[];
  query_type: string;
  fetched_at: string;
  cache_ttl_seconds: number;
  article_count: number;
}

export interface LiveNewsState {
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  nextRefresh: Date | null;
  queryType: string | null;
}

export function useLiveNews(country: string, enabled: boolean) {
  const [state, setState] = useState<LiveNewsState>({
    articles: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    nextRefresh: null,
    queryType: null,
  });

  const fetchNews = useCallback(async () => {
    if (!enabled || !country) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(
        `${API_BASE_URL}/naaf/news/${encodeURIComponent(country)}?count=5`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.statusText}`);
      }

      const data: LiveNewsResponse = await response.json();

      setState({
        articles: data.articles,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
        nextRefresh: new Date(Date.now() + REFRESH_INTERVAL),
        queryType: data.query_type,
      });
    } catch (e) {
      console.error("News fetch error:", e);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: e instanceof Error ? e.message : "Failed to fetch news",
      }));
    }
  }, [country, enabled]);

  // Initial fetch when enabled
  useEffect(() => {
    if (enabled && country) {
      fetchNews();
    }
  }, [enabled, country, fetchNews]);

  // Auto-refresh every hour
  useEffect(() => {
    if (!enabled || !country) return;

    const interval = setInterval(fetchNews, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [enabled, country, fetchNews]);

  // Clear state when disabled
  useEffect(() => {
    if (!enabled) {
      setState({
        articles: [],
        isLoading: false,
        error: null,
        lastUpdated: null,
        nextRefresh: null,
        queryType: null,
      });
    }
  }, [enabled]);

  return {
    ...state,
    refresh: fetchNews,
  };
}
