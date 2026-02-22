import FrameworkDescription from "@/components/FrameworkDescription";
import ContactForm from "@/components/ContactForm";
import { Card } from "@/components/ui/card";

const Index = () => {
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
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>8 Layers</span>
            <span className="text-border">·</span>
            <span>Public Data</span>
            <span className="text-border">·</span>
            <span>2023–2025</span>
          </div>
        </header>

        {/* Main content */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
          <FrameworkDescription />
          
          <div className="space-y-8">
            {/* About Section */}
            <section className="space-y-4">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Understanding AI Sovereignty
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                The National AI Assessment Framework (NAAF) provides a comprehensive methodology 
                for evaluating a country's position in the global AI landscape. By analyzing eight 
                critical layers—from physical infrastructure to economic implementation—we help 
                policymakers, researchers, and organizations understand the complete AI value chain.
              </p>
            </section>

            {/* Methodology */}
            <section className="space-y-4">
              <h3 className="font-heading text-xl font-bold text-foreground">
                Research Methodology
              </h3>
              <Card className="p-5 bg-secondary/30">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-heading text-sm font-semibold text-foreground mb-2">
                      Data Sources
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      We exclusively use public data from authoritative sources including the 
                      International Energy Agency (IEA), World Bank, OECD, WIPO, TOP500 supercomputer 
                      rankings, and Oxford Insights Government AI Readiness Index.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-semibold text-foreground mb-2">
                      AI-Powered Research
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Our autonomous research agents analyze each layer independently, gathering 
                      evidence-based insights and scoring countries on a 0-100 scale. The weighted 
                      aggregate produces a comprehensive AI sovereignty score.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-semibold text-foreground mb-2">
                      Temporal Coverage
                    </h4>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      All assessments focus on data from 2023-2025, ensuring current and relevant 
                      insights for policy planning and strategic decision-making.
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Use Cases */}
            <section className="space-y-4">
              <h3 className="font-heading text-xl font-bold text-foreground">
                Use Cases
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-heading text-sm font-semibold text-foreground mb-2">
                    Policy Planning
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Identify gaps in national AI infrastructure and prioritize investment areas 
                    for maximum strategic impact.
                  </p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-heading text-sm font-semibold text-foreground mb-2">
                    Strategic Analysis
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Compare countries' AI capabilities across the full technology stack to 
                    inform partnerships and investments.
                  </p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-heading text-sm font-semibold text-foreground mb-2">
                    Research & Academia
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Access comprehensive, evidence-based assessments for AI policy research and 
                    comparative studies.
                  </p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-heading text-sm font-semibold text-foreground mb-2">
                    Enterprise Planning
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Evaluate regional AI ecosystems for expansion decisions, talent acquisition, 
                    and market entry strategies.
                  </p>
                </Card>
              </div>
            </section>

            {/* Contact */}
            <ContactForm />
          </div>
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
