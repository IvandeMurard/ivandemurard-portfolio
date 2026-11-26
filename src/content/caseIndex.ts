// Copy of the /case-studies index. Source: docs/case-index-prototype/case-index-day.html and case-index-night.html
// (board H, copy validated by Ivan on 17 Nov 2026). The words are the reference's, unchanged.
// Not here, on purpose: each project's name and case link (src/content/site.ts) and its status word and lamp
// (src/content/statuses.ts). The page reads those, so a status is never written twice.
import type { Signal } from "./statuses";
import { PROJECTS } from "./site";
import { STATUSES } from "./statuses";

export const CASE_INDEX = {
  title: "Case studies",
  kicker: "The project index",
  line: "Each project states what runs today, what was tested and what is not proven yet.",
  startWith: "Start with",
  readCase: "Read the case",
  shows: "What it shows:",
} as const;

/** The lamp legend. Each project's signal (statuses.ts) picks one of these four. */
export const LEGEND: { signal: Signal; label: string }[] = [
  { signal: "go", label: "Running or evaluated" },
  { signal: "warn", label: "Partial, paused or pre-pilot" },
  { signal: "stop", label: "Blocked by a gate" },
  { signal: "dark", label: "Stopped" },
];

export const START_WITH: { id: string; need: string; to: string }[] = [
  { id: "aetherix", need: "Product strategy", to: "Aetherix" },
  { id: "rose", need: "Evaluating an AI agent", to: "Rose, Lore" },
  { id: "sonor", need: "0 to 1 with a team", to: "Sonor" },
];

export type CardTint = "aetherix" | "tacet" | "anima" | "rose" | "lore";

export type IndexCard = {
  /** Anchor on this page, and the key of the project in site.ts / statuses.ts. */
  id: "aetherix" | "tacet" | "anima" | "rose" | "lore" | "compass" | "sonor";
  project: keyof typeof PROJECTS;
  status: keyof typeof STATUSES;
  kicker: string;
  line: string;
  shows: string;
  /** A blurred tint, or the project's photo under a dark veil. */
  tint?: CardTint;
  photo?: boolean;
};

export const GROUP_ARCH = {
  kicker: "Group 1",
  heading: "The Hospitality Multi-Agent Architecture",
  line: "Five agents, each owning one job, talking only through MCP. Three have a page; Peritia is design and the orchestrator a synthetic PoC.",
  link: "Read the architecture note",
  linkTo: "/architecture",
  cards: [
    {
      id: "aetherix", project: "atherix", status: "aetherix", tint: "aetherix",
      kicker: "F&B agent",
      line: "The F&B agent for boutique hotels: one recommendation a day in WhatsApp, the manager's reply, the outcome recorded next to it.",
      shows: "product strategy, a loop measured against outcomes, evaluation gates.",
    },
    {
      id: "tacet", project: "tacet", status: "tacet", tint: "tacet",
      kicker: "Environment agent",
      line: "Predicts how noise, weather and events around a hotel affect guests and revenue, and sends alerts to the RMS and PMS.",
      shows: "an agent exposed over MCP, then paused and labelled as such.",
    },
    {
      id: "anima", project: "anima", status: "anima", tint: "anima",
      kicker: "Guest memory",
      line: "What a hotel knows about its guests sits in one person's head or in scattered tools, so needs are met late. Anima helps teams anticipate them and adapt the stay, from what guests chose to share, with less strain on operations.",
      shows: "privacy by design: consent, decay, and a data-protection gate before launch.",
    },
  ] satisfies IndexCard[],
  /** Design only, no page. Their status is written here as in the reference: statuses.ts has no entry for them. */
  noPage: {
    kicker: "No page yet",
    items: [
      { name: "Orchestrator", role: "coordination and business rules", status: "Synthetic PoC, in shadow" },
      { name: "Peritia", role: "house knowledge", status: "Design" },
    ],
    note: "Both are described in the architecture note.",
  },
};

export const GROUP_SOLO = {
  kicker: "Group 2",
  heading: "Standalone projects",
  line: "Outside the architecture: the assistant of this site, the same thesis in aviation maintenance, a data product, and the company that came before all of it.",
  cards: [
    {
      id: "rose", project: "rose", status: "rose", tint: "rose",
      kicker: "The assistant of this site",
      line: "Rose answers questions about the page you are reading, from the site's own text.",
      shows: "an AI assistant shipped, evaluated and changed in public.",
    },
    {
      id: "lore", project: "lore", status: "lore", tint: "lore",
      kicker: "Aviation maintenance",
      line: "Captures the tacit knowledge a retiring technician never wrote down and returns it to a junior on the shop floor by voice, always behind the procedure.",
      shows: "a safety-first evaluation harness: 64 cases, pure-function graders.",
    },
    {
      id: "compass", project: "compass", status: "compass", photo: true,
      kicker: "Data product, Paris",
      line: "Every address has a story. Compass helps entrepreneurs choose premises that fit their project, with the context listings leave out.",
      shows: "a data product where every figure carries its source, licence and date.",
    },
    {
      id: "sonor", project: "sonor", status: "sonor", photo: true,
      kicker: "B2G SaaS, co-founded",
      line: "A two-year B2G SaaS I co-founded with three partners, to help cities reduce noise pollution with open data.",
      shows: "0 to 1 with four co-founders, and knowing when to stop.",
    },
  ] satisfies IndexCard[],
};
