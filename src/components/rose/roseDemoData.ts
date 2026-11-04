/**
 * Copy and data of the three demos (docs/rose-case-study-copy-v2.md). Kept apart from the components so
 * RoseDemos.tsx exports only components. The reading and source lines come from the prototype source.
 */

/* ---------------------------------------------------------------- Hero: three built exchanges */

export type HeroExchange = { where: string; q: string; a: string; src: string; link?: { label: string; to: string }; chips?: string[] };

export const HERO_EXCHANGES: HeroExchange[] = [
  { where: "Reading: /rose · 03 · Know where you are", q: "Say it more simply.", a: "When you ask me something, I also receive the page you are on, so I answer about what you are reading.", src: "Source: chapter 03" },
  { where: "Reading: /aetherix", q: "Is Aetherix in production?", a: "No. It was built and evaluated on historical data, staged against a sandbox, and is ready for a 30-day pilot.", src: "Source: /aetherix, status", link: { label: "Aetherix, the case study", to: "/aetherix" } },
  { where: "Reading: /journeys", q: "What has Ivan built?", a: "Six projects, each with its status. Aetherix is ready for a 30-day pilot, Tacet is built and in maintenance, and Anima is a synthetic proof of concept.", src: "Source: case studies, /journeys", chips: ["What happens when it's wrong?", "Which ones are live?"] },
];

/* ---------------------------------------------------------------- Chapter 06: three formats in design */

export const DESIGN_CAPTION = "These formats are in design. Live Rose answers in text only.";

export type DesignExchange = { format: "Reformulate" | "Locate" | "Connect" | "Sketch"; mark: "Built" | "Design"; q: string; a: string };

export const DESIGN_EXCHANGES: DesignExchange[] = [
  { format: "Reformulate", mark: "Built", q: "Say it more simply.", a: "When you ask me something, I also receive the page you are on, so I answer about what you are reading rather than about Ivan in general." },
  { format: "Locate", mark: "Design", q: "Where did he decide this?", a: "Ivan made this call on 10 August, in chapter 03, Know where you are." },
  { format: "Connect", mark: "Design", q: "How does this relate to his other work?", a: "Two links, each with the reason Ivan wrote for it: the evaluation page, which shows how every change to me is tested, and the Field Note whose method that evaluation applies." },
  { format: "Sketch", mark: "Design", q: "Draw how it works.", a: "Page, then section in view, then marked passage, then answer." },
];

/** The evaluation record on GitHub, until the evaluation page exists. */
export const EVALUATION_URL = "https://github.com/IvandeMurard/ivandemurard-portfolio/blob/main/docs/rose-eval-2026-10-29.md";

/** Static for now: the relations decided on 3 Nov. The relations data comes in a later branch. */
export const CONNECT_LINKS = [
  { kind: "how she is tested", text: "The evaluation", href: EVALUATION_URL, external: true },
  { kind: "uses the method of", text: "Harnesses, graders and closed loops", href: "/journal/harnesses-graders-closed-loops", external: false },
] as const;

export const SKETCH_STEPS = ["Page", "Section in view", "Marked passage", "Answer"] as const;

/** The four passage questions, each with its marker. Examples, not controls. */
export const PASSAGE_QUESTIONS = [
  { format: "Locate", q: "Where did he decide this?", mark: "Design" },
  { format: "Reformulate", q: "Say it more simply", mark: "Built" },
  { format: "Connect", q: "How does this relate to his other work?", mark: "Design" },
  { format: "Sketch", q: "Draw how it works", mark: "Design" },
] as const;
