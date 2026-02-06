import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  RefreshCw,
  Database,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  FileText,
  Settings,
  Play,
  Pause,
  ExternalLink,
  Newspaper,
  BookOpen,
} from "lucide-react";
import {
  listStoredResearch,
  getCountryHistory,
  StoredCountry,
} from "@/lib/api";

interface RecentRun {
  id: string;
  country: string;
  year: number;
  overall_score: number;
  tier: string;
  generated_at: string;
}

interface RubricUpdate {
  id: string;
  timestamp: string;
  source: string;
  sourceUrl: string;
  layer: number;
  layerName: string;
  changeType: "weight" | "metric" | "threshold";
  description: string;
  status: "proposed" | "approved" | "rejected";
  delta?: string;
}

interface NewsSignal {
  id: string;
  country: string;
  timestamp: string;
  headline: string;
  source: string;
  url: string;
  layer: number;
  sentiment: "positive" | "negative" | "neutral";
  potentialImpact: number;
}

// Mock data for rubric updates (would come from API in production)
const mockRubricUpdates: RubricUpdate[] = [
  {
    id: "ru-001",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: "Stanford HAI 2025 AI Index",
    sourceUrl: "https://aiindex.stanford.edu",
    layer: 1,
    layerName: "Power & Electricity",
    changeType: "weight",
    description:
      "Increase renewable energy weight from 10% to 15% based on new research on sustainable AI compute",
    status: "proposed",
    delta: "+5% weight",
  },
  {
    id: "ru-002",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: "Oxford Insights Gov AI Readiness",
    sourceUrl: "https://oxfordinsights.com",
    layer: 8,
    layerName: "Implementation",
    changeType: "metric",
    description: 'Add "AI Governance Framework Maturity" metric to Layer 8',
    status: "approved",
    delta: "+1 metric",
  },
  {
    id: "ru-003",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    source: "OECD AI Policy Observatory",
    sourceUrl: "https://oecd.ai",
    layer: 5,
    layerName: "Platform & Data",
    changeType: "threshold",
    description:
      "Adjust data sovereignty score thresholds based on new GDPR-equivalency standards",
    status: "approved",
    delta: "Thresholds updated",
  },
];

// Mock data for news signals
const mockNewsSignals: NewsSignal[] = [
  {
    id: "ns-001",
    country: "United States",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    headline: "NVIDIA announces $500B AI infrastructure investment plan",
    source: "Reuters",
    url: "https://reuters.com",
    layer: 3,
    sentiment: "positive",
    potentialImpact: 2.5,
  },
  {
    id: "ns-002",
    country: "China",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    headline: "New export controls may limit advanced chip access",
    source: "Bloomberg",
    url: "https://bloomberg.com",
    layer: 2,
    sentiment: "negative",
    potentialImpact: -3.0,
  },
  {
    id: "ns-003",
    country: "Germany",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    headline: "EU AI Act implementation begins, Germany leads compliance",
    source: "Politico",
    url: "https://politico.eu",
    layer: 8,
    sentiment: "positive",
    potentialImpact: 1.5,
  },
];

const getTierColor = (tier: string) => {
  if (tier.includes("Hegemon")) return "text-score-high";
  if (tier.includes("Contender") || tier.includes("Specialist"))
    return "text-score-mid";
  return "text-score-low";
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-score-high";
  if (score >= 60) return "text-score-mid";
  return "text-score-low";
};

const formatTimeAgo = (isoString: string) => {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const Admin = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<StoredCountry[]>([]);
  const [recentRuns, setRecentRuns] = useState<RecentRun[]>([]);
  const [rubricUpdates] = useState<RubricUpdate[]>(mockRubricUpdates);
  const [newsSignals] = useState<NewsSignal[]>(mockNewsSignals);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [rubricMonitorEnabled, setRubricMonitorEnabled] = useState(true);

  useEffect(() => {
    loadData();
    if (autoRefresh) {
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      const data = await listStoredResearch();
      setCountries(data.countries);
      setRecentRuns(data.recent_runs);
    } catch (e) {
      console.error("Failed to load admin data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                NAAF Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Continual Learning Monitor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Auto-refresh</span>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </header>

        {/* Stats bar */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Database className="h-4 w-4" />
              <span className="text-xs font-medium">Stored Reports</span>
            </div>
            <p className="font-heading text-2xl font-bold">{countries.length}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FileText className="h-4 w-4" />
              <span className="text-xs font-medium">Total Runs</span>
            </div>
            <p className="font-heading text-2xl font-bold">
              {countries.reduce((sum, c) => sum + c.run_count, 0)}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs font-medium">Rubric Updates</span>
            </div>
            <p className="font-heading text-2xl font-bold">
              {rubricUpdates.filter((r) => r.status === "proposed").length}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                pending
              </span>
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Newspaper className="h-4 w-4" />
              <span className="text-xs font-medium">News Signals</span>
            </div>
            <p className="font-heading text-2xl font-bold">
              {newsSignals.length}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                today
              </span>
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            {/* Rubric Evolution Panel */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  <h2 className="font-heading text-sm font-semibold">
                    Framework Evolution
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    Source Monitor
                  </span>
                  <Switch
                    checked={rubricMonitorEnabled}
                    onCheckedChange={setRubricMonitorEnabled}
                  />
                </div>
              </div>
              <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {rubricUpdates.map((update) => (
                  <div
                    key={update.id}
                    className={`rounded-lg border p-3 ${
                      update.status === "proposed"
                        ? "border-primary/30 bg-primary/5"
                        : update.status === "approved"
                          ? "border-green-500/30 bg-green-500/5"
                          : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `hsl(var(--layer-${update.layer}) / 0.15)`,
                            color: `hsl(var(--layer-${update.layer}))`,
                          }}
                        >
                          L{update.layer}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {update.layerName}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          update.status === "proposed"
                            ? "bg-primary/20 text-primary"
                            : update.status === "approved"
                              ? "bg-green-500/20 text-green-600"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {update.status}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">
                      {update.description}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <a
                        href={update.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        <ExternalLink className="h-2.5 w-2.5" />
                        {update.source}
                      </a>
                      <div className="flex items-center gap-3">
                        {update.delta && (
                          <span className="font-medium text-primary">
                            {update.delta}
                          </span>
                        )}
                        <span>{formatTimeAgo(update.timestamp)}</span>
                      </div>
                    </div>
                    {update.status === "proposed" && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                        <Button size="sm" variant="default" className="h-7 text-xs">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs">
                          Reject
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs">
                          Preview Impact
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* News Signals */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <h2 className="font-heading text-sm font-semibold">
                    Live Rating Signals
                  </h2>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  From You.com Live News
                </span>
              </div>
              <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                {newsSignals.map((signal) => (
                  <div
                    key={signal.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3"
                  >
                    <div
                      className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full ${
                        signal.sentiment === "positive"
                          ? "bg-green-500/10 text-green-500"
                          : signal.sentiment === "negative"
                            ? "bg-red-500/10 text-red-500"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {signal.sentiment === "positive" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : signal.sentiment === "negative" ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-foreground">
                          {signal.country}
                        </span>
                        <span
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `hsl(var(--layer-${signal.layer}) / 0.15)`,
                            color: `hsl(var(--layer-${signal.layer}))`,
                          }}
                        >
                          L{signal.layer}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-2 mb-1">
                        {signal.headline}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{signal.source}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${
                              signal.potentialImpact > 0
                                ? "text-green-500"
                                : signal.potentialImpact < 0
                                  ? "text-red-500"
                                  : ""
                            }`}
                          >
                            {signal.potentialImpact > 0 ? "+" : ""}
                            {signal.potentialImpact.toFixed(1)} pts
                          </span>
                          <span>{formatTimeAgo(signal.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Stored Countries */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  <h2 className="font-heading text-sm font-semibold">
                    Country Reports
                  </h2>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  Click to view report
                </span>
              </div>
              <div className="p-4 space-y-2 max-h-[350px] overflow-y-auto">
                {countries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No stored reports yet</p>
                    <p className="text-xs">
                      Generate a report to see it here
                    </p>
                  </div>
                ) : (
                  countries.map((country) => (
                    <div
                      key={country.country}
                      className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/50 cursor-pointer transition-colors"
                      onClick={() =>
                        navigate(
                          `/report/${encodeURIComponent(country.country.toLowerCase())}`
                        )
                      }
                    >
                      <div>
                        <p className="font-medium text-sm">{country.country}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {country.run_count} run{country.run_count !== 1 ? "s" : ""}{" "}
                          · Last: {formatTimeAgo(country.last_updated)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-heading text-lg font-bold ${getScoreColor(country.latest_score)}`}
                        >
                          {country.latest_score.toFixed(1)}
                        </p>
                        <p
                          className={`text-[10px] font-medium ${getTierColor(country.tier)}`}
                        >
                          {country.tier}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Runs */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-heading text-sm font-semibold">
                    Recent Research Runs
                  </h2>
                </div>
              </div>
              <div className="p-4 space-y-2 max-h-[250px] overflow-y-auto">
                {recentRuns.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <p className="text-sm">No recent runs</p>
                  </div>
                ) : (
                  recentRuns.map((run) => (
                    <div
                      key={run.id}
                      className="flex items-center justify-between rounded-lg border border-border/50 p-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Play className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{run.country}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatTimeAgo(run.generated_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-heading text-sm font-bold ${getScoreColor(run.overall_score)}`}
                        >
                          {run.overall_score.toFixed(1)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {run.tier}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-border bg-card shadow-sm p-5">
              <h3 className="font-heading text-sm font-semibold mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1"
                  onClick={() => navigate("/")}
                >
                  <Zap className="h-4 w-4" />
                  <span className="text-xs">New Report</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1"
                  onClick={loadData}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-xs">Refresh Data</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1"
                  disabled
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-xs">Export All</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col gap-1"
                  disabled
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-xs">Framework</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
