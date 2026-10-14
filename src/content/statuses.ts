// Single source of project statuses. Imported by src/content/site.ts (pages)
// and by the MCP tools (src/lib/mcp), so humans and agents read the same words.
// Kept free of asset imports so the MCP bundle can include it.

export type Signal = "go" | "warn" | "stop" | "dark";
export type ProjectStatus = { signal: Signal; word: string; note: string };

export const STATUSES = {
  sonor: { signal: "dark", word: "Stopped", note: "Urban noise SaaS on open data, 0→1 to MVP. No contract signed, stopped in 2022." },
  aetherix: { signal: "warn", word: "Sandbox", note: "F&B agent for boutique hotels. Built, running on sandbox and public data, no hotel connected yet." },
  tacet: { signal: "warn", word: "Maintenance", note: "Headless environmental twin with an MCP server. Built; in maintenance mode since July 2026." },
  lore: { signal: "go", word: "Evaluated", note: "Voice mentor for aviation maintenance. 64-case harness, pure-function graders, hard safety tier." },
  anima: { signal: "stop", word: "Gated", note: "Guest memory node. Synthetic PoC, production gated behind a data-protection assessment." },
  compass: { signal: "warn", word: "Partial", note: "Address-level context for Paris premises. 85,418 units traced to source, earlier census records withheld until licensed." },
} as const satisfies Record<string, ProjectStatus>;

export type StatusSlug = keyof typeof STATUSES;

/** The status line prepended to every case study returned by MCP. */
export const statusLine = (slug: StatusSlug) => `Status: ${STATUSES[slug].word} · ${STATUSES[slug].note}`;

/** Compass sources line, quoted verbatim wherever the 85,418 figure appears. */
export const COMPASS_SOURCES_LINE =
  "APUR BDCom 2023 shopfront census · BODACC legal notices · INSEE Sirene · 85,418 units · every figure with its source, licence and date";
