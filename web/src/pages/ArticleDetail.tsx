import { useParams, Link, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { articles, categoryColors } from "../../mock-data/articles";
import { layers } from "@/data/frameworkData";

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  const relatedArticles = articles
    .filter((a) => a.id !== article.id)
    .filter(
      (a) =>
        a.category === article.category ||
        a.layerReference === article.layerReference
    )
    .slice(0, 2);

  const referencedLayer = article.layerReference
    ? layers.find((l) => l.number === article.layerReference)
    : null;

  return (
    <div className="min-h-screen bg-background font-body">
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Header />

        <div className="mb-6">
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>
        </div>

        <article className="mx-auto max-w-3xl">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${categoryColors[article.category]}`}
              >
                {article.category}
              </span>
              {article.layerReference && (
                <Badge variant="outline" className="text-[11px] px-2 py-0">
                  Layer {article.layerReference}
                </Badge>
              )}
            </div>

            <h1 className="font-heading text-[28px] font-bold leading-tight tracking-tight text-foreground mb-3 sm:text-[36px]">
              {article.title}
            </h1>

            <p className="text-base leading-relaxed text-muted-foreground mb-6 max-w-2xl">
              {article.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">{article.author.name}</span>
                <span className="mx-1.5 text-border">·</span>
                <span>{article.author.role}</span>
              </div>
              <Separator orientation="vertical" className="h-3.5" />
              <span>{formatDate(article.publishedAt)}</span>
              <Separator orientation="vertical" className="h-3.5" />
              <span>{article.readingTime} min read</span>
            </div>
          </header>

          <Separator className="mb-8" />

          {referencedLayer && (
            <div className="mb-8 rounded-lg border border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded font-heading text-xs font-bold"
                  style={{
                    backgroundColor: `hsl(var(--layer-${referencedLayer.number}) / 0.12)`,
                    color: `hsl(var(--layer-${referencedLayer.number}))`,
                  }}
                >
                  {referencedLayer.number}
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Layer {referencedLayer.number}: {referencedLayer.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {referencedLayer.shortDesc} — Weight: {referencedLayer.weight}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {article.body.map((paragraph, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-sm leading-[1.85] text-foreground first-letter:text-3xl first-letter:font-heading first-letter:font-bold first-letter:leading-none first-letter:mr-0.5 first-letter:float-left"
                    : "text-sm leading-[1.85] text-muted-foreground"
                }
              >
                {paragraph}
              </p>
            ))}
          </div>

          <Separator className="my-8" />

          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] font-medium">
                {tag}
              </Badge>
            ))}
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="mx-auto mt-16 max-w-3xl">
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Related Articles
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        )}

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

export default ArticleDetail;
