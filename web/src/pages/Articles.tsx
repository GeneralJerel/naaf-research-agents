import { useState, useMemo } from "react";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import { articles, type ArticleCategory } from "../../mock-data/articles";

const categories: ArticleCategory[] = [
  "Analysis",
  "Methodology",
];

const Articles = () => {
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | "All">("All");

  const featured = useMemo(
    () => articles.filter((a) => a.featured),
    []
  );

  const filtered = useMemo(() => {
    const pool = activeCategory === "All"
      ? articles
      : articles.filter((a) => a.category === activeCategory);
    return pool.filter((a) => !a.featured || activeCategory !== "All");
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header />

        <div className="mb-10">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-primary">
            Research & Analysis
          </p>
          <h1 className="font-heading text-[32px] font-bold leading-tight tracking-tight text-foreground mb-3 lg:text-[38px]">
            Articles
          </h1>
          <p className="max-w-2xl text-sm leading-[1.7] text-muted-foreground">
            In-depth analysis, country profiles, and policy briefs from the NAAF 
            research team — exploring AI sovereignty across all eight layers of the 
            framework.
          </p>
        </div>

        {activeCategory === "All" && featured.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Featured
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
              {featured.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="featured"
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-6 flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveCategory("All")}
              className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                activeCategory === "All"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="rounded-lg border border-dashed border-border py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No articles in this category yet.
              </p>
            </div>
          )}
        </section>

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

export default Articles;
