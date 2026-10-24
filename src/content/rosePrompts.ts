/**
 * Page-aware starters for Rose, written as visitor intents (imperative, never
 * "Ivan" in the third person). Every route ends with "Book a call".
 * The visible label is what the visitor sends; `message` adds page grounding.
 */

export type RosePrompt = {
  label: string;
  message: string;
  intent?: "product" | "technical" | "culture" | "exploring";
  ariaLabel?: string;
  /** Fixed chip that opens the booking flow. */
  booking?: boolean;
};

export const BOOK_CALL: RosePrompt = {
  label: "Book a call",
  message: "I would like to book a call.",
  booking: true,
};

const p = (label: string, message: string, intent: RosePrompt["intent"]): RosePrompt => ({ label, message, intent });

const HOME = [
  p("Show me what's shipped", "Show me what's shipped across these projects.", "technical"),
  p("What's real, what's sandbox?", "Across these projects, what's real and what's still sandbox?", "technical"),
];
const PROFILE = [
  p("Summarise the PM experience", "Summarise the product management experience in a few lines.", "product"),
  p("Is this a fit for my AI PM role?", "Is this profile a fit for my AI product manager role? Ask me what you need to know.", "product"),
];
const CASE = [
  p("How does it work?", "On this case study: how does it work?", "technical"),
  p("What's its status?", "On this case study: what's its status today, and what is not built yet?", "technical"),
];

const ROUTES: Array<{ match: string; prefix?: boolean; prompts: RosePrompt[] }> = [
  { match: "/", prompts: HOME },
  { match: "/aetherix", prompts: [
    p("What has actually been built?", "On Aetherix: what has actually been built, and what remains unvalidated?", "technical"),
    p("What happens when it's wrong?", "On Aetherix: what happens when it's wrong?", "technical"),
  ] },
  { match: "/architecture", prompts: [
    p("Explain the five agents simply", "Explain the five agents of this architecture simply.", "technical"),
    p("What's built, what's design?", "In this architecture, what's built and what's still design?", "technical"),
  ] },
  { match: "/cv", prompts: PROFILE },
  { match: "/atrium", prompts: PROFILE },
  { match: "/journal", prompts: [
    p("Which Field Note should I read?", "On Field Notes: which of the three notes should I read, given what I am working on?", "technical"),
    p("Show me how the notes connect to the projects.", "Show me how the three Field Notes connect to the projects on this site.", "technical"),
  ] },
  { match: "/journal/harnesses-graders-closed-loops", prompts: [
    p("What should block an agent release?", "On the evaluation note: what should block an agent release?", "technical"),
    p("How would I apply this to my own agent?", "On the evaluation note: how would I apply this to my own agent?", "technical"),
  ] },
  { match: "/journal/agent-boundaries-aetherix", prompts: [
    p("Where should human approval sit?", "On the boundaries note: where should human approval sit?", "technical"),
    p("How does this decision change hotel operations?", "On the boundaries note: how does this decision change hotel operations?", "technical"),
  ] },
  { match: "/journal/whose-truth-is-the-ground-truth", prompts: [
    p("Why isn't approval ground truth?", "On the ground-truth note: why isn't approval ground truth?", "technical"),
    p("What can Aetherix actually learn from?", "On the ground-truth note: what can Aetherix actually learn from today?", "technical"),
  ] },
  { match: "/journal/", prefix: true, prompts: [
    p("Summarise this note in 3 points", "Summarise this field note in 3 points.", "exploring"),
    p("Where is this applied?", "Where is this field note applied in the projects on this site?", "technical"),
  ] },
  { match: "/lore", prompts: [
    p("What does the voice mentor actually do?", "On Lore: what does the voice mentor actually do?", "technical"),
    p("What did the evaluation reveal?", "On Lore: what did the evaluation reveal?", "technical"),
  ] },
  ...["/sonor", "/tacet", "/compass", "/anima"].map((match) => ({ match, prompts: CASE })),
];

export const getRosePrompts = (pathname: string): RosePrompt[] => {
  const path = pathname.replace(/\/+$/, "") || "/";
  const hit =
    ROUTES.find((r) => !r.prefix && r.match === path) ??
    ROUTES.find((r) => r.prefix && path.startsWith(r.match));
  return [...(hit?.prompts ?? HOME), BOOK_CALL];
};

export const DEFAULT_PROMPTS = [...HOME, BOOK_CALL];
