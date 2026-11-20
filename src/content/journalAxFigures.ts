// The figures of the Field Note "One text, three readers" (slug one-text-three-readers). Asset-free: the page components
// (src/components/journal/AxFigures.tsx, AxPeakPanes.tsx), the Markdown mirror, the MCP tool and the tests read this file.
// Each figure has a text version here (axFigureMarkdown): that is what the mirror, the MCP answers and the prerender
// without JavaScript carry. Reference: board O of the canvas "Portfolio · Main courante".

import { MCP_TRACKING_SINCE } from "./agents";

export type AxFigureId = "bricks" | "readers" | "fanout" | "sizes" | "counter";

/** The value shown in the counter figure. Ivan fills it at publication. While it is null the figure shows a dash. No live read of the database. */
export const AX_NOTE_MCP_CALLS: number | null = 2;

/** "20 Nov 2026" from the one tracking date of the site (agents.ts), so the figure and the guarantees say the same day. */
const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const axShortDate = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${SHORT_MONTHS[m - 1]} ${y}`;
};
export const AX_COUNTER = {
  label: MCP_TRACKING_SINCE ? `MCP calls since ${axShortDate(MCP_TRACKING_SINCE)}` : "MCP calls",
  /** The dash the figure shows while the count is null (code 8212, written as a code so no source file carries the character). */
  empty: String.fromCharCode(8212),
};

// ---------------------------------------------------------------------------------------------------------------
// Peak moment: two panes. The status words are the real ones; the markup around them is illustrative.

export type AxPeakPanes = {
  person: { label: string; via: string; card: string; badge: string };
  machine: { label: string; via: string; code: string[]; highlight: string };
  caption: string;
};

export const AX_PEAK_PANES: AxPeakPanes = {
  person: { label: "What a person saw", via: "In the browser", card: "Aetherix", badge: "Pre-pilot" },
  machine: {
    label: "What a machine got",
    via: "In curl, the prerendered snapshot",
    code: ['<article class="project-card">', "  <h3>Aetherix</h3>", '  <span class="status">Pilot-ready</span>', "</article>"],
    highlight: "Pilot-ready",
  },
  caption: "Reconstruction: the status words are the real ones; the surrounding markup is illustrative.",
};

// ---------------------------------------------------------------------------------------------------------------
// From one text file to a protocol: the bricks, to scale, from 5 May to 20 Nov 2026.

export const AX_BRICKS_RANGE = { from: "2026-05-05", to: "2026-11-20" } as const;

export type AxBrick = { date: string; short: string; text: string };

export const AX_BRICKS: AxBrick[] = [
  { date: "2026-05-05", short: "5 May", text: "`llms.txt`, `llms-full.txt` and a `robots.txt` open to AI crawlers" },
  { date: "2026-07-21", short: "21 Jul", text: "The public MCP server and Rose's first dock" },
  { date: "2026-09-14", short: "14 Sep", text: "The Markdown mirrors" },
  { date: "2026-10-14", short: "14 Oct", text: "/agents" },
  { date: "2026-11-17", short: "17 Nov", text: "The static stubs" },
  { date: "2026-11-19", short: "19 Nov", text: "Reading by section" },
  { date: "2026-11-20", short: "20 Nov", text: "Rose's signed history" },
];

export const AX_BRICKS_CAPTION = "Source: the site's commit history.";

const DAY_MS = 86_400_000;
const dayNumber = (iso: string) => Math.round(Date.parse(`${iso}T00:00:00Z`) / DAY_MS);

/** Position of a date on the scale, 0 to 1, from the first brick to the last day. */
export const axBrickPosition = (iso: string): number => {
  const a = dayNumber(AX_BRICKS_RANGE.from);
  const b = dayNumber(AX_BRICKS_RANGE.to);
  return (dayNumber(iso) - a) / (b - a);
};

/** The first of each month inside the range, with its position: the grid of the scale. */
export const axMonthTicks = (): { label: string; at: number }[] => {
  const out: { label: string; at: number }[] = [];
  for (let m = 6; m <= 11; m++) out.push({ label: SHORT_MONTHS[m - 1], at: axBrickPosition(`2026-${String(m).padStart(2, "0")}-01`) });
  return out;
};

// ---------------------------------------------------------------------------------------------------------------
// Section 1: the three readers. Cards on the page, the table in the Markdown mirror.

export const AX_READERS_HEAD = ["Reader", "What it reads", "What it needs", "How it fails"];
export const AX_READERS_ROWS: string[][] = [
  ["The visitor", "The rendered page, in a browser", "Layout, tone, a reason to keep reading", "Gets bored, leaves"],
  ["Rose", "The site's own Markdown, nothing else", "The same facts, in plain text, with their status", "Says something the site does not say"],
  ["An outside agent", "Whatever the server returns: HTML, Markdown, llms.txt, the MCP server", "Clean text, small enough to fit its context", "Repeats a wrong page with full confidence"],
];

// ---------------------------------------------------------------------------------------------------------------
// Section 3: one source, five surfaces, and the two checks.

export const AX_FANOUT = {
  source: { label: "One source", files: "`src/content` · `statuses.ts`" },
  surfaces: ["The page", "The .md mirror", "llms.txt and llms-full.txt", "The MCP server", "Rose"],
  journeys: { name: "check:journeys", does: "follows every link and anchor, including those in llms.txt" },
  freshness: { name: "mcpBundleFreshness", does: "fails when the MCP bundle is older than the content it serves", on: "The MCP server" },
};

// ---------------------------------------------------------------------------------------------------------------
// Section 5: sizes in KB, measured on 20 Nov 2026, on one scale.

export type AxSize = { label: string; kb: number; shown: string; group: "whole" | "part" };

export const AX_SIZES_DATE = "20 Nov 2026";
export const AX_SIZES: AxSize[] = [
  { label: "llms-full.txt", kb: 192.2, shown: "192.2", group: "whole" },
  { label: "/rose, as HTML", kb: 118.6, shown: "118.6", group: "whole" },
  { label: "rose.md", kb: 19.6, shown: "19.6", group: "part" },
  { label: "aetherix.md", kb: 13.1, shown: "13.1", group: "part" },
  { label: "llms.txt", kb: 10.1, shown: "10.1", group: "part" },
  { label: "One section of aetherix.md", kb: 2.5, shown: "≈ 2.5", group: "part" },
  { label: "The outline of aetherix.md", kb: 1, shown: "< 1", group: "part" },
];
export const AX_SIZES_CAPTION = "Sizes as downloaded with curl; the outline and the section through the MCP server.";

// ---------------------------------------------------------------------------------------------------------------
// Text versions: the Markdown mirror, the MCP answers and the reading time read these.

const table = (head: string[], rows: string[][]) =>
  [`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");

export const axCounterText = (): string =>
  `${AX_COUNTER.label}: ${AX_NOTE_MCP_CALLS === null ? "not filled in yet" : AX_NOTE_MCP_CALLS.toLocaleString("en-US")}`;

export const axFigureMarkdown = (id: AxFigureId): string => {
  switch (id) {
    case "bricks":
      return [AX_BRICKS.map((b) => `${b.short}: ${b.text}`).join("\n"), AX_BRICKS_CAPTION].join("\n\n");
    case "readers":
      return table(AX_READERS_HEAD, AX_READERS_ROWS);
    case "fanout":
      return [
        `${AX_FANOUT.source.label}: ${AX_FANOUT.source.files}. Five surfaces: ${AX_FANOUT.surfaces.join("; ")}.`,
        `Two checks guard the gap. \`${AX_FANOUT.journeys.name}\` ${AX_FANOUT.journeys.does}. \`${AX_FANOUT.freshness.name}\` ${AX_FANOUT.freshness.does}, on the branch to ${AX_FANOUT.freshness.on}.`,
      ].join("\n\n");
    case "sizes":
      return [
        table(["Document", "Size in KB"], AX_SIZES.map((s) => [s.label, s.shown])),
        `Measured on ${AX_SIZES_DATE}. ${AX_SIZES_CAPTION}`,
      ].join("\n\n");
    case "counter":
      return axCounterText();
  }
};
