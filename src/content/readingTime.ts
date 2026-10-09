import type { JournalBlock } from "./journal";

/** First sentence of a text: what stays visible before "Read more". */
export const firstSentence = (t: string) => {
  const m = t.match(/^.*?[.!?](?=\s|$)/);
  return m ? m[0] : t;
};

/** Words a reader sees by default: folded passages and collapsed table text are excluded. */
const visibleText = (b: JournalBlock): string[] => {
  switch (b.kind) {
    case "p": case "h2": case "h3": case "quote": case "code": return [b.text];
    case "list": return b.items;
    case "table": return [...b.head, ...b.rows.flatMap((r) => r.map((c, i) => (i === b.foldCol ? firstSentence(c) : c)))];
    case "defs": return b.items.map((i) => `${i.term} ${i.def}`);
    case "lines": return b.items.flatMap((i) => [i.q, i.a]);
    case "key": return [b.oneLine, b.concrete ?? ""];
    case "cards": return b.items.map((i) => `${i.title} ${i.body}`);
    case "recoLine": return [b.caption];
    default: return [];
  }
};

export const visibleMinutes = (body: JournalBlock[], wpm = 230) => {
  const words = body.flatMap(visibleText).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wpm));
};
