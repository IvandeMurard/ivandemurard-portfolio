import { Fragment, type ReactNode } from "react";
import { Term } from "@/components/Term";
import type { TermMark } from "@/content/journalTerms";
import { TransitionLink as Link } from "@/hooks/useViewTransition";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Marks the first occurrence of each pending phrase inside a string, then
 * removes it from the pending list so the rest of the article stays clean.
 */
export const createTermTaker = (marks: TermMark[]) => {
  const pending = [...marks];

  const render = (text: string, depth = 0): ReactNode => {
    if (!text || depth > 12) return text;
    const inline = /\[([^\]]+)\]\((https:\/\/[^\s)]+|\/[^\s)]*)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/.exec(text);
    if (inline) {
      const before = render(text.slice(0, inline.index), depth + 1);
      const cls = "text-primary underline decoration-secondary underline-offset-4 hover:text-secondary transition-colors";
      const content = inline[1]
        ? inline[2].startsWith("/")
          ? <Link to={inline[2]} className={cls}>{render(inline[1], depth + 1)}</Link>
          : <a href={inline[2]} target="_blank" rel="noopener noreferrer" className={cls}>{render(inline[1], depth + 1)}</a>
        : inline[3] ? <strong>{render(inline[3], depth + 1)}</strong>
        : inline[4] ? <em>{render(inline[4], depth + 1)}</em>
        : <code>{inline[5]}</code>;
      return <>{before}{content}{render(text.slice(inline.index + inline[0].length), depth + 1)}</>;
    }
    if (!pending.length) return text;

    let best: { index: number; length: number; mark: TermMark } | null = null;
    for (const mark of pending) {
      const re = new RegExp(`\\b${escapeRe(mark.phrase)}\\b`, "i");
      const m = re.exec(text);
      if (m && (best === null || m.index < best.index)) {
        best = { index: m.index, length: m[0].length, mark };
      }
    }
    if (!best) return text;

    pending.splice(pending.indexOf(best.mark), 1);
    const before = text.slice(0, best.index);
    const label = text.slice(best.index, best.index + best.length);
    const after = text.slice(best.index + best.length);

    return (
      <>
        {before}
        <Term id={best.mark.id}>{label}</Term>
        {render(after, depth + 1)}
      </>
    );
  };

  return (text: string) => <Fragment>{render(text)}</Fragment>;
};

export type TermTaker = ReturnType<typeof createTermTaker>;
