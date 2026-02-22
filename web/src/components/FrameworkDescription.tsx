import { layers } from "@/data/frameworkData";

const tiers = [
  { label: "Hegemon", range: "80–100", desc: "Full-stack AI sovereignty" },
  { label: "Strategic Specialist", range: "50–79", desc: "Strong in select layers" },
  { label: "Adopter", range: "30–49", desc: "Consumes foreign AI" },
  { label: "Consumer", range: "0–29", desc: "Fully import-dependent" },
];

const FrameworkDescription = () => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
          Framework Overview
        </p>
        <h1 className="font-heading text-[32px] font-bold leading-[1.15] tracking-tight text-foreground lg:text-[38px]">
          National AI
          <br />
          Assessment
          <br />
          <span className="text-primary">Framework</span>
        </h1>
        <p className="max-w-sm text-sm leading-[1.7] text-muted-foreground">
          Evaluating countries across{" "}
          <span className="font-medium text-foreground">eight layers of the AI value chain</span>
          {" "}— from physical infrastructure to economic implementation — using only 
          public, verifiable data.
        </p>
      </div>

      {/* Layer Index */}
      <div className="space-y-0.5">
        {layers.map((layer) => (
          <div
            key={layer.number}
            className="group flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-secondary/60"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded font-heading text-[11px] font-bold"
              style={{
                backgroundColor: `hsl(var(--layer-${layer.number}) / 0.12)`,
                color: `hsl(var(--layer-${layer.number}))`,
              }}
            >
              {layer.number}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground">
                  {layer.name}
                </span>
                <span className="text-[10px] tabular-nums text-muted-foreground">
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

      {/* Power Tiers */}
      <div className="rounded-lg border border-border p-4">
        <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-foreground">
          Scoring Tiers
        </h3>
        <div className="space-y-2">
          {tiers.map((tier) => (
            <div key={tier.label} className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-foreground">{tier.label}</span>
                <span className="text-[10px] text-muted-foreground">{tier.desc}</span>
              </div>
              <span className="text-[10px] tabular-nums font-medium text-muted-foreground">
                {tier.range}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FrameworkDescription;
