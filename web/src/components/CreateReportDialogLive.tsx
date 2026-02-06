import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Loader2, Wifi, WifiOff } from "lucide-react";
import { layers } from "@/data/frameworkData";
import ResearchProgress, { LayerProgress } from "./ResearchProgress";
import { researchCountry, NAAFResearchEvent, NAAFReport } from "@/lib/api";

type DialogMode = "input" | "researching" | "complete" | "error";

const CreateReportDialogLive = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [mode, setMode] = useState<DialogMode>("input");
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [layerProgress, setLayerProgress] = useState<LayerProgress[]>([]);
  const [overallScore, setOverallScore] = useState<number | undefined>();
  const [tier, setTier] = useState<string | undefined>();
  const [report, setReport] = useState<NAAFReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useApi, setUseApi] = useState(true);
  const navigate = useNavigate();

  // Initialize layer progress from framework data
  const initializeLayerProgress = useCallback(() => {
    return layers.map((l) => ({
      layerNumber: l.number,
      layerName: l.name,
      status: "pending" as const,
    }));
  }, []);

  // Handle real API research
  const handleApiResearch = async (countryName: string) => {
    setMode("researching");
    setLayerProgress(initializeLayerProgress());
    setProgress(0);
    setCurrentStage("Initializing research...");
    setError(null);

    try {
      for await (const event of researchCountry(countryName)) {
        handleResearchEvent(event);
      }
    } catch (e) {
      console.error("Research error:", e);
      setError(e instanceof Error ? e.message : "Research failed");
      setMode("error");
    }
  };

  // Handle SSE events from the API
  const handleResearchEvent = (event: NAAFResearchEvent) => {
    console.log("Research event:", event);

    setProgress(event.progress);
    setCurrentStage(event.message);

    switch (event.type) {
      case "status":
        // Update current stage
        if (event.stage?.startsWith("layer_")) {
          const layerNum = parseInt(event.stage.replace("layer_", ""));
          if (!isNaN(layerNum)) {
            setLayerProgress((prev) =>
              prev.map((l) =>
                l.layerNumber === layerNum
                  ? { ...l, status: "researching" }
                  : l.layerNumber < layerNum
                  ? { ...l, status: "complete" }
                  : l
              )
            );
          }
        }
        break;

      case "layer_complete":
        if (event.data) {
          const { layer_number, score, max_score, status } = event.data;
          if (layer_number) {
            setLayerProgress((prev) =>
              prev.map((l) =>
                l.layerNumber === layer_number
                  ? {
                      ...l,
                      status: status === "complete" ? "complete" : "error",
                      score,
                      maxScore: max_score,
                    }
                  : l
              )
            );
          }
        }
        break;

      case "scoring_complete":
        if (event.data) {
          setOverallScore(event.data.overall_score);
          setTier(event.data.tier);
        }
        break;

      case "complete":
        setMode("complete");
        if (event.data?.report) {
          setReport(event.data.report);
          // Store for report page
          sessionStorage.setItem(
            "latestReport",
            JSON.stringify(event.data.report)
          );
        }
        break;

      case "error":
        setError(event.message);
        setMode("error");
        break;
    }
  };

  // Handle mock research (fallback)
  const handleMockResearch = async (countryName: string) => {
    setMode("researching");
    const initialProgress = initializeLayerProgress();
    setLayerProgress(initialProgress);
    setProgress(0);
    setCurrentStage("Initializing research...");

    // Simulate layer-by-layer research
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      setCurrentStage(`Researching Layer ${layer.number}: ${layer.name}...`);
      setProgress(5 + (i / layers.length) * 80);

      // Mark current layer as researching
      setLayerProgress((prev) =>
        prev.map((l) =>
          l.layerNumber === layer.number ? { ...l, status: "researching" } : l
        )
      );

      // Simulate research delay
      await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));

      // Mark layer complete with random score
      const score =
        ((layer.number <= 3 ? 0.6 : 0.5) + Math.random() * 0.4) *
        parseFloat(layer.weight);
      setLayerProgress((prev) =>
        prev.map((l) =>
          l.layerNumber === layer.number
            ? {
                ...l,
                status: "complete",
                score: parseFloat(score.toFixed(1)),
                maxScore: parseFloat(layer.weight),
              }
            : l
        )
      );
    }

    // Calculate overall score
    setCurrentStage("Calculating AI Power Score...");
    setProgress(90);
    await new Promise((r) => setTimeout(r, 500));

    const finalScore = 30 + Math.random() * 50;
    setOverallScore(finalScore);
    setTier(
      finalScore >= 80
        ? "Tier 1: Hegemon"
        : finalScore >= 50
        ? "Tier 2: Strategic Specialist"
        : finalScore >= 30
        ? "Tier 3: Adopter"
        : "Tier 4: Consumer"
    );

    setProgress(100);
    setCurrentStage("Research complete!");
    setMode("complete");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim()) return;

    if (useApi) {
      await handleApiResearch(country.trim());
    } else {
      await handleMockResearch(country.trim());
    }
  };

  const handleViewReport = () => {
    setOpen(false);
    navigate(`/report/${encodeURIComponent(country.trim())}`);
  };

  const handleReset = () => {
    setMode("input");
    setCountry("");
    setProgress(0);
    setCurrentStage("");
    setLayerProgress([]);
    setOverallScore(undefined);
    setTier(undefined);
    setReport(null);
    setError(null);
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen && mode === "researching") return; // Prevent closing during research
    if (!newOpen) handleReset();
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          Create Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            {mode === "input" && "Create Country Report"}
            {mode === "researching" && "Researching..."}
            {mode === "complete" && "Research Complete"}
            {mode === "error" && "Research Error"}
          </DialogTitle>
          {mode === "input" && (
            <DialogDescription>
              Enter a country name to generate an AI readiness assessment across
              all 8 layers using the NAAF framework.
            </DialogDescription>
          )}
        </DialogHeader>

        {mode === "input" && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <Input
              placeholder="e.g. France, Brazil, Nigeria..."
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              autoFocus
            />

            {/* API toggle */}
            <div className="flex items-center justify-between rounded-md border border-border bg-secondary/30 px-3 py-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {useApi ? (
                  <Wifi className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5 text-yellow-500" />
                )}
                <span>{useApi ? "Live API" : "Demo Mode"}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 text-xs"
                onClick={() => setUseApi(!useApi)}
              >
                Switch
              </Button>
            </div>

            <Button
              type="submit"
              disabled={!country.trim()}
              className="w-full gap-2"
            >
              Start Research
            </Button>
          </form>
        )}

        {(mode === "researching" || mode === "complete") && (
          <div className="pt-2">
            <ResearchProgress
              country={country}
              progress={progress}
              currentStage={currentStage}
              layerProgress={layerProgress}
              overallScore={overallScore}
              tier={tier}
              isComplete={mode === "complete"}
            />

            {mode === "complete" && (
              <div className="mt-4 flex gap-2">
                <Button onClick={handleViewReport} className="flex-1">
                  View Full Report
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  New Research
                </Button>
              </div>
            )}
          </div>
        )}

        {mode === "error" && (
          <div className="space-y-4 pt-2">
            <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Try switching to Demo Mode or check if the API is running.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Try Again
              </Button>
              <Button
                onClick={() => {
                  setUseApi(false);
                  handleReset();
                }}
                className="flex-1"
              >
                Use Demo Mode
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportDialogLive;
