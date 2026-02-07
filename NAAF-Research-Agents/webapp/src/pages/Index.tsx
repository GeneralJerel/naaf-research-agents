import { useNavigate } from "react-router-dom";
import FrameworkDescription from "@/components/FrameworkDescription";
import CountryRanking from "@/components/CountryRanking";
import CreateReportDialog from "@/components/CreateReportDialog";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top bar */}
        <header className="mb-10 flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <span className="font-heading text-sm font-bold text-primary-foreground">AI</span>
            </div>
            <div>
              <span className="font-heading text-base font-semibold text-foreground">
                National AI Assessment Framework
              </span>
              <p className="text-xs text-muted-foreground">Evidence-based policy intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
              <span>8 Layers</span>
              <span className="text-border">·</span>
              <span>Public Data</span>
              <span className="text-border">·</span>
              <span>2023–2025</span>
            </div>
            <button
              onClick={() => navigate("/framework")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              About NAAF
            </button>
            <CreateReportDialog />
          </div>
        </header>

        {/* Two column layout */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <FrameworkDescription />
          <CountryRanking />
        </div>

        {/* Footer */}
        <footer className="mt-14 border-t border-border pt-5 text-center text-[11px] text-muted-foreground">
          National AI Assessment Framework — Data sourced from IEA, World Bank, OECD, WIPO, TOP500, Oxford Insights
        </footer>
      </div>
    </div>
  );
};

export default Index;
