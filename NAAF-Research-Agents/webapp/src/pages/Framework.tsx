import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  frameworkIntro,
  layerArticles,
  tiers,
  methodology,
  agentProtocol,
} from "@/data/frameworkArticle";
import {
  ArrowLeft,
  Zap,
  Cpu,
  Server,
  Brain,
  Database,
  Rocket,
  GraduationCap,
  Building,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Target,
  Globe,
  Bot,
  Layers,
  Scale,
  Shield,
} from "lucide-react";

/* ─── Icon Map ─── */
const iconMap: Record<string, React.ReactNode> = {
  Zap: <Zap className="h-5 w-5" />,
  Cpu: <Cpu className="h-5 w-5" />,
  Server: <Server className="h-5 w-5" />,
  Brain: <Brain className="h-5 w-5" />,
  Database: <Database className="h-5 w-5" />,
  Rocket: <Rocket className="h-5 w-5" />,
  GraduationCap: <GraduationCap className="h-5 w-5" />,
  Building: <Building className="h-5 w-5" />,
};

/* ─── Tier Badge Color ─── */
const tierColors: Record<string, string> = {
  high: "border-score-high/30 bg-score-high/8 text-score-high",
  mid: "border-score-mid/30 bg-score-mid/8 text-score-mid",
  low: "border-score-low/30 bg-score-low/8 text-score-low",
  muted: "border-border bg-secondary/50 text-muted-foreground",
};

/* ─── Weight bar visualization ─── */
const weightMap: Record<number, number> = {
  1: 20, 2: 15, 3: 15, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10,
};

/* ─── Expandable Layer Card ─── */
function LayerCard({ layer }: { layer: (typeof layerArticles)[number] }) {
  const [expanded, setExpanded] = useState(false);
  const weight = weightMap[layer.number];

  return (
    <article
      className="rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-all hover:shadow-md"
      id={`layer-${layer.number}`}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-start gap-4 group"
        style={{
          background: `linear-gradient(135deg, hsl(var(--layer-${layer.number}) / 0.06), hsl(var(--layer-${layer.number}) / 0.02))`,
        }}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg mt-0.5"
          style={{
            backgroundColor: `hsl(var(--layer-${layer.number}) / 0.15)`,
            color: `hsl(var(--layer-${layer.number}))`,
          }}
        >
          {iconMap[layer.icon]}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                Layer {layer.number} · {weight}% Weight
              </p>
              <h3 className="font-heading text-lg font-bold text-foreground leading-tight">
                {layer.name}
              </h3>
            </div>
            <div className="shrink-0 text-muted-foreground group-hover:text-foreground transition-colors">
              {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-1.5">
            {layer.definition}
          </p>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6 space-y-5 border-t border-border/50 pt-5">
          {/* Why it matters */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <Target className="h-3.5 w-3.5 text-primary" />
              Why It Matters
            </h4>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {layer.whyItMatters}
            </p>
          </div>

          {/* Metrics */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Scale className="h-3.5 w-3.5 text-primary" />
              Key Metrics
            </h4>
            <div className="grid gap-2">
              {layer.metrics.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/60 bg-secondary/20 px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-heading text-xs font-semibold text-foreground">
                      {m.name}
                    </span>
                    {m.direction && (
                      <span className="text-[10px] rounded-full border border-border px-2 py-0.5 text-muted-foreground whitespace-nowrap">
                        {m.direction}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Scoring Rubric */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Scoring Rubric ({layer.scoringRubric.maxPoints} points)
            </h4>
            <div className="space-y-3">
              {layer.scoringRubric.breakdowns.map((b, i) => (
                <div key={i} className="rounded-lg border border-border/60 bg-card px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-foreground">{b.label}</span>
                    <span
                      className="text-xs font-bold font-heading"
                      style={{ color: `hsl(var(--layer-${layer.number}))` }}
                    >
                      {b.points} pts
                    </span>
                  </div>
                  {b.formula && (
                    <p className="text-xs text-muted-foreground font-mono bg-secondary/40 rounded px-2 py-1 mb-1.5 inline-block">
                      {b.formula}
                    </p>
                  )}
                  {b.tiers && (
                    <div className="space-y-1 mt-1.5">
                      {b.tiers.map((t, j) => (
                        <div key={j} className="flex items-start gap-2 text-xs">
                          <span className="font-heading font-bold text-foreground w-6 shrink-0 text-right">
                            {t.score}
                          </span>
                          <span className="text-muted-foreground">{t.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              Primary Data Sources
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {layer.primarySources.map((src, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-md bg-secondary/80 px-2.5 py-1 text-[10px] text-muted-foreground"
                >
                  {src}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

/* ─── Main Page ─── */
export default function Framework() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Nav */}
        <nav className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Button>
        </nav>

        {/* ── Hero ── */}
        <header className="mb-12">
          <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-semibold font-heading mb-3">
            Framework Deep Dive
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5">
            {frameworkIntro.headline}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {frameworkIntro.tagline}
          </p>
          <div className="mt-6 rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {frameworkIntro.abstract}
            </p>
          </div>
        </header>

        {/* ── Design Principles ── */}
        <section className="mb-14">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-primary" />
            Design Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {frameworkIntro.designPrinciples.map((p, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-heading text-sm font-semibold text-foreground mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Weight Distribution ── */}
        <section className="mb-14">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-primary" />
            Weight Distribution
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
              Physical infrastructure layers receive higher weights because they are the hardest to acquire and most strategically significant. A nation cannot sprint past a power deficit or a chip embargo.
            </p>
            <div className="space-y-2.5">
              {layerArticles.map((layer) => {
                const w = weightMap[layer.number];
                return (
                  <div key={layer.number} className="flex items-center gap-3">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded font-heading text-[10px] font-bold"
                      style={{
                        backgroundColor: `hsl(var(--layer-${layer.number}) / 0.15)`,
                        color: `hsl(var(--layer-${layer.number}))`,
                      }}
                    >
                      {layer.number}
                    </span>
                    <span className="w-36 sm:w-44 text-xs font-medium text-foreground truncate">
                      {layer.name}
                    </span>
                    <div className="flex-1 relative h-3 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                        style={{
                          width: `${w * 5}%`,
                          backgroundColor: `hsl(var(--layer-${layer.number}))`,
                        }}
                      />
                    </div>
                    <span className="font-heading text-xs font-bold text-foreground w-10 text-right">
                      {w}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── The 8 Layers ── */}
        <section className="mb-14">
          <h2 className="font-heading text-xl font-bold text-foreground mb-2 flex items-center gap-2.5">
            <Globe className="h-5 w-5 text-primary" />
            The Eight Layers
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Click any layer to expand its full breakdown — definition, metrics, scoring rubric, and data sources.
          </p>
          <div className="space-y-3">
            {layerArticles.map((layer) => (
              <LayerCard key={layer.number} layer={layer} />
            ))}
          </div>
        </section>

        {/* ── Scoring Methodology ── */}
        <section className="mb-14">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-primary" />
            {methodology.title}
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-5">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {methodology.description}
            </p>
            <div className="rounded-lg bg-primary/5 border border-primary/15 px-5 py-3.5">
              <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">Core Formula</p>
              <p className="font-mono text-sm font-medium text-foreground">
                {methodology.formula}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {methodology.keyPrinciples.map((p, i) => (
                <div key={i} className="rounded-lg border border-border/60 bg-secondary/20 px-4 py-3">
                  <h4 className="font-heading text-xs font-semibold text-foreground mb-1">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Power Tiers ── */}
        <section className="mb-14">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2.5">
            <Target className="h-5 w-5 text-primary" />
            Power Tiers
          </h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Composite scores map to four strategic tiers that describe a country's position in the global AI landscape.
          </p>
          <div className="space-y-3">
            {tiers.map((t) => (
              <div
                key={t.tier}
                className={`rounded-xl border p-5 sm:p-6 ${tierColors[t.color]}`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="font-heading text-base font-bold">
                    Tier {t.tier}: {t.name}
                  </h3>
                  <span className="font-heading text-sm font-bold whitespace-nowrap">
                    {t.range}
                  </span>
                </div>
                <p className="text-sm leading-relaxed opacity-90 mb-3">
                  {t.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {t.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="rounded-full border px-2.5 py-0.5 text-[10px] font-medium border-current/20"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Agent Research Protocol ── */}
        <section className="mb-14">
          <h2 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2.5">
            <Bot className="h-5 w-5 text-primary" />
            Agent Research Protocol
          </h2>
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                  Role
                </p>
                <p className="text-sm font-semibold text-foreground">{agentProtocol.role}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {agentProtocol.objective}
                </p>
              </div>
            </div>

            {/* Constraints */}
            <div>
              <h4 className="font-heading text-xs font-semibold text-foreground mb-2.5">
                Research Constraints
              </h4>
              <ul className="space-y-1.5">
                {agentProtocol.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Research Tasks */}
            <div>
              <h4 className="font-heading text-xs font-semibold text-foreground mb-2.5">
                Research Task Sequence
              </h4>
              <div className="space-y-2">
                {agentProtocol.researchTasks.map((task, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-border/60 bg-secondary/20 px-3.5 py-2.5"
                  >
                    <span className="font-heading text-xs font-bold text-primary mt-0.5 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-xs text-foreground/80">{task}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Output */}
            <div className="rounded-lg bg-primary/5 border border-primary/15 px-4 py-3">
              <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">
                Output Format
              </p>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {agentProtocol.outputFormat}
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mb-10 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">
            Ready to assess a country?
          </h2>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            The NAAF agent will autonomously research all 8 layers using live public data and generate a comprehensive power report.
          </p>
          <Button onClick={() => navigate("/")} className="gap-2">
            <Layers className="h-4 w-4" />
            Go to Dashboard
          </Button>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-5 text-center space-y-1 pb-6">
          <p className="text-[11px] text-muted-foreground">
            National AI Assessment Framework — Continual Learning Hackathon 2026
          </p>
          <p className="text-[10px] text-muted-foreground/70">
            Data sourced from IEA, World Bank, OECD, WIPO, TOP500, Oxford Insights, Stanford HAI, UNESCO
          </p>
        </footer>
      </div>
    </div>
  );
}
