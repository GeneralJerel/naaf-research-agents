import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { NewsArticle } from "@/hooks/useLiveNews";
import { Newspaper, RefreshCw, ExternalLink, Loader2, AlertCircle } from "lucide-react";

interface LiveNewsProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  queryType: string | null;
  onRefresh: () => void;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString();
}

function formatArticleTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return formatTimeAgo(date);
  } catch {
    return "";
  }
}

const NewsCard = ({ article }: { article: NewsArticle }) => (
  <a
    href={article.url}
    target="_blank"
    rel="noopener noreferrer"
    className="block rounded-lg border border-border bg-card p-3 transition-all hover:bg-secondary/50 hover:shadow-sm"
  >
    <div className="flex gap-3">
      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt=""
          className="h-16 w-24 flex-shrink-0 rounded object-cover bg-secondary"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2 text-foreground">
          {article.title}
        </h4>
        {article.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {article.description}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="font-medium">{article.source}</span>
          {article.timestamp && (
            <>
              <span>•</span>
              <span>{formatArticleTime(article.timestamp)}</span>
            </>
          )}
          <ExternalLink className="ml-auto h-3 w-3 flex-shrink-0" />
        </div>
      </div>
    </div>
  </a>
);

const LiveNews = ({
  enabled,
  onToggle,
  articles,
  isLoading,
  error,
  lastUpdated,
  queryType,
  onRefresh,
}: LiveNewsProps) => {
  return (
    <div className="space-y-4">
      {/* Header with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4 text-primary" />
          <span className="font-heading text-sm font-semibold">Live AI News</span>
          {enabled && !isLoading && articles.length > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              {articles.length} articles
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {enabled && lastUpdated && (
            <span className="text-[10px] text-muted-foreground">
              Updated {formatTimeAgo(lastUpdated)}
            </span>
          )}
          {enabled && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50"
              title="Refresh news"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          )}
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </div>

      {/* Query type indicator */}
      {enabled && queryType && !isLoading && (
        <p className="text-[10px] text-muted-foreground">
          Searching: "{queryType}"
        </p>
      )}

      {/* Loading state */}
      {enabled && isLoading && articles.length === 0 && (
        <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary/30 p-8">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Fetching latest news...
          </span>
        </div>
      )}

      {/* Error state */}
      {enabled && error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <div className="flex-1">
            <p className="text-sm text-destructive">{error}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Check if the API is running and YOUCOM_API_KEY is set.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Retry
          </Button>
        </div>
      )}

      {/* News cards */}
      {enabled && !error && articles.length > 0 && (
        <div className="space-y-3">
          {articles.map((article, i) => (
            <NewsCard key={article.id || i} article={article} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {enabled && !isLoading && !error && articles.length === 0 && (
        <div className="rounded-lg border border-border bg-secondary/30 p-6 text-center">
          <Newspaper className="mx-auto h-8 w-8 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">
            No recent AI news found for this country.
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={onRefresh}>
            Try Again
          </Button>
        </div>
      )}

      {/* Disabled hint */}
      {!enabled && (
        <p className="text-xs text-muted-foreground">
          Enable to see real-time AI news for this country. Updates hourly.
        </p>
      )}
    </div>
  );
};

export default LiveNews;
