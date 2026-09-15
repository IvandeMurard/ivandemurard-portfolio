// Prebuild: emits public/agent-boundaries-aetherix.md from the same content
// source the page renders, using the same renderer the MCP server uses.
// Run with bun (tsconfig path aliases).

import { writeFileSync } from "fs";
import { resolve } from "path";
import { JOURNAL_ENTRIES } from "@/content/journal";
import { renderBlock } from "@/lib/mcp/tools/get-journal-entry";

const SLUG = "agent-boundaries-aetherix";
const entry = JOURNAL_ENTRIES.find((e) => e.slug === SLUG);
if (!entry) {
  console.warn(`[journal-mirror] ${SLUG} not found, skipping.`);
  process.exit(0);
}

const lines = [
  `# ${entry.title}`,
  "",
  entry.subtitle ?? "",
  "",
  `Published ${entry.date}. Source: https://ivandemurard.com/journal/${SLUG}`,
  "",
  ...entry.body.map(renderBlock),
  "",
];

const out = lines.join("\n\n").replace(/\n{3,}/g, "\n\n");
writeFileSync(resolve(`public/${SLUG}.md`), out);
console.log(`[journal-mirror] wrote public/${SLUG}.md, ${Buffer.byteLength(out)} bytes`);
