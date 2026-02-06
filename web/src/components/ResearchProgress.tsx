import { useState, useEffect } from "react";
import { layers } from "@/data/frameworkData";
import { cn } from "@/lib/utils";
import { Check, Loader2, Circle, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface LayerProgress {
  layerNumber: number;
  layerName: string;
  status: "pending" | "researching" | "complete" | "error";
  score?: number;
  maxScore?: number;
}

export interface ResearchProgressProps {
  country: string;
  progress: number;
  currentStage: string;
  layerProgress: LayerProgress[];
  overallScore?: number;
  tier?: string;
  isComplete: boolean;
}

const layerColorVar = (n: number) => `var(--layer-${n})`;

const LayerProgressItem = ({
  layer,
  index,
}: {
  layer: LayerProgress;
  index: number;
}) => {
  const layerDef = layers.find((l) => l.number === layer.layerNumber);

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3 py-2 transition-all duration-300",
        layer.status === "researching" && "border-primary bg-primary/5 shadow-sm",
        layer.status === "complete" && "border-border bg-card",
        layer.status === "pending" && "border-border/50 bg-secondary/30 opacity-60",
        layer.status === "error" && "border-destructive bg-destructive/5"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Status icon */}
      <div
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full",
          layer.status === "researching" && "bg-primary text-primary-foreground",
          layer.status === "complete" && "bg-green-500 text-white",
          layer.status === "pending" && "bg-secondary text-muted-foreground",
          layer.status === "error" && "bg-destructive text-destructive-foreground"
        )}
      >
        {layer.status === "researching" && (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        )}
        {layer.status === "complete" && <Check className="h-3.5 w-3.5" />}
        {layer.status === "pending" && <Circle className="h-3 w-3" />}
        {layer.status === "error" && <span className="text-xs">!</span>}
      </div>

      {/* Layer info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-medium"
            style={{ color: `hsl(${layerColorVar(layer.layerNumber)})` }}
          >
            L{layer.layerNumber}
          </span>
          <span className="text-xs font-medium truncate">{layer.layerName}</span>
        </div>
        {layer.status === "researching" && (
          <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full animate-pulse rounded-full"
              style={{
                backgroundColor: `hsl(${layerColorVar(layer.layerNumber)})`,
                width: "60%",
              }}
            />
          </div>
        )}
        {layer.status === "complete" && layer.score !== undefined && (
          <div className="mt-1 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  backgroundColor: `hsl(${layerColorVar(layer.layerNumber)})`,
                  width: `${(layer.score / (layer.maxScore || 20)) * 100}%`,
                }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">
              {layer.score.toFixed(1)}/{layer.maxScore || 20}
            </span>
          </div>
        )}
      </div>

      {/* Weight badge */}
      <span className="text-[9px] text-muted-foreground">
        {layerDef?.weight || ""}
      </span>
    </div>
  );
};

const ResearchProgress = ({
  country,
  progress,
  currentStage,
  layerProgress,
  overallScore,
  tier,
  isComplete,
}: ResearchProgressProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar smoothly
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className="space-y-4">
      {/* Header with country and overall progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-heading text-sm font-semibold">
              Researching {country}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(animatedProgress)}%
          </span>
        </div>
        <Progress value={animatedProgress} className="h-2" />
        <p className="text-xs text-muted-foreground">{currentStage}</p>
      </div>

      {/* Layer progress grid */}
      <div className="grid gap-2">
        {layerProgress.map((layer, index) => (
          <LayerProgressItem
            key={layer.layerNumber}
            layer={layer}
            index={index}
          />
        ))}
      </div>

      {/* Final score (shown when complete) */}
      {isComplete && overallScore !== undefined && (
        <div className="mt-4 rounded-lg border border-primary bg-primary/5 p-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            AI Power Score
          </div>
          <div className="mt-1 font-heading text-4xl font-bold text-primary">
            {overallScore.toFixed(1)}
          </div>
          {tier && (
            <div className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {tier}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResearchProgress;
