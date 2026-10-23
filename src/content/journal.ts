import { HARNESSES_ENTRY } from "./journalHarnesses";
import { TRUTH_ENTRY } from "./journalTruth";
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

/** One self-diagnostic question, answered yes / partly / no by the reader. */
export type DiagnosticQuestion = {
  key: string;
  arm: "A" | "B" | "C";
  ask: string;
  /** What a "no" costs, shown when this is the first gap in dependency order. */
  gap: string;
  /** Heading id to jump to. */
  to: string;
  toLabel: string;
};

/** One version of the harness grading the same recorded answer. */
export type StepperStep = {
  tab: string;
  /** "false-pass": the harness passed a defect. "fail": it caught it. "held": code guarantees the outcome. */
  tone: "false-pass" | "fail" | "held";
  verdict: string;
  checks: { grader: string; result: string }[];
  reading: string;
  /** What ships instead of the recorded answer, when this step changes it. */
  answer?: string;
};

export type JournalBlock =
  | { kind: "p" | "h2" | "h3" | "quote"; text: string; aliases?: string[] }
  | { kind: "list"; items: string[] }
  | { kind: "code"; lang?: string; text: string }
  | {
      kind: "table"; head: string[]; rows: string[][]; caption?: string;
      /** Column whose verdict word (PASS, WARN, FAIL, ERROR) gets a signal lamp. */
      lampCol?: number;
      /** Column collapsed after its first sentence on screen; full text kept in mirrors. */
      foldCol?: number;
    }
  | { kind: "fold"; summary: string; blocks: JournalBlock[] }
  | { kind: "recoLine"; id: string; layer: "checks" | "truth"; caption: string; link?: { to: string; text: string } }
  | { kind: "defs"; items: { term: string; def: string; note?: string }[] }
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
  | { kind: "askRose"; label?: string; note?: string; prompts: string[] }
  /** Restrained editorial aside: a small heading, one paragraph, one link. Used for cross-links and contextual contact. */
  | { kind: "callout"; title: string; text: string; link: { to: string; text: string } }
  | { kind: "console"; preset: "harness"; label?: string }
  | {
      kind: "stepper";
      label?: string;
      question: string;
      rule: string;
      answer: string;
      steps: StepperStep[];
      reveal: { pass: string; fail: string };
      note?: string;
    }
  | { kind: "mcp"; label?: string; note?: string }
  | { kind: "blueprint" }
  | { kind: "matrix"; label?: string; columns: string[]; rows: MatrixRow[] };



export type JournalEntry = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string; // ISO yyyy-mm-dd
  lang?: "en" | "fr";
  category: JournalCategory;
  excerpt: string;
  /** Homepage-only excerpt (and optional display title); the note itself is unchanged. */
  homeHook?: { text: string; title?: string };
  readingMinutes?: number;
  /** Public path to the plain markdown mirror, offered as a download. */
  mirror?: string;
  license?: { label: string; url: string; note?: string };
  /** Continue exploring: role says what the reader gets (method, design decision, implementation evidence). */
  related?: { label: string; to: string; role?: "method" | "decision" | "evidence"; why?: string }[];
  tldr?: string;
  /** Qualification card at the top: who it is for, what it gives, what it is tested on. */
  glance?: { audience: string; promise: string; proof: string };
  /** Three or four short decisions the piece changes, read in twenty seconds. */
  takeaways?: string[];
  /** One line that carries the argument, set apart under the takeaways. */
  takeawayPunch?: string;
  /** Self-diagnostic: six questions in dependency order, the reader's own three-arm reading, and where to start. */
  diagnostic?: {
    label: string;
    intro: string;
    caveat: string;
    allYes: string;
    questions: DiagnosticQuestion[];
  };
  updates?: { date: string; summary: string; reason: string }[];
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
    homeHook: { title: "Keep the forecaster and the actor apart.", text: "One model that predicts and acts looks elegant on a slide. Why I split Prophet and Claude in two, and everything that single choice decided next." },
    title: "A wrong forecast is absorbed. A wrong action reaches a guest.",
    subtitle:
      "Prophet is a statistical forecasting library. Claude is a large language model. Keeping them as two components, rather than letting one model both predict and act, is the decision that shaped everything after it.",
    date: "2026-04-20",
    glance: {
      audience: "you are deciding how much one model should be allowed to do on its own.",
      promise: "a rule for where to draw the line (the cost of an error, not the technology), and the trade-offs it brings.",
      proof: "Aetherix, an F&B agent for hotels, built and tested on synthetic and public data. No hotel connected yet.",
    },
    takeaways: [
      "**Draw the line where the consequence changes.** A wrong forecast is absorbed; a wrong action reaches a guest.",
      "**Five jobs, five owners.** Forecast, recommendation, enforcement, approval and outcome are separate, and each is checked differently.",
      "**A rule in a prompt is a request.** A rule between components is code, and a violation is a failing test.",
      "**The split has a price.** Two systems, one contract to maintain, and a forecast that is good, not magic.",
    ],
    takeawayPunch: "The boundary is where a claim about behaviour gets held by something other than a prompt.",
    updates: [
      {
        date: "2026-10-23",
        summary: "Added a service blueprint: one illustrative breakfast, from forecast to manager decision, service and feedback.",
        reason: "The note explained the architecture but not what it means for the people running the service, nor where authority changes hands and which outcomes can actually be measured.",
      },
      {
        date: "2026-10-23",
        summary: "Linked the two companion notes and the public repository where the text makes a claim they explain or evidence.",
        reason: "Readers arriving here had no path to how the boundary is tested, or to why approval and outcome are different signals.",
      },
      {
        date: "2026-10-23",
        summary: "Added a reading card, a table separating the five jobs in the loop, and the scope of the public benchmark.",
        reason: "The note argued for one boundary but blended five things a reader needs to tell apart: forecasting, recommendation, enforcement in code, human approval and measured outcome. The benchmark sentence now says what it ran on (30 restaurants, Kaggle Recruit data) and that no manager decision has been delivered on the forecast yet, as the repository states.",
      },
      {
        date: "2026-10-12",
        summary: "Corrected the drift example.",
        reason: "The 'three consecutive misses' alert was narration in the demo script, not a production mechanism, and the post-shift error was reduced, not fully recovered.",
      },
      {
        date: "2026-09-24",
        summary: "Corrected what the note said about recorded replies, the CI forecast baseline and the drift example.",
        reason: "An audit of the Aetherix repository found that only an exact \"accept\" or \"reject\", or a corrected figure, records a decision; that the forecast baseline in CI is computed on a synthetic series, not on realised covers; and that the corrupted export and the regime shift come from a simulated 30-day scenario. The note had said more than that.",
      },
    ],
    category: "Agentic AI",
    related: [
      { role: "method", label: "What is an LLM evaluation harness?", to: "/journal/harnesses-graders-closed-loops", why: "How a boundary held in code is tested, graded and allowed to block a release." },
      { role: "method", label: "Whose truth is the ground truth?", to: "/journal/whose-truth-is-the-ground-truth", why: "Why the manager's reply and the next day's covers are different feedback." },
      { role: "evidence", label: "Aetherix case study", to: "/aetherix", why: "The system this decision shaped, its status and what is still to be validated." },
    ],
    excerpt:
      "Prophet is a statistical forecasting library. Claude is a large language model. Keeping them as two components, rather than letting one model both predict and act, is the decision that shaped everything after it.",
    body: [
      {
        kind: "p",
        text: "When you build an operations layer for boutique hotels, the temptation is to let one large model do everything: predict, decide, act. It looks elegant on a slide. One component, one prompt, one place to improve.",
      },
      {
        kind: "p",
        text: "I split it in two. Prophet, an open-source forecasting library built for time series with strong seasonality, reads what is about to happen: how many covers tomorrow, with an uncertainty range. Claude, a large language model, decides what to say about it and to whom. Neither does the other's job, and almost every later decision in the system inherits from that line.",
      },
      { kind: "h2", text: "The asymmetry" },
      {
        kind: "p",
        text: "The line is not drawn where the technology changes. It is drawn where the consequence changes.",
      },
      {
        kind: "p",
        text: "A wrong forecast is absorbed. Order too much and there is waste, too little and there is a run to the supplier. It costs money and nobody's evening. A wrong action reaches a guest, a shift roster, someone's Tuesday. The two failures do not deserve the same amount of freedom, and any component that owns both has to decide, silently, which one it is optimising at any given moment.",
      },
      {
        kind: "p",
        text: "That is the argument for the boundary, and it is not really about Prophet or Claude. It is about which failures you are willing to let a model resolve on its own.",
      },
      { kind: "h2", text: "Why one model collapses" },
      {
        kind: "p",
        text: "Give one component both jobs and it arbitrates between them privately. That is the cost, and it is not a performance cost. A node that owns two domains stops being reviewable: when the recommendation is wrong you cannot tell whether the read of the situation was wrong, or the response to a correct read was wrong. There is one output and one prompt, and the trace tells you nothing you did not already know.",
      },
      {
        kind: "p",
        text: "Forecasting and acting also want different feedback. Forecast error computes itself: tomorrow's covers are known the day after, so the number arrives whether or not anyone asks for it. Whether a recommendation should have been made at all is a judgement, and the only thing that returns it is a human. One loop is arithmetic, the other is an opinion. A single component blends them and you lose the ability to measure either. Why a manager's approval and the next day's covers are different signals, and which one a system may learn from, is [the ground-truth note](/journal/whose-truth-is-the-ground-truth).",
      },
      { kind: "h2", text: "Where the line landed" },
      {
        kind: "p",
        text: "Prophet reads the environment: occupancy, F&B demand, staffing pressure. It produces a number and an error bar and nothing else. It never phrases anything, never recommends, never talks to a manager.",
      },
      {
        kind: "p",
        text: "Claude orchestrates the response. It takes that read, plus memory of what worked at this property, and composes one message a day. It never predicts. When it is uncertain it says so.",
      },
      {
        kind: "p",
        text: "The manager replies accept, reject, or the right figure. That reply is not politeness. It is the recorded output of a decision node.",
      },
      {
        kind: "table",
        caption: "Five jobs in one loop. Each has its own owner, its own check, and its own state of evidence today.",
        head: ["Job", "Owner", "What it produces", "How it is checked", "Evidence today"],
        rows: [
          ["Statistical forecasting", "Prophet", "a number and an uncertainty range", "error against a frozen baseline", "synthetic series in CI; public benchmark"],
          ["Recommendation", "Claude", "one message a day, uncertainty stated", "graders on the reply parser", "stand-in parser; model not yet measured"],
          ["Deterministic enforcement", "code between the two", "a refusal to act on an implausible or low-confidence input", "a test that fails on violation", "exercised in a simulated 30-day scenario"],
          ["Human approval", "the F&B manager", "accept, reject or the right figure", "recorded as an event", "sandbox data; free text not yet mapped"],
          ["Measured outcome", "the till, next day", "real covers", "forecast error computes itself", "not yet: needs a connected hotel"],
        ],
      },
      {
        kind: "p",
        text: "A table of owners says who does what. It does not say what a manager lives through. Here is one illustrative breakfast, read across the four moments of a service and the layers that carry it.",
      },
      { kind: "blueprint" },
      { kind: "h2", text: "What the split buys" },
      { kind: "p", text: "Two things I could not have had otherwise." },
      {
        kind: "p",
        text: "The forecast becomes measurable on its own terms: MAPE compared to a frozen baseline, in CI, blocking a merge. Today that series is synthetic; against realised covers, it starts with the pilot. That number means something precisely because the component producing it does one thing. The gate and its baseline can be inspected in [the public Aetherix repository](https://github.com/IvandeMurard/aetherix-hospitality-ai); the code shows the check exists, not that it works on a real hotel.",
      },
      {
        kind: "p",
        text: "And the action becomes accountable. Every recorded accept, reject or correction is an event with the recommendation stored beside it. Today that means an exact accept or reject, or a figure: a free-text reply is not yet mapped to a decision, a gap an audit found in September 2026. A rejection is not lost feedback, it is a new evaluation case. Human in the loop by design rather than by default, and the difference is whether the decision leaves a trace.",
      },
      {
        kind: "p",
        text: "The seam is also what lets the system be honest about itself. In a simulated 30-day scenario, it rejected an implausible point-of-sale figure, injected as a test, rather than training on it. After a simulated 25% jump in demand, weekly recalibration cut its forecast error from 15.9% to 12.3%. Neither is possible when one component owns the whole path, because there is no seam at which to check.",
      },
      { kind: "h2", text: "What it cost" },
      {
        kind: "p",
        text: "Two systems instead of one, and a contract between them that has to be maintained, versioned and tested. A forecast that is good and not magic: on a public benchmark of 30 restaurants (Kaggle Recruit data), Prophet beats a naive same-weekday baseline on mean error, ties it on the median, and loses the median to a gradient-boosted baseline. Both readings are published. The forecast runs in shadow mode: no manager decision has been delivered on it yet.",
      },
      {
        kind: "p",
        text: "And a limit I have to keep restating. The comparison runs on its own, but the truth it compares against is still declared by a human. That is a closed loop on a declared truth, which is an engineering statement. \"Dual autonomous loop\" would be a brochure statement.",
      },
      { kind: "h2", text: "What I would have lost" },
      {
        kind: "p",
        text: "The guarantee. In a single-model design, \"never act on a low-confidence forecast\" is a sentence in a prompt, which is a request. Requests are not enforced, they are usually honoured. With the boundary in place the rule lives between the components, in code, where it can be checked and where a violation is a failing test rather than a disappointing output. How such a test is written, graded and allowed to block a release is the subject of [the evaluation note](/journal/harnesses-graders-closed-loops).",
      },
      {
        kind: "p",
        text: "A claim about behaviour has to be held by something other than a prompt. The boundary is where I put it.",
      },
      {
        kind: "callout",
        title: "Working on an AI system where a wrong action has real consequences?",
        text: "I work on AI product architecture, evaluation and human-agent collaboration, with a focus on measurable, bounded and accountable systems.",
        link: { to: "/contact", text: "Discuss an AI product or architecture challenge" },
      },
    ],
  },
  HARNESSES_ENTRY,
  TRUTH_ENTRY,
];


/** Editorial curation for /journal: three questions mapped to existing slugs. Not auto-assigned. */
export const JOURNAL_KNOWLEDGE_QUESTIONS: {
  number: string; label: string; question: string; description: string; slug: string;
  cases: { label: string; to: string }[];
}[] = [
  { number: "01", label: "Evaluate", question: "How do you know an agent is working?", description: "Learn what correct behavior means and how to test it.", slug: "harnesses-graders-closed-loops", cases: [{ label: "Aetherix", to: "/aetherix" }, { label: "Lore", to: "/lore" }] },
  { number: "02", label: "Set boundaries", question: "Where should an agent's responsibility end?", description: "Separate prediction, recommendation and authority.", slug: "agent-boundaries-aetherix", cases: [{ label: "Aetherix", to: "/aetherix" }] },
  { number: "03", label: "Learn", question: "Whose truth should an agent learn from?", description: "Distinguish approval, prediction and observed truth.", slug: "whose-truth-is-the-ground-truth", cases: [{ label: "Aetherix", to: "/aetherix" }, { label: "Lore", to: "/lore" }] },
];

// TODO: replace with real reading list
export const READING_LIST: ReadingItem[] = [];
