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
    label: "Product expertise",
    message: "I want to understand Ivan's product craft.",
    intent: "product",
  },
  {
    label: "Technical profile",
    message: "I want to evaluate Ivan's technical profile.",
    intent: "technical",
  },
  {
    label: "Culture fit",
    message: "I want to see if we would work well together.",
    intent: "culture",
  },
  BOOK_CALL,
];

/** Exact path, or prefix when the entry ends with "/". */
const ROSE_PROMPTS: Array<{ match: string; prompts: RosePrompt[] }> = [
  {
    match: "/aetherix",
    prompts: [
      {
        label: "What it actually does",
        message:
          "On the Aetherix case study: what does the product actually do today, and what is still a prototype?",
        intent: "product",
      },
      {
        label: "Why WhatsApp",
        message:
          "On the Aetherix case study: why one WhatsApp message a day instead of a dashboard?",
        intent: "product",
      },
      {
        label: "How the mesh fits",
        message:
          "On the Aetherix case study: how do Aetherix, Tacet, Anima and the orchestrator fit together?",
        intent: "technical",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/tacet",
    prompts: [
      {
        label: "Why headless",
        message:
          "On the Tacet case study: why is Tacet headless and consumed by agents rather than humans?",
        intent: "product",
      },
      {
        label: "Which signals",
        message:
          "On the Tacet case study: which environmental signals feed the twin, and how do they become yield rules?",
        intent: "technical",
      },
      {
        label: "How far it got",
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
        label: "What is actually built",
        message:
          "On the architecture note: which nodes of the mesh are built today, and which are still design or stub?",
        intent: "exploring",
      },
      {
        label: "Why several agents",
        message:
          "On the architecture note: why split this into separate agents instead of one model doing everything?",
        intent: "technical",
      },
      {
        label: "Tenancy and privacy",
        message:
          "On the architecture note: how does the mesh stop one property's data reaching another?",
        intent: "technical",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/lore",
    prompts: [
      {
        label: "Real or synthetic",
        message:
          "On the Lore case study: what is real in this project and what runs on synthetic data?",
        intent: "technical",
      },
      {
        label: "Why voice",
        message:
          "On the Lore case study: why voice capture rather than a form for a retiring technician?",
        intent: "product",
      },
      {
        label: "How the harness gates a release",
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
        label: "What Sonor shipped",
        message:
          "On the Sonor case study: what did Sonor actually ship for cities between 2020 and 2022?",
        intent: "product",
      },
      {
        label: "Why it closed",
        message:
          "On the Sonor case study: why did the company close, and what did Ivan take from it?",
        intent: "culture",
      },
      {
        label: "What carried over",
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
        label: "A grader in one sentence",
        message:
          "In the field note Harnesses, graders, closed loops: explain what a grader is in one sentence, with an example.",
        intent: "technical",
      },
      {
        label: "Apply it to my team",
        message:
          "In the field note Harnesses, graders, closed loops: how would I apply this to a team shipping its first LLM feature?",
        intent: "product",
      },
      {
        label: "Where it runs in Lore",
        message:
          "In the field note Harnesses, graders, closed loops: how does this vocabulary show up concretely in Lore?",
        intent: "technical",
      },
      BOOK_CALL,
    ],
  },
  {
    match: "/journal/agent-boundaries-aetherix",
    prompts: [
      {
        label: "The call that was made",
        message:
          "In the field note on Aetherix's agent boundaries: what was the hard call, and what was given up?",
        intent: "product",
      },
      {
        label: "Where the agent stops",
        message:
          "In the field note on Aetherix's agent boundaries: where does the agent stop and the human decide?",
        intent: "technical",
      },
      {
        label: "Would you redo it",
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
        label: "Summarise this note",
        message: "Summarise the field note I am reading in five lines.",
        intent: "exploring",
      },
      {
        label: "Explain a term",
        message:
          "Explain the key technical term in the field note I am reading, in plain language.",
        intent: "technical",
      },
      {
        label: "Where it runs",
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
        label: "Where to start",
        message: "Which field note should I read first, and why?",
        intent: "exploring",
      },
      {
        label: "What these notes argue",
        message:
          "What is the common thread across Ivan's field notes?",
        intent: "product",
      },
      {
        label: "Notes or case studies",
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
        label: "Which case study fits me",
        message:
          "I am hiring for a product role in hospitality tech. Which case study should I read first?",
        intent: "product",
      },
      {
        label: "Compare the four",
        message:
          "Compare Aetherix, Tacet, Lore and Sonor in one line each, with their current status.",
        intent: "exploring",
      },
      {
        label: "What is shipped",
        message: "Which of these four systems is actually shipped and used?",
        intent: "technical",
      },
      BOOK_CALL,
    ],
  },
];

export const getRosePrompts = (pathname: string): RosePrompt[] => {
  const path = pathname.replace(/\/+$/, "") || "/";
  for (const entry of ROSE_PROMPTS) {
    if (entry.match.endsWith("/")) {
      if (path.startsWith(entry.match)) return entry.prompts;
    } else if (path === entry.match) {
      return entry.prompts;
    }
  }
  return DEFAULT_PROMPTS;
};

export { DEFAULT_PROMPTS };
