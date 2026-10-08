/**
 * Page-aware conversation starters for Rose.
 *
 * The dock used to show four fixed recruiter intents. Those still apply on
 * pages with no content of their own (home, atrium, contact). Everywhere else
 * the chips ask about what the visitor is actually reading. Every prompt is
 * written by hand so Rose is never nudged towards a claim the site does not make.
 */

export type RosePrompt = {
  label: string;
  message: string;
  intent?: "product" | "technical" | "culture" | "exploring";
  /** Longer label for screen readers when the visible label is elliptical. */
  ariaLabel?: string;
};

const BOOK_CALL: RosePrompt = {
  label: "Book a call",
  message: "I would like to book a call with Ivan.",
};

const DEFAULT_PROMPTS: RosePrompt[] = [
  {
    label: "What does Ivan build?",
    message:
      "In plain language: what does Ivan build, and for whom?",
    intent: "product",
  },
  {
    label: "What is live today?",
    message:
      "Across Ivan's projects, what is actually shipped and used, and what is still prototype?",
    intent: "technical",
  },
  {
    label: "Where should I start?",
    message: "I have five minutes. Which page should I read first, and why?",
    intent: "exploring",
  },
  BOOK_CALL,
];

/** Exact path, or prefix when the entry ends with "/". */
const ROSE_PROMPTS: Array<{ match: string; prompts: RosePrompt[] }> = [
  {
    match: "/",
    prompts: [
      {
        label: "What does Ivan build?",
        message: "In plain language: what does Ivan build, and for whom?",
        intent: "product",
      },
      {
        label: "What is live today?",
        message:
          "Across Ivan's work (Aetherix, Tacet and Anima in the Hospitality Multi-Agent Architecture; Lore, Sonor and Paris Compass as standalone projects), what is actually shipped and used, and what is still prototype?",
        intent: "technical",
      },
      {
        label: "Where should I start?",
        message: "I have five minutes. Which case study or field note should I read first, and why?",
        intent: "exploring",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/atrium",
    prompts: [
      {
        label: "What is the short version?",
        message: "Give me the short version of Ivan's background and what he is working on now.",
        intent: "product",
      },
      {
        label: "How does he work?",
        message: "How does Ivan work with a team: what does he take on, and what does he leave to others?",
        intent: "culture",
      },
      {
        label: "What is live today?",
        message: "Across Ivan's projects, what is actually shipped and used, and what is still prototype?",
        intent: "technical",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/cv",
    prompts: [
      {
        label: "Summarise Ivan's experience",
        message: "Summarise Ivan's experience and the kinds of product roles he has held.",
        intent: "product",
      },
      {
        label: "Which skills are strongest?",
        message: "From Ivan's CV, which skills are strongest for a 0 to 1 product role?",
        intent: "technical",
      },
      {
        label: "What has he shipped?",
        message: "From Ivan's CV and case studies, what has he personally taken from discovery to delivery?",
        intent: "exploring",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/aetherix",
    prompts: [
      {
        label: "What does it actually do?",
        message:
          "On the Aetherix case study: what does the product actually do today, and what is still a prototype?",
        intent: "product",
      },
      {
        label: "Why WhatsApp?",
        message:
          "On the Aetherix case study: why one WhatsApp message a day instead of a dashboard?",
        intent: "product",
      },
      {
        label: "How does the architecture fit?",
        message:
          "On the Aetherix case study: how do Aetherix, Tacet, Anima and the orchestrator fit together?",
        intent: "technical",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/anima",
    prompts: [
      {
        label: "What are the four layers?",
        message:
          "On the Anima case study: what are the four memory layers, and why do they expire differently?",
        intent: "technical",
      },
      {
        label: "Why is it not switched on?",
        message:
          "On the Anima case study: why is production gated behind a data-protection assessment?",
        intent: "product",
      },
      {
        label: "Why not personalisation?",
        message:
          "On the Anima case study: how is this different from a personalisation engine?",
        intent: "product",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/tacet",
    prompts: [
      {
        label: "Why headless?",
        message:
          "On the Tacet case study: why is Tacet headless and consumed by agents rather than humans?",
        intent: "product",
      },
      {
        label: "Which signals feed it?",
        message:
          "On the Tacet case study: which environmental signals feed the twin, and how do they become yield rules?",
        intent: "technical",
      },
      {
        label: "How far did it get?",
        message:
          "On the Tacet case study: what is built, what is still prototype, and what was never validated?",
        intent: "exploring",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/architecture",
    prompts: [
      {
        label: "What is actually built?",
        message:
          "On the architecture note: which nodes are built today, and which are still design or stub?",
        intent: "exploring",
      },
      {
        label: "Why several agents?",
        message:
          "On the architecture note: why split this into separate agents instead of one model doing everything?",
        intent: "technical",
      },
      {
        label: "How is tenancy kept apart?",
        message:
          "On the architecture note: how does the architecture stop one property's data reaching another?",
        intent: "technical",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/lore",
    prompts: [
      {
        label: "Real or synthetic?",
        message:
          "On the Lore case study: what is real in this project and what runs on synthetic data?",
        intent: "technical",
      },
      {
        label: "Why voice?",
        message:
          "On the Lore case study: why voice capture rather than a form for a retiring technician?",
        intent: "product",
      },
      {
        label: "How does the harness gate a release?",
        message:
          "On the Lore case study: how does the evaluation harness block a release in CI?",
        intent: "technical",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/sonor",
    prompts: [
      {
        label: "What did Sonor ship?",
        message:
          "On the Sonor case study: what did Sonor actually ship for cities between 2020 and 2022?",
        intent: "product",
      },
      {
        label: "Why did it close?",
        message:
          "On the Sonor case study: why did the company close, and what did Ivan take from it?",
        intent: "culture",
      },
      {
        label: "What carried over?",
        message:
          "On the Sonor case study: what from Sonor carries into the current hospitality work?",
        intent: "exploring",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/journal/harnesses-graders-closed-loops",
    prompts: [
      {
        label: "What is a grader?",
        message:
          "In the field note Evaluating LLM agents: how would you know it had stopped working?: explain what a grader is in one sentence, with an example.",
        intent: "technical",
      },
      {
        label: "How do I apply this?",
        message:
          "In the field note Evaluating LLM agents: how would you know it had stopped working?: how would I apply this to a team shipping its first LLM feature?",
        intent: "product",
      },
      {
        label: "Where does it run in Lore?",
        message:
          "In the field note Evaluating LLM agents: how would you know it had stopped working?: how does this vocabulary show up concretely in Lore?",
        intent: "technical",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/journal/agent-boundaries-aetherix",
    prompts: [
      {
        label: "What was the hard call?",
        message:
          "In the field note on Aetherix's agent boundaries: what was the hard call, and what was given up?",
        intent: "product",
      },
      {
        label: "Where does the agent stop?",
        message:
          "In the field note on Aetherix's agent boundaries: where does the agent stop and the human decide?",
        intent: "technical",
      },
      {
        label: "Would he redo it?",
        message:
          "In the field note on Aetherix's agent boundaries: would Ivan make the same call again today?",
        intent: "culture",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/journal/",
    prompts: [
      {
        label: "Can you summarise this note?",
        message: "Summarise the field note I am reading in five lines.",
        intent: "exploring",
      },
      {
        label: "What does this term mean?",
        message:
          "Explain the key technical term in the field note I am reading, in plain language.",
        intent: "technical",
      },
      {
        label: "Where does it run?",
        message:
          "Which of Ivan's projects puts the ideas of this field note into practice?",
        intent: "product",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/journal",
    prompts: [
      {
        label: "Where should I start?",
        message: "Which field note should I read first, and why?",
        intent: "exploring",
      },
      {
        label: "What do these notes argue?",
        message:
          "What is the common thread across Ivan's field notes?",
        intent: "product",
      },
      {
        label: "Notes or case studies?",
        message:
          "What is the difference between the field notes and the case studies on this site?",
        intent: "exploring",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/journeys",
    prompts: [
      {
        label: "Which case study fits me?",
        message:
          "I am hiring for a product role in hospitality tech. Which case study should I read first?",
        intent: "product",
      },
      {
        label: "How do they compare?",
        message:
          "Compare Aetherix, Tacet, Lore, Anima and Sonor in one line each, with their current status.",
        intent: "exploring",
      },
      {
        label: "What is shipped?",
        message: "Which of these systems is actually shipped and used?",
        intent: "technical",
      },
      BOOK_CALL,
    ],
  },
];

export const getRosePrompts = (pathname: string): RosePrompt[] => {
  const path = pathname.replace(/\/+$/, "") || "/";
  // Exact matches win over prefix matches, whatever the declaration order.
  const exact = ROSE_PROMPTS.find((entry) => entry.match === path);
  if (exact) return exact.prompts;
  // "/" is only ever an exact match: it would otherwise prefix every route.
  const prefix = ROSE_PROMPTS.filter(
    (entry) => entry.match !== "/" && entry.match.endsWith("/") && path.startsWith(entry.match),
  ).sort((a, b) => b.match.length - a.match.length)[0];
  if (prefix) return prefix.prompts;
  return DEFAULT_PROMPTS;
};

export { DEFAULT_PROMPTS };
