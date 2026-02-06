import { useState } from "react";
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
import { mockResearchCountry, ResearchResult } from "@/lib/mockResearch";
import { FileText, Loader2 } from "lucide-react";

const CreateReportDialog = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim()) return;

    setLoading(true);
    setProgress("Initializing research...");

    try {
      const result = await mockResearchCountry(country.trim(), (step) =>
        setProgress(step)
      );

      // Store result in sessionStorage for the report page
      sessionStorage.setItem("latestReport", JSON.stringify(result));
      setOpen(false);
      setCountry("");
      setLoading(false);
      setProgress("");
      navigate(`/report/${encodeURIComponent(country.trim())}`);
    } catch {
      setLoading(false);
      setProgress("Research failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!loading) setOpen(v); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          Create Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Create Country Report</DialogTitle>
          <DialogDescription>
            Enter a country name to generate an AI readiness assessment across all 8 layers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            placeholder="e.g. France, Brazil, Nigeria..."
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            disabled={loading}
            autoFocus
          />
          {loading && (
            <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              <span className="text-xs text-muted-foreground">{progress}</span>
            </div>
          )}
          <Button type="submit" disabled={loading || !country.trim()} className="w-full gap-2">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Researching...
              </>
            ) : (
              "Start Research"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportDialog;
