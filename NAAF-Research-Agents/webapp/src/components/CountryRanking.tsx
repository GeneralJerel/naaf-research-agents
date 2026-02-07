import { useNavigate } from "react-router-dom";
import { sampleCountries, layers } from "@/data/frameworkData";

const layerColorVar = (n: number) => `var(--layer-${n})`;

const ScoreBar = ({ score, layerNum }: { score: number; layerNum: number }) => (
  <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-secondary">
    <div
      className="h-full rounded-full animate-bar-fill"
      style={{
        ["--bar-width" as string]: `${score}%`,
        backgroundColor: `hsl(${layerColorVar(layerNum)})`,
        width: `${score}%`,
      }}
    />
  </div>
);

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-score-high";
  if (score >= 60) return "text-score-mid";
  return "text-score-low";
};

const countriesWithReports = new Set(["united states", "china"]);

const CountryRanking = () => {
  const navigate = useNavigate();
  const sorted = [...sampleCountries].sort((a, b) => b.overall - a.overall);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Country Rankings
        </h2>
        <span className="text-xs text-muted-foreground">
          Sample data · 2024
        </span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[2rem_1fr_3rem] gap-2 px-3 text-[10px] uppercase tracking-wider text-muted-foreground">
        <span>#</span>
        <span>Country</span>
        <span className="text-right">Score</span>
      </div>

      {/* Country rows */}
      <div className="space-y-1">
        {sorted.map((country, idx) => {
          const hasReport = countriesWithReports.has(country.country.toLowerCase());
          return (
            <div
              key={country.code}
              className={`group rounded-lg border border-border bg-card px-4 py-3.5 shadow-sm transition-all hover:shadow-md ${hasReport ? "cursor-pointer" : ""}`}
              style={{ animationDelay: `${idx * 80}ms` }}
              onClick={() => {
                if (hasReport) {
                  navigate(`/report/${encodeURIComponent(country.country)}`);
                }
              }}
            >
              <div className="grid grid-cols-[2rem_1fr_3rem] items-center gap-2">
                <span className="font-heading text-sm font-bold text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <span className="font-heading text-sm font-semibold text-foreground">
                    {country.country}
                  </span>
                  <span className="ml-2 text-[10px] text-muted-foreground">
                    {country.code}
                  </span>
                  {hasReport && (
                    <span className="ml-2 text-[10px] text-primary font-medium">
                      View Report →
                    </span>
                  )}
                </div>
                <span
                  className={`text-right font-heading text-lg font-bold ${getScoreColor(country.overall)}`}
                >
                  {country.overall}
                </span>
              </div>

              {/* Layer breakdown */}
              <div className="mt-2 grid grid-cols-8 gap-1">
                {layers.map((layer) => (
                  <div key={layer.number} className="space-y-0.5">
                    <ScoreBar
                      score={country.layers[layer.number]}
                      layerNum={layer.number}
                    />
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[8px] font-medium"
                        style={{ color: `hsl(${layerColorVar(layer.number)})` }}
                      >
                        L{layer.number}
                      </span>
                      <span className="text-[8px] text-muted-foreground">
                        {country.layers[layer.number]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weights legend */}
      <div className="rounded-lg border border-border bg-secondary/30 p-3">
        <span className="font-heading text-[10px] uppercase tracking-wider text-muted-foreground">
          Layer Weights
        </span>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {layers.map((layer) => (
            <div key={layer.number} className="flex items-center gap-1.5">
              <div
                className="h-2 w-2 rounded-sm"
                style={{ backgroundColor: `hsl(${layerColorVar(layer.number)})` }}
              />
              <span className="text-[10px] text-muted-foreground">
                {layer.weight}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryRanking;
