import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ResearchResult } from "@/lib/mockResearch";
import { layers } from "@/data/frameworkData";
import { usaReport } from "@/data/usaReport";
import { chinaReport } from "@/data/chinaReport";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CountryNews } from "@/components/CountryNews";
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, Minus, Newspaper, BarChart3, Shield, AlertTriangle, Lightbulb, ChevronRight } from "lucide-react";

const hardcodedReports: Record<string, ResearchResult> = {
  "united states": usaReport,
  usa: usaReport,
  china: chinaReport,
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-score-high";
  if (score >= 60) return "text-score-mid";
  return "text-score-low";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-score-high/10 border-score-high/20";
  if (score >= 60) return "bg-score-mid/10 border-score-mid/20";
  return "bg-score-low/10 border-score-low/20";
};

const getTierInfo = (score: number) => {
  if (score >= 80) return { label: "Tier 1 · Hegemon", color: "text-score-high", bg: "bg-score-high/10 border-score-high/25" };
  if (score >= 55) return { label: "Tier 2 · Contender", color: "text-score-mid", bg: "bg-score-mid/10 border-score-mid/25" };
  return { label: "Tier 3 · Emerging", color: "text-score-low", bg: "bg-score-low/10 border-score-low/25" };
};

const ScoreIcon = ({ score }: { score: number }) => {
  if (score >= 80) return <TrendingUp className="h-3.5 w-3.5 text-score-high" />;
  if (score >= 60) return <Minus className="h-3.5 w-3.5 text-score-mid" />;
  return <TrendingDown className="h-3.5 w-3.5 text-score-low" />;
};

const ScoreRing = ({ score, size = 72 }: { score: number; size?: number }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colorClass = score >= 80 ? "var(--score-high)" : score >= 60 ? "var(--score-mid)" : "var(--score-low)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={4}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`hsl(${colorClass})`}
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-heading text-xl font-bold ${getScoreColor(score)}`}>
          {score}
        </span>
      </div>
    </div>
  );
};

const Report = () => {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<ResearchResult | null>(null);

  useEffect(() => {
    const key = (countryName ?? "").toLowerCase();
    const hardcoded = hardcodedReports[key];
    if (hardcoded) {
      setReport(hardcoded);
      return;
    }
    const stored = sessionStorage.getItem("latestReport");
    if (stored) {
      setReport(JSON.parse(stored));
    }
  }, [countryName]);

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">No report data found.</p>
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const tier = getTierInfo(report.country.overall);
  const maxScore = Math.max(...report.layerDetails.map((ld) => ld.score));
  const minScore = Math.min(...report.layerDetails.map((ld) => ld.score));
  const strongLayers = report.layerDetails.filter((ld) => ld.score === maxScore);
  const weakLayers = report.layerDetails.filter((ld) => ld.score === minScore);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Nav bar */}
        <nav className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-2 text-muted-foreground hover:text-foreground -ml-2">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Rankings
          </Button>
        </nav>

        {/* Hero header */}
        <header className="mb-8 rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-semibold font-heading">
                National AI Power Report
              </p>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                {report.country.country}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${tier.bg} ${tier.color}`}>
                  {tier.label}
                </div>
                {report.strategicSummary?.classification && (
                  <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-[10px] font-medium text-muted-foreground">
                    {report.strategicSummary.classification}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ScoreRing score={report.country.overall} />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-1">Overall</p>
            </div>
          </div>

          {/* Strategic overview */}
          {report.strategicSummary?.overview && (
            <p className="mt-5 text-sm text-foreground/75 leading-relaxed border-t border-border pt-5">
              {report.strategicSummary.overview}
            </p>
          )}

          {/* Quick insights */}
          <div className="mt-5 pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Strongest</p>
              <p className="font-heading font-semibold text-foreground">
                {strongLayers.map((l) => `L${l.layerNumber} ${l.layerName}`).join(", ")}
                <span className={`ml-1.5 text-xs ${getScoreColor(maxScore)}`}>({maxScore})</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Weakest</p>
              <p className="font-heading font-semibold text-foreground">
                {weakLayers.map((l) => `L${l.layerNumber} ${l.layerName}`).join(", ")}
                <span className={`ml-1.5 text-xs ${getScoreColor(minScore)}`}>({minScore})</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Data Period</p>
              <p className="font-heading font-semibold text-foreground">2023–2025</p>
            </div>
          </div>
        </header>

        {/* Score overview bar */}
        <div className="mb-8 grid grid-cols-4 sm:grid-cols-8 gap-2">
          {layers.map((layer) => {
            const score = report.country.layers[layer.number] ?? 0;
            return (
              <div key={layer.number} className="text-center space-y-1.5">
                <div
                  className={`rounded-lg border py-2.5 transition-colors ${getScoreBg(score)}`}
                >
                  <span className={`font-heading text-base font-bold ${getScoreColor(score)}`}>
                    {score}
                  </span>
                </div>
                <p className="text-[9px] text-muted-foreground leading-tight font-medium">
                  L{layer.number} {layer.name.split(" ")[0]}
                </p>
              </div>
            );
          })}
        </div>

        {/* Tabs: Analysis & News */}
        <Tabs defaultValue="analysis" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="analysis" className="gap-1.5 text-xs">
              <BarChart3 className="h-3.5 w-3.5" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-1.5 text-xs">
              <Newspaper className="h-3.5 w-3.5" />
              Live News
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis">
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Layer-by-Layer Analysis
              </h2>

              {report.layerDetails.map((ld) => (
                <article
                  key={ld.layerNumber}
                  className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
                >
                  {/* Layer header bar */}
                  <div
                    className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border/60"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--layer-${ld.layerNumber}) / 0.06), hsl(var(--layer-${ld.layerNumber}) / 0.02))`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-heading text-xs font-bold"
                        style={{
                          backgroundColor: `hsl(var(--layer-${ld.layerNumber}) / 0.15)`,
                          color: `hsl(var(--layer-${ld.layerNumber}))`,
                        }}
                      >
                        {ld.layerNumber}
                      </span>
                      <div>
                        <h3 className="font-heading text-sm font-semibold text-foreground leading-none">
                          {ld.layerName}
                        </h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {layers.find((l) => l.number === ld.layerNumber)?.weight} weight
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ScoreIcon score={ld.score} />
                      <span className={`font-heading text-xl font-bold ${getScoreColor(ld.score)}`}>
                        {ld.score}
                      </span>
                    </div>
                  </div>

                  {/* Layer body */}
                    <div className="px-5 py-4">
                    <div className="mb-4">
                      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${ld.score}%`,
                            backgroundColor: `hsl(var(--layer-${ld.layerNumber}))`,
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {ld.findings}
                    </p>

                    {ld.keyData && (
                      <div className="mt-3 rounded-lg bg-primary/5 border border-primary/10 px-4 py-2.5">
                        <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-0.5">Key Data</p>
                        <p className="text-sm text-foreground/90 font-medium">{ld.keyData}</p>
                      </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                      <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-medium self-center mr-1">Sources</span>
                      {ld.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-secondary/80 px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          <ExternalLink className="h-2.5 w-2.5" />
                          {new URL(src).hostname.replace("www.", "")}
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="news">
            <CountryNews country={report.country.country} />
          </TabsContent>
        </Tabs>

        {/* Strategic Summary */}
        {report.strategicSummary && (
          <section className="mt-8 space-y-4">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Strategic Summary
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Strengths */}
              <div className="rounded-xl border border-score-high/20 bg-score-high/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-score-high" />
                  <h3 className="font-heading text-sm font-semibold text-score-high">Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {report.strategicSummary.strengths.map((item, i) => (
                    <li key={i}>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-foreground/70 leading-relaxed mt-0.5">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="rounded-xl border border-score-low/20 bg-score-low/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-score-low" />
                  <h3 className="font-heading text-sm font-semibold text-score-low">Weaknesses</h3>
                </div>
                <ul className="space-y-3">
                  {report.strategicSummary.weaknesses.map((item, i) => (
                    <li key={i}>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-foreground/70 leading-relaxed mt-0.5">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <h3 className="font-heading text-sm font-semibold text-primary">Recommendations</h3>
                </div>
                <ul className="space-y-3">
                  {report.strategicSummary.recommendations.map((item, i) => (
                    <li key={i}>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-foreground/70 leading-relaxed mt-0.5">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-12 border-t border-border pt-5 text-center space-y-1">
          <p className="text-[11px] text-muted-foreground">
            Report generated {new Date(report.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="text-[10px] text-muted-foreground/70">
            Data sourced from IEA, World Bank, OECD, WIPO, TOP500, Oxford Insights, Stanford HAI
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Report;
