import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Article } from "../../mock-data/articles";
import { categoryColors } from "../../mock-data/articles";

interface ArticleCardProps {
  article: Article;
  variant?: "featured" | "default";
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const ArticleCard = ({ article, variant = "default" }: ArticleCardProps) => {
  const isFeatured = variant === "featured";

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group block"
    >
      <article
        className={
          isFeatured
            ? "rounded-lg border border-border bg-card p-6 transition-colors hover:border-primary/30 hover:bg-card/80 sm:p-8"
            : "rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/30 hover:bg-card/80"
        }
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[article.category]}`}
          >
            {article.category}
          </span>
          {article.layerReference && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              Layer {article.layerReference}
            </Badge>
          )}
        </div>

        <h3
          className={
            isFeatured
              ? "font-heading text-xl font-bold leading-tight tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors sm:text-2xl"
              : "font-heading text-base font-bold leading-tight tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors"
          }
        >
          {article.title}
        </h3>

        <p
          className={
            isFeatured
              ? "text-sm leading-relaxed text-muted-foreground mb-4 max-w-2xl"
              : "text-xs leading-relaxed text-muted-foreground mb-4 line-clamp-3"
          }
        >
          {article.excerpt}
        </p>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span>{formatDate(article.publishedAt)}</span>
          <span className="text-border">·</span>
          <span>{article.readingTime} min read</span>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
