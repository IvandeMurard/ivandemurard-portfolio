// The order in which a Field Note's sections are shown, when it differs from the order of its body. One definition,
// used by the page (JournalEntry), the contents list and the Markdown renderer, so all three read the same way.
// A move changes neither the heading ids nor the order of the body, which is the order of the generated section index.
// Asset-free: it runs under the generator scripts and the MCP renderer.

import { journalHeadingIds } from "./journalHeadingIds";

export type SectionMove = { section: string; after: string };

type Block = { kind: string; text?: string; id?: string };

/** The index of the block after the last block of the section that starts at `from` (up to the next h2). */
const sectionEnd = (body: ReadonlyArray<Block>, from: number): number => {
  for (let i = from + 1; i < body.length; i++) if (body[i].kind === "h2") return i;
  return body.length;
};

/** The indexes of the body, in display order. With no move it is the body's own order. */
export const displayOrder = (body: ReadonlyArray<Block>, moves: ReadonlyArray<SectionMove> = []): number[] => {
  let order = body.map((_, i) => i);
  if (!moves.length) return order;
  const ids = journalHeadingIds(body);
  const at = (id: string): number => {
    const i = ids.findIndex((x, k) => x === id && body[k].kind === "h2");
    if (i < 0) throw new Error(`journalOrder: no section "${id}"`);
    return i;
  };
  for (const m of moves) {
    const from = at(m.section);
    const to = sectionEnd(body, from);
    const moved = order.filter((i) => i >= from && i < to);
    const rest = order.filter((i) => i < from || i >= to);
    const last = sectionEnd(body, at(m.after)) - 1; // the last block of the section it follows
    const pos = rest.indexOf(last);
    if (pos < 0) throw new Error(`journalOrder: "${m.after}" cannot be followed by "${m.section}"`);
    order = [...rest.slice(0, pos + 1), ...moved, ...rest.slice(pos + 1)];
  }
  return order;
};
