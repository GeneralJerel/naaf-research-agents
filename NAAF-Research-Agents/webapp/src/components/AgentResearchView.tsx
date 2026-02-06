import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { mockResearchCountry, ResearchEvent, ResearchResult } from "@/lib/mockResearch";
import { layers } from "@/data/frameworkData";
import { Search, Globe, Brain, CheckCircle2, Sparkles, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  countryName: string;
}

function useTypingEffect(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

function formatElapsed(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

const eventIcon = (type: ResearchEvent["type"]) => {
  switch (type) {
    case "searching":
      return <Search className="h-3.5 w-3.5 text-blue-500" />;
    case "reading":
      return <Globe className="h-3.5 w-3.5 text-emerald-500" />;
    case "thinking":
      return <Brain className="h-3.5 w-3.5 text-amber-500" />;
    case "scoring":
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />;
  }
};

const eventLabel = (type: ResearchEvent["type"]) => {
  switch (type) {
    case "searching": return "Searched for";
    case "reading": return "Read";
    case "thinking": return "";
    case "scoring": return "Scored";
  }
};

function ThinkingEntry({ message }: { message: string }) {
  const { displayed, done } = useTypingEffect(message, 12);
  return (
    <span className="italic text-muted-foreground text-sm leading-relaxed">
      {displayed}
      {!done && <span className="animate-pulse">▌</span>}
    </span>
  );
}

function ScoreEntry({ event }: { event: ResearchEvent }) {
  const layer = layers.find((l) => l.number === event.layer);
  return (
    <div className="flex items-center gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2 mt-1">
      <div
        className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
        style={{ backgroundColor: `hsl(var(--layer-${event.layer}))` }}
      >
        {event.score}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-semibold font-heading">{layer?.name}</span>
        <span className="text-xs text-muted-foreground">Score: {event.score}/100</span>
      </div>
    </div>
  );
}

export default function AgentResearchView({ countryName }: Props) {
  const [events, setEvents] = useState<ResearchEvent[]>([]);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);
  const startRef = useRef(Date.now());
  const navigate = useNavigate();

  const sourceCount = events.filter((e) => e.type === "reading").length;
  const completedLayers = [...new Set(events.filter((e) => e.type === "scoring").map((e) => e.layer))];
  const currentLayer = events.length > 0 ? events[events.length - 1].layer : 0;

  // Elapsed timer
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setElapsed(Date.now() - startRef.current), 200);
    return () => clearInterval(id);
  }, [done]);

  // Run research
  useEffect(() => {
    let cancelled = false;
    startRef.current = Date.now();

    mockResearchCountry(countryName, (event) => {
      if (cancelled) return;
      setEvents((prev) => [...prev, event]);
    }).then((res) => {
      if (cancelled) return;
      setResult(res);
      setElapsed(Date.now() - startRef.current);
      setTimeout(() => setDone(true), 800);
    });

    return () => { cancelled = true; };
  }, [countryName]);

  // Auto-scroll
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [events]);

  // Navigate to report after done
  const handleViewReport = useCallback(() => {
    if (result) {
      sessionStorage.setItem("latestReport", JSON.stringify(result));
      navigate(`/report/${encodeURIComponent(countryName)}`);
    }
  }, [result, countryName, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
              National AI Assessment Framework
            </p>
            <h1 className="text-xl md:text-2xl font-heading font-semibold">
              {countryName} <span className="text-muted-foreground font-normal">AI Readiness Assessment</span>
            </h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="tabular-nums">{formatElapsed(elapsed)}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_220px] gap-6 p-6">
        {/* Log feed */}
        <div className="flex flex-col min-h-0">
          <div
            ref={logRef}
            className="flex-1 overflow-y-auto space-y-3 rounded-lg border border-border bg-card p-4 max-h-[calc(100vh-220px)]"
          >
            {events.map((event, i) => (
              <div key={i} className="animate-fade-in flex gap-2.5 items-start">
                <div className="mt-1 shrink-0">{eventIcon(event.type)}</div>
                <div className="min-w-0 flex-1">
                  {event.type === "thinking" ? (
                    <ThinkingEntry message={event.message} />
                  ) : event.type === "scoring" ? (
                    <ScoreEntry event={event} />
                  ) : (
                    <p className="text-sm">
                      <span className="text-muted-foreground">{eventLabel(event.type)}</span>{" "}
                      {event.type === "reading" ? (
                        <span className="font-medium text-foreground underline decoration-border underline-offset-2">
                          {event.message}
                        </span>
                      ) : (
                        <span className="font-medium text-foreground">{event.message}</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {done && result && (
              <div className="animate-fade-in mt-6 rounded-lg border border-border bg-secondary/30 p-5 text-center space-y-3">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full border-4 border-primary mx-auto">
                  <span className="text-2xl font-heading font-bold">{result.country.overall}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Research completed in {formatElapsed(elapsed)} · {sourceCount} sources
                </p>
                <button
                  onClick={handleViewReport}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  View Full Report
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar – layer progress */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Layer Progress
            </h3>
            <div className="space-y-2">
              {layers.map((layer) => {
                const isComplete = completedLayers.includes(layer.number);
                const isCurrent = !isComplete && currentLayer === layer.number;
                return (
                  <div
                    key={layer.number}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-all duration-300",
                      isComplete && "bg-secondary/60",
                      isCurrent && "bg-primary/5 ring-1 ring-primary/20",
                      !isComplete && !isCurrent && "opacity-40"
                    )}
                  >
                    <div
                      className={cn(
                        "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 shrink-0",
                        isComplete
                          ? "text-primary-foreground"
                          : isCurrent
                          ? "ring-2 ring-primary/40 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                      style={
                        isComplete
                          ? { backgroundColor: `hsl(var(--layer-${layer.number}))` }
                          : undefined
                      }
                    >
                      {isComplete ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : isCurrent ? (
                        <span className="animate-pulse">●</span>
                      ) : (
                        layer.number
                      )}
                    </div>
                    <span
                      className={cn(
                        "truncate",
                        isComplete ? "font-medium text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {layer.name}
                    </span>
                    {isComplete && (
                      <span className="ml-auto text-[10px] font-bold tabular-nums text-muted-foreground">
                        {events.find((e) => e.type === "scoring" && e.layer === layer.number)?.score}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Sources</span>
              <span className="font-semibold tabular-nums text-foreground">{sourceCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Layers</span>
              <span className="font-semibold tabular-nums text-foreground">{completedLayers.length}/8</span>
            </div>
            {done && (
              <div className="flex items-center gap-1.5 text-xs text-green-600 pt-1">
                <Sparkles className="h-3 w-3" />
                <span className="font-medium">Research complete</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
