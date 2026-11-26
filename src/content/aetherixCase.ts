// Copy of the Aetherix case study, chapters 01 to 04 and the close. Source of truth for words, order and
// structure: docs/aetherix-prototype/aetherix-v2-day.html (validated by Ivan on 16 Nov 2026).
// The page (src/pages/Atherix.tsx) renders these constants; src/test/aetherixMirror.test.ts checks that
// public/aetherix.md carries the same words. Asset-free on purpose.
// Copy changed after validation on 16 Nov 2026: see docs/aetherix-prototype/README.md.
import { STATUSES } from "./statuses";

export type Mark = "Built" | "Validation" | "Design";

export type AetherixChapter = { id: string; toc: string; kicker: string; heading: string; marks?: Mark[]; markNote?: Partial<Record<Mark, string>> };

export const AETHERIX_CHAPTERS: AetherixChapter[] = [
  { id: "the-problem", toc: "01 The problem", kicker: "01 · The problem", heading: "Accurate records, floor instincts, and a daily blind spot" },
  { id: "how-it-works", toc: "02 How it works", kicker: "02 · How it works", heading: "One record a day", marks: ["Built"] },
  { id: "product-strategy", toc: "03 Product strategy", kicker: "03 · Product strategy", heading: "Understand a property the way its manager does", marks: ["Design"] },
  { id: "where-it-stands", toc: "04 What is proven", kicker: "04 · What is proven, what is not", heading: "The loop is built. The forecast is not yet proven on hotels.", marks: ["Validation"] },
  // Chapters 05 and 06: their copy is in aetherixInside.ts.
  { id: "decision-ledger", toc: "05 The Decision Ledger", kicker: "05 · The Decision Ledger", heading: "The outcomes layer the others do not have", marks: ["Built", "Design"], markNote: { Built: "Built in Aetherix", Design: "Design as a shared layer" } },
  { id: "how-its-built", toc: "06 How it's built", kicker: "06 · How it's built", heading: "Specified, reviewed and tested before anything ships", marks: ["Built"] },
];

export const HERO = {
  label: "Case study · Aetherix",
  headline: ["The F&B agent for ", "boutique hotels."],
  lead: "It works inside the tools the hotel already runs, its PMS and WhatsApp: one recommendation a day, the manager's reply, the outcome recorded next to it. Built to improve with every day it runs.",
  role: "AI Product Manager and Product Builder, solo · 2026",
  /** Never written here: the status line is the one in src/content/statuses.ts. */
  status: STATUSES.aetherix.note,
  primary: "How it decides",
};

export const TLDR = [
  ["The problem", "Hotel data sits in the PMS and POS, floor experience sits with the team, and tomorrow's covers are decided by bridging the two by hand."],
  ["The bet", "One recommendation a day in WhatsApp, checked against what happened the next morning."],
  ["Today", "The loop runs daily on Maison Lumen, a fictional hotel in the Apaleo sandbox. The product is being made ready for a first pilot; no hotel yet."],
  ["Still open", "The forecast is not yet proven on hotels. No pilot hotel has signed."],
] as const;

export const LEGEND = [
  ["Built", "Implemented behaviour that can be inspected in the product or repository."],
  ["Validation", "A bounded test, audit or measurement. It does not prove every outcome."],
  ["Design", "A proposed direction or a prototype."],
] as const;

export const PROBLEM = {
  subtitle: "Reconciling hotel data and floor experience before the evening shift",
  intro: "Boutique hotels run on two distinct sources of truth.",
  side1: "On one side, the software: the PMS logs reservations, arrivals and guest histories, while the POS tallies table receipts and beverage sales.",
  side2: "On the other side, the floor: the head waiter knows that rainy afternoons pack the bar, the chef sees prep times stretch on large tables, and the manager tracks nearby events that never show up in hotel software.",
  gap: "Neither side talks to the other. At 4 PM, someone has to bridge that gap on the fly, guessing tomorrow's covers before the prep shift begins.",
  costsLabel: "The operational toll",
  costs: [
    ["Food cost and margin leakage", "Fresh prep discarded after slow shifts, or mid-service 86s that force servers to apologize for missing specials. Margin is lost at both ends."],
    ["Guest and team friction", "Under-staffed teams take the brunt of sudden rushes: ticket times climb, service becomes transactional, and staff burn out. Over-staffed shifts leave extras idle and frustrated."],
    ["Missed covers and cognitive drag", "Doors closed early to walk-ins and room service capped out of caution. Meanwhile, the manager spends the last hour of their shift hunting through tabs instead of supporting the team during setup."],
  ],
  originLabel: "Where this comes from.",
  origin: "Informal conversations with product managers who built staffing and scheduling software for restaurants and hotels. No F&B manager has been interviewed yet; that is part of the pilot.",
};

export const HOW = {
  intro: "What was recommended, what the manager said, what happened. The message in the demo above is real sandbox output.",
  steps: [
    ["1 · Evening", "Tomorrow's covers and staffing, with the reasons."],
    ["2 · Reply", "The manager accepts, rejects, or gives the right figure."],
    ["3 · Next morning", "The real outcome is stored next to the recommendation."],
    ["4 · Adjust", "The agent recalibrates on the gap."],
  ],
  note: "Free-text replies are not used yet. Whether the agent gets sharper over time is what a pilot would test.",
};

export const STRATEGY = {
  intro: "And measure every recommendation against what happened. Five decisions follow from that.",
  decisions: [
    ["1", "Distribution before design", "A hotel floor has no time for a new tool. So the product plugs into the PMS and is built to be listed where hotels already pick their integrations."],
    ["2", "F&B first", "A covers forecast has a result the next morning. It can be checked."],
    ["3", "WhatsApp as the only surface", "It shows the recommendation, keeps a human line to the manager, and records the reply the agent learns from."],
    ["4", "Three parties: who uses, who pays, who distributes", "The F&B manager uses it. Hotel management pays. The PMS distributes."],
    ["5", "Pricing on results, to start", "With no track record, the builder carries the adoption risk. The later model is undecided."],
  ],
  underlined: "Distribution before design",
  who: [
    { role: "Distributes", name: "The PMS", text: "Apaleo shares read-only data and lists the integration." },
    { role: "Uses", name: "The F&B manager", text: "Gets the daily message. Sends the reply." },
    { role: "Pays", name: "Hotel management", text: "Signs the contract." },
  ],
  whoCaption: "Who uses, who pays, who distributes.",
  unprovenLabel: "Unproven",
  unproven: [
    "No hotel or PMS has validated this route yet.",
    "The platform could build the same thing.",
    "Pricing on labor cost needs payroll data the PMS does not hold.",
  ],
};

export const PROVEN = {
  workingLabel: "Already working",
  working: [
    "States its drivers the evening before, then reports its own miss the next morning.",
    "Rejected an implausible POS figure (850 covers, injected as a test) instead of learning from it.",
    "When recent data diverges sharply from history, says so and asks the manager to double-check.",
    ["After a simulated 25% jump in demand, weekly recalibration cut the forecast error from ", "15.9% to 12.3%", "."],
    "Stores every recommendation next to what happened, with the manager's override beside it.",
    "Daily recommendation, automatic path (Built). A demand anomaly becomes a stored recommendation and a WhatsApp message, no human step. Checked once on staging (19 Nov 2026), anomaly injected by hand on a fictional hotel; no live signals yet.",
  ] as Array<string | readonly [string, string, string]>,
  workingNote: "Sandbox data, real mechanics, deterministic reruns.",
  testLabel: "The forecast test",
  test: [
    "Public data, 30 restaurants. Against a naive same-weekday baseline (the mean of the last four same weekdays): mean error ",
    "49.71% vs 55.86%",
    ", ahead on average. For next-day forecasts, the horizon the product uses, ",
    "28.5% vs 27.9%",
    ", slightly behind.",
  ] as const,
  testLimit: "The test used restaurant data, without hotel occupancy, the signal the product relies on. The protocol was not pre-registered. Maison Lumen uses occupancy from Apaleo; how accurate the forecast is on a real hotel is what a pilot will measure.",
  phases: [
    ["●", "Phase 0–2", "Validation, observability and the Daily Receipt are done."],
    ["◐", "Phase 3 · now", "Pilot readiness. No hotel yet."],
    ["○", "Phase 4", "Scale: Mews, POS, Anima."],
    ["○", "Phase 5", "Revenue Orchestrator. Hive Memory stays research."],
  ] as const,
};

export const TECH_LABEL = "For the technical reader: stack, evaluation contract, observability, multi-tenant security";

export const CLOSE = {
  kicker: "07 · Talk",
  heading: "About a pilot, or a role",
  text: "Open to a first pilot hotel running Apaleo, and to AI Product Manager and Product Builder roles.",
};
