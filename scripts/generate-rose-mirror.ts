// Prebuild: emits public/rose-design-lab.md, the Markdown mirror of the Rose case study, from the page's own
// content constants (see scripts/rose-mirror.ts). Run with bun (tsconfig path aliases).
// The "Last updated" date is the date of the last content change: it moves only when the file would differ.

import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { renderRoseMirror } from "./rose-mirror";
import { buildToday, stableDate, writeIfChanged } from "./content-date";

const FILE = resolve("public/rose-design-lab.md");
const existing = existsSync(FILE) ? readFileSync(FILE, "utf8") : null;
const date = stableDate({
  render: renderRoseMirror,
  existing,
  existingDate: existing?.match(/Last updated (\d{4}-\d{2}-\d{2})/)?.[1] ?? null,
  today: buildToday(),
});

const out = renderRoseMirror(date);
const changed = writeIfChanged(FILE, out);
console.log(`[rose-mirror] ${changed ? "wrote" : "unchanged:"} public/rose-design-lab.md, ${Buffer.byteLength(out)} bytes (${date})`);
