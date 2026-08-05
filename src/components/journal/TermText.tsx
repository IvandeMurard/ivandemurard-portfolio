import { Fragment, type ReactNode } from "react";
import { Term } from "@/components/Term";
import type { TermMark } from "@/content/journalTerms";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Marks the first occurrence of each pending phrase inside a string, then
 * removes it from the pending list so the rest of the article stays clean.
 */
export const createTermTaker = (marks: TermMark[]) => {
  const pending = [...marks];

  const render = (text: string, depth = 0): ReactNode => {
    if (!text || !pending.length || depth > 12) return text;

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
