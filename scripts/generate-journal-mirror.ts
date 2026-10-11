// Prebuild: emits public/<slug>.md for each Field Note from the same content
// source the page renders, using the same renderer the MCP server uses.
// Run with bun (tsconfig path aliases).

import { writeFileSync } from "fs";
import { resolve } from "path";
import { JOURNAL_ENTRIES } from "@/content/journal";
import { renderEntryMarkdown } from "@/lib/mcp/tools/get-journal-entry";

const SLUGS = [
  "agent-boundaries-aetherix",
  "harnesses-graders-closed-loops",
  "whose-truth-is-the-ground-truth",
];

for (const slug of SLUGS) {
  const entry = JOURNAL_ENTRIES.find((e) => e.slug === slug);
  if (!entry) {
    console.warn(`[journal-mirror] ${slug} not found, skipping.`);
    continue;
  }
  const out = renderEntryMarkdown(entry) + "\n";
  writeFileSync(resolve(`public/${slug}.md`), out);
  console.log(`[journal-mirror] wrote public/${slug}.md, ${Buffer.byteLength(out)} bytes`);
}
