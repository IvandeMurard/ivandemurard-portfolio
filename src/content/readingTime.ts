import type { JournalBlock } from "./journal";

/** First sentence of a text: what stays visible before "Read more". */
export const firstSentence = (t: string) => {
  const m = t.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : t;
};

/**
 * The words of a block. `open` counts what a reader sees with every fold open: the content of the folds, the collapsed
 * text of a table, the questions folded away. Without it, what a reader sees by default.
 */
const textOf = (b: JournalBlock, open: boolean): string[] => {
  switch (b.kind) {
    case "p": case "h2": case "h3": case "quote": case "code": return [b.text];
    case "list": return b.items;
    case "table": return [...b.head, ...b.rows.flatMap((r) => r.map((c, i) => (i === b.foldCol && !open ? firstSentence(c) : c)))];
    case "defs": return b.items.map((i) => `${i.term} ${i.def}`);
    case "lines": {
      const shown = open || !b.visible ? b.items : b.items.filter((i) => b.visible!.includes(i.q));
      return shown.flatMap((i) => [i.q, i.a]);
    }
    case "key": return [b.oneLine, b.concrete ?? ""];
    case "cards": return b.items.map((i) => `${i.title} ${i.body}`);
    case "recoLine": return [b.caption];
    case "peak": {
      // The boxes come after one answer: they are part of the peak a reader goes through, not a fold. One reveal line is read.
      const c = b.challenge;
      return [b.kicker, b.lead, c?.rule ?? "", c?.question ?? "", c ? [...c.reveal].sort((x, y) => y.length - x.length)[0] : "", ...b.boxes.flatMap((x) => [x.label, x.text, x.note ?? "", x.bubble ?? ""]), b.after ?? "", b.contract ?? ""];
    }
    case "fold": return open ? b.blocks.flatMap((x) => textOf(x, open)) : [];
    default: return [];
  }
};

const count = (body: JournalBlock[], open: boolean, wpm: number) => {
  const words = body.flatMap((b) => textOf(b, open)).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wpm));
};

/** Minutes of what a reader sees by default: folded passages, collapsed table text and folded questions are excluded. */
export const visibleMinutes = (body: JournalBlock[], wpm = 230) => count(body, false, wpm);

/** Minutes with every fold open. */
export const fullMinutes = (body: JournalBlock[], wpm = 230) => count(body, true, wpm);

/** The full count is worth saying when it is at least this many minutes longer than the default one. */
export const FULL_GAP_MINUTES = 5;

/**
 * The reading-time label, computed: "18 min", or "18 min · 36 with every detail open" when the full count is at least
 * five minutes longer. Never typed.
 */
export const readingLabel = (visible: number, full?: number): string =>
  full !== undefined && full - visible >= FULL_GAP_MINUTES ? `${visible} min · ${full} with every detail open` : `${visible} min`;
