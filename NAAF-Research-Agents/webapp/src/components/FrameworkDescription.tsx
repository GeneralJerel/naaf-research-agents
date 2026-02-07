import { useNavigate } from "react-router-dom";
import { layers } from "@/data/frameworkData";

const FrameworkDescription = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="font-heading text-xs uppercase tracking-wider text-primary font-semibold">
          Framework Overview
        </h2>
        <h1 className="font-heading text-3xl font-bold leading-tight text-foreground lg:text-4xl">
          National AI
          <br />
          Assessment
          <br />
          <span className="text-primary">Framework</span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Ranking countries across the{" "}
          <span className="text-foreground font-medium">eight layers of the AI industry</span>{" "}
          — from physical constraints to economic impact. Designed for AI agents
          researching public government and IGO data.
        </p>
      </div>

      <div className="space-y-1.5">
        {layers.map((layer) => (
          <div
            key={layer.number}
            className="group flex items-center gap-3 rounded-md border border-transparent px-3 py-2 transition-all hover:border-border hover:bg-secondary/50"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded font-heading text-xs font-bold"
              style={{
                backgroundColor: `hsl(var(--layer-${layer.number}) / 0.15)`,
                color: `hsl(var(--layer-${layer.number}))`,
              }}
            >
              {layer.number}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-xs font-semibold text-foreground">
                  {layer.name}
                </span>
                <span className="font-heading text-[10px] text-muted-foreground">
                  {layer.weight}
                </span>
              </div>
              <p className="truncate text-[11px] text-muted-foreground">
                {layer.shortDesc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-secondary/30 p-4">
        <h3 className="font-heading text-xs font-semibold text-foreground mb-2">
          Agent Research Protocol
        </h3>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Role: Policy Research Analyst — using only public data from 2023–2025.
          Prioritizing government, IGOs (World Bank, OECD, IEA), and reputable indices.
        </p>
        <button
          onClick={() => navigate("/framework")}
          className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Read the full framework article →
        </button>
      </div>
    </div>
  );
};

export default FrameworkDescription;
