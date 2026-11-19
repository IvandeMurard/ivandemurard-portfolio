// Chapters 05 and 06, the architecture figure and the Next card. Same source as aetherixCase.ts: the v2 reference
// HTML in docs/aetherix-prototype/ (validated by Ivan on 16 Nov 2026). Asset-free on purpose.
// The page (src/pages/Atherix.tsx) renders these constants; src/test/aetherixMirror.test.ts checks that
// public/aetherix.md carries the same words, and src/test/aetherixInside.test.tsx checks the five steps against steps.json.

export const LEDGER = {
  intro: "Every recommendation Aetherix sends becomes one row: the context, what it recommended, what the manager said, what happened. That ledger is built, with no real user yet.",
  bet: "The bet is to make it a layer: every agent of the architecture writes its rows there, and agents built by others read it through MCP.",
  tableLabel: "The ledger, one row per decision",
  tableAria: "Decision Ledger rows",
  columns: ["Agent", "Recommended", "Human said", "What happened", "Gap"],
  built: ["Aetherix · built", "101", "79", "95", "6% vs 17%"],
  design: [
    ["Tacet, Anima, Peritia", "Same row, written by every agent of the architecture · designed"],
    ["Agents built by others", "Read and written through MCP · designed"],
  ],
  caption: "First row: built, shown on the sandbox run at the top of the page. The other rows are design.",
  whyLabel: "Why it matters",
  why: "Agents on marketplaces such as Apaleo's Agent Hub recommend. The ledger is the part that records what happened next, for Aetherix's own agents and for others'.",
  whyNote: "Built in Aetherix on 1 August 2026, no real user yet. The shared layer is design.",
  sharedLabel: "The shared layer: design, nothing built yet",
  shared: [
    "The ledger has no real user yet, and Aetherix no pilot hotel.",
    "Other agents would need consent, a shared format and access to outcomes.",
    "The platform could build the same layer.",
  ],
};

export const METHOD = [
  ["Spec before code, with the BMAD method.", "Requirements, architecture, epics, then one written story per change. Code comes last."],
  ["I direct the agents; I own the result.", "AI agents build from those stories, inside 34 decisions I set. I review and decide what ships."],
  ["Nothing merges without passing its tests.", "A fixed set of scenarios checks every change; a drop in quality blocks it."],
  ["A weekly self-audit.", "An agent checks that what the project claims still matches what it does."],
] as const;

/** One step of "Inside the agent". Same words as docs/aetherix-prototype/steps.json (a test compares them). */
export type InsideStep = {
  n: string;
  label: string;
  title: string;
  description: string;
  /** The first bubble, from whoever speaks to the agent. Only steps 01 and 05 have one. */
  from?: { who: string; text: string };
  /** The agent's own bubble. */
  says: string;
  badge: string;
};

export const INSIDE = {
  heading: "Inside the agent",
  anchor: "inside-the-agent",
  intro: "One pass a day, on Maison Lumen's first evening: the same figures as the demo at the top. Pick a step.",
  figureLabel: "Inside the agent: five steps, from the hotel's data to the recorded outcome",
  steps: [
    { n: "01", label: "Reads", title: "Reads the hotel", description: "Apaleo, read-only, plus weather and local events. Nothing is written back.", from: { who: "Apaleo", text: "Tomorrow: hotel 98% full. New Year's Day." }, says: "Read. Weather is poor, and there are no local events.", badge: "Read-only" },
    { n: "02", label: "Forecasts", title: "Forecasts the covers", description: "A statistical forecast that comes with its range.", says: "101 covers. 94 to 109 on 4 nights out of 5.", badge: "High confidence" },
    { n: "03", label: "Remembers", title: "Remembers this hotel", description: "Its own past days. Shared patterns across hotels stay research.", says: "A usual Thursday here: 87 covers.", badge: "This hotel only" },
    { n: "04", label: "Explains", title: "Explains in plain words", description: "The message carries its reasons, so the manager can disagree with one of them.", says: "Why 101: usual level 87; hotel 98% full +9, New Year's Day +8, season +7, weather −6.", badge: "Reasons attached" },
    { n: "05", label: "Records", title: "Records what happened", description: "The reply and the real outcome sit next to the recommendation. That record is the ledger.", from: { who: "Manager", text: "I'd say 79 covers instead." }, says: "Actual: 95. Forecast 101: 6% off, inside the range. Your estimate: 17% off.", badge: "Outcome recorded" },
  ] as InsideStep[],
  openByDefault: 4,
  around: "Around every step:",
  aroundText: "evaluation gates that block a change, one hotel's data never visible to another, data kept in the EU.",
  caption: "Maison Lumen, a fictional hotel in the Apaleo sandbox: synthetic data, real services, seed 42. The figures come from the run; the bubbles word them for display.",
};

export type ArchNode = {
  id: "orchestrator" | "aetherix" | "tacet" | "anima" | "peritia";
  name: string;
  role: string;
  /** The words of the status on the architecture page (src/content/systems.ts, statuses.ts) and in the meta-repo llms.txt. */
  status: string;
  line: "solid" | "dashed" | "dotted";
};

export const ARCH = {
  heading: "Where it sits",
  anchor: "where-it-sits",
  intro: ["Aetherix is one agent of the ", "Hospitality Multi-Agent Architecture", ". It executes F&B; it does not orchestrate. Every exchange goes through MCP."],
  figureLabel: "The Hospitality Multi-Agent Architecture: four agents around an orchestrator, inside the Decision Ledger",
  nodes: [
    { id: "orchestrator", name: "Orchestrator", role: "Routing and business rules", status: "Synthetic PoC · in shadow", line: "dashed" },
    { id: "aetherix", name: "Aetherix", role: "F&B execution", status: "Built · forecast in shadow mode", line: "solid" },
    { id: "tacet", name: "Tacet", role: "Sensory: weather, noise, open data", status: "Built · maintenance", line: "solid" },
    { id: "anima", name: "Anima", role: "Guest memory", status: "Synthetic PoC · DPIA-gated", line: "dashed" },
    { id: "peritia", name: "Peritia", role: "House knowledge", status: "Design · pattern tested in Lore", line: "dotted" },
  ] as ArchNode[],
  thisPage: "this page",
  ledgerName: "Decision Ledger",
  ledgerText: "built in Aetherix; shared across agents: Design",
  link: "Tacet → Aetherix: direct, while the orchestrator is not the way through",
  thirdParty: "Third-party agents read it, through MCP · designed",
  caption: "Every exchange goes through the orchestrator, over MCP. A solid line is Built, long dashes are Synthetic PoC, dots are Design.",
};

export const NEXT = {
  label: "Next",
  kicker: "Next · where Aetherix sits",
  title: "Hospitality Multi-Agent Architecture",
  text: "Five specialised agents, each owning one bounded context, talking only through MCP. The page says which is built and which is design.",
  agents: "Aetherix, Tacet, Anima, Peritia and the orchestrator",
  cta: "Read the architecture",
};
