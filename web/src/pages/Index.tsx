import FrameworkDescription from "@/components/FrameworkDescription";
import ContactForm from "@/components/ContactForm";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-body">
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation */}
        <header className="mb-12 flex items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
              <span className="font-heading text-sm font-bold text-primary-foreground">AI</span>
            </div>
            <div>
              <span className="font-heading text-base font-semibold tracking-tight text-foreground">
                National AI Assessment Framework
              </span>
              <p className="text-[11px] text-muted-foreground tracking-wide">
                Evidence-based policy intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground sm:flex">
              <span>8 Layers</span>
              <span>Public Data</span>
              <span>2023–2025</span>
            </nav>
            <Separator orientation="vertical" className="hidden h-5 sm:block" />
            <ContactForm />
          </div>
        </header>

        {/* Main content */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.7fr] lg:gap-16">
          <FrameworkDescription />

          <div className="space-y-12">
            {/* Executive Summary */}
            <section>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-primary">
                Executive Summary
              </p>
              <h2 className="font-heading text-[28px] font-bold leading-tight tracking-tight text-foreground mb-4">
                A Full-Stack View of National AI Capability
              </h2>
              <p className="text-sm leading-[1.75] text-muted-foreground max-w-2xl">
                The National AI Assessment Framework provides a rigorous, evidence-based 
                methodology for evaluating a country's position across the entire AI value 
                chain. Eight interdependent layers — from energy infrastructure to economic 
                implementation — are scored independently and weighted to produce a composite 
                sovereignty index, enabling direct cross-country comparison.
              </p>
            </section>

            <Separator />

            {/* Methodology */}
            <section>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-primary">
                Methodology
              </p>
              <h3 className="font-heading text-xl font-bold tracking-tight text-foreground mb-6">
                Research Protocol & Data Sources
              </h3>
              <div className="grid gap-6 sm:grid-cols-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Authoritative Sources
                  </h4>
                  <p className="text-xs leading-[1.7] text-muted-foreground">
                    All assessments draw exclusively from public data published by the IEA, 
                    World Bank, OECD, WIPO, TOP500, and the Oxford Insights Government AI 
                    Readiness Index.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Autonomous Analysis
                  </h4>
                  <p className="text-xs leading-[1.7] text-muted-foreground">
                    Research agents evaluate each layer independently, producing scored 
                    assessments on a 0–100 scale. Weighted aggregation yields a composite 
                    sovereignty index per country.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Temporal Scope
                  </h4>
                  <p className="text-xs leading-[1.7] text-muted-foreground">
                    Data coverage spans 2023–2025, prioritizing the most current publicly 
                    available indicators for each layer of the framework.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Applications */}
            <section>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-primary">
                Applications
              </p>
              <h3 className="font-heading text-xl font-bold tracking-tight text-foreground mb-6">
                Who This Serves
              </h3>
              <div className="grid gap-px overflow-hidden rounded-lg border border-border sm:grid-cols-2">
                <div className="bg-card p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Government & Policy
                  </h4>
                  <p className="text-xs leading-[1.7] text-muted-foreground">
                    Identify infrastructure gaps, benchmark against peer nations, and 
                    allocate resources to maximize strategic AI readiness.
                  </p>
                </div>
                <div className="bg-card p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Investment & Strategy
                  </h4>
                  <p className="text-xs leading-[1.7] text-muted-foreground">
                    Evaluate national AI ecosystems to inform market-entry decisions, 
                    venture allocation, and cross-border partnerships.
                  </p>
                </div>
                <div className="bg-card p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Research & Academia
                  </h4>
                  <p className="text-xs leading-[1.7] text-muted-foreground">
                    Access transparent, reproducible assessments for comparative AI 
                    policy research and longitudinal studies.
                  </p>
                </div>
                <div className="bg-card p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-1.5">
                    Enterprise
                  </h4>
                  <p className="text-xs leading-[1.7] text-muted-foreground">
                    Assess regional compute availability, talent density, and regulatory 
                    posture to guide expansion and procurement.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-border pt-5">
          <div className="flex flex-col items-center justify-between gap-2 text-[11px] text-muted-foreground sm:flex-row">
            <span>National AI Assessment Framework</span>
            <span>Data: IEA · World Bank · OECD · WIPO · TOP500 · Oxford Insights</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
