import type { ReactNode } from "react";

/**
 * Minimal inline Markdown renderer for Rose's assistant messages.
 * Supports **bold**, *italic*, `code` and [label](https://…) links.
 * Deliberately tiny: no HTML, no images, no headings, http(s) links only,
 * so model output can never inject markup. Unknown syntax renders as text.
 */

const TOKEN =
  /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`|\[[^\]\n]+\]\((?:https?:\/\/[^\s)]+)\))/g;

export const renderRoseMarkdown = (text: string): ReactNode => {
  const parts = text.split(TOKEN);
  const out: ReactNode[] = [];
  let key = 0;

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      out.push(<strong key={key++} className="font-semibold">{part.slice(2, -2)}</strong>);
    } else if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      out.push(<em key={key++}>{part.slice(1, -1)}</em>);
    } else if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      out.push(
        <code key={key++} className="rounded bg-surface-variant px-1 py-0.5 font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>,
      );
    } else {
      const link = /^\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)$/.exec(part);
      if (link) {
        out.push(
          <a
            key={key++}
            href={link[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            {link[1]}
          </a>,
        );
      } else {
        out.push(part);
      }
    }
  }
  return out;
};
