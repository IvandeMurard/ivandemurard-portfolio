import { HARNESSES_ENTRY } from "./journalHarnesses";
import type { MatrixRow } from "@/components/journal/CoverageMatrix";


export type JournalCategory = "Product" | "Operations" | "Agentic AI" | "Field" | "Evaluation";

export type PyramidLayer = {
  level: string;
  name: string;
  note?: string;
  base?: boolean;
  /** Shown when the layer is selected in the interactive figure. */
  detail?: string;
  product?: string;
  signal?: string;
};

export type JournalBlock =
  | { kind: "p" | "h2" | "h3" | "quote"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "code"; lang?: string; text: string }
  | { kind: "table"; head: string[]; rows: string[][]; caption?: string }
  | { kind: "defs"; items: { term: string; def: string }[] }
  | { kind: "pyramid"; layers: PyramidLayer[] }
  | { kind: "deployed"; items: { project: "Aetherix" | "Lore"; to: string; text: string }[] }
  | { kind: "lines"; items: { q: string; a: string }[] }
  | { kind: "arms"; label?: string; link?: { to: string; text: string } }
  | { kind: "vocab"; label?: string; items: { id: string; label: string; type?: string }[] }
  | {
      kind: "key";
      sigil: string;
      icon: string;
      minutes?: number;
      oneLine: string;
      concrete?: string;
    }
  | {
      kind: "anchors";
      label?: string;
      items: { project: string; to: string; what: string; who: string; feedback: string }[];
    }
  | {
      kind: "timeline";
      label?: string;
      steps: { value: string; label: string; note?: string; accent?: boolean }[];
    }
  | { kind: "cards"; label?: string; items: { icon: string; title: string; body: string }[] }
  | { kind: "askRose"; label?: string; note?: string; prompts: string[] };

export type JournalEntry = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // ISO yyyy-mm-dd
  lang?: "en" | "fr";
  category: JournalCategory;
  excerpt: string;
  readingMinutes?: number;
  /** Public path to the plain markdown mirror, offered as a download. */
  mirror?: string;
  license?: { label: string; url: string; note?: string };
  related?: { label: string; to: string }[];
  body: JournalBlock[];
};


export type ReadingItem = {
  source: "Substack" | "Podcast" | "Article" | "Paper" | "Talk";
  title: string;
  author: string;
  url: string;
  take: string; // one-line point of view
  date: string;
};

// TODO: replace with real entries
export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: "agent-boundaries-aetherix",
    title: "A hard call on Aetherix's agent boundaries",
    date: "2026-04-20",
    category: "Agentic AI",
    excerpt:
      "Where to draw the line between a forecasting model and an acting agent, and why splitting Prophet from Claude was the decision that shaped the rest of the architecture.",
    body: [
      {
        kind: "p",
        text: "When you build an operations layer for boutique hotels, the temptation is to let one large model do everything: predict, decide, act. It looks elegant on a slide.",
      },
      {
        kind: "p",
        text: "In practice, it collapses. Forecasting and acting have different failure modes, different feedback loops, different audit requirements. So we split them. Prophet handles the read of the environment (occupancy, F&B demand, staffing pressure). Claude orchestrates the response, with the human always one click away from the loop.",
      },
      {
        kind: "p",
        text: "This is not a technical decision dressed up as a product one. It is a product decision that happens to need a specific architecture. The boundary is the experience.",
      },
    ],
  },
  HARNESSES_ENTRY,
];


// TODO: replace with real reading list
export const READING_LIST: ReadingItem[] = [];
