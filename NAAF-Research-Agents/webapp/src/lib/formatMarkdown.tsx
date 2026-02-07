import React from "react";

/**
 * Lightweight markdown-like formatter for report justification text.
 * Handles:
 * - **bold** -> <strong>
 * - Newlines -> paragraph breaks
 * - URLs -> clickable links
 * - Bullet-style lines (starting with - ) -> list items
 */

function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Match **bold**, URLs, or plain text
  const regex = /(\*\*(.+?)\*\*)|(https?:\/\/[^\s),]+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    // Push text before the match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold text
      nodes.push(
        <strong key={key++} className="font-semibold text-foreground">
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // URL
      const url = match[3];
      let hostname: string;
      try {
        hostname = new URL(url).hostname.replace("www.", "");
      } catch {
        hostname = url;
      }
      nodes.push(
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 decoration-primary/40 hover:decoration-primary transition-colors"
        >
          {hostname}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function FormattedMarkdown({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  // Split on double newlines for paragraphs
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Check if this paragraph contains bullet lines
        const lines = trimmed.split("\n");
        const isList = lines.every(
          (l) => l.trim().startsWith("- ") || l.trim() === ""
        );

        if (isList) {
          return (
            <ul key={pIdx} className="space-y-1 pl-4">
              {lines
                .filter((l) => l.trim().startsWith("- "))
                .map((line, lIdx) => (
                  <li
                    key={lIdx}
                    className="text-sm text-foreground/80 leading-relaxed list-disc"
                  >
                    {parseInline(line.trim().slice(2))}
                  </li>
                ))}
            </ul>
          );
        }

        return (
          <p
            key={pIdx}
            className="text-sm text-foreground/80 leading-relaxed"
          >
            {parseInline(trimmed.replace(/\n/g, " "))}
          </p>
        );
      })}
    </div>
  );
}
