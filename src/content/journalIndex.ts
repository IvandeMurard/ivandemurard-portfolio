// Copy of the Field Notes index (/journal), and the numbers that sit next to it. Source: docs/field-notes-prototype
// (boards I and J, copy validated by Ivan on 17 Nov 2026). The words are the reference's, with the changes listed in the PR.
// Asset-free: the page, the Markdown mirror and the tests read it.
//
// Never typed here: read time, "tested on" and "revised N times". They are computed from the journal content below,
// so a new revision or a new project moves them everywhere at once. Dates stay on the note pages, in the Markdown mirror
// and in JSON-LD; they are not on the cards.

import { JOURNAL_ENTRIES, JOURNAL_KNOWLEDGE_QUESTIONS, type JournalEntry } from "./journal";
import { readingLabel } from "./readingTime";

export const INDEX_HERO = {
  kicker: "Field Notes",
  title: "Methods, tested on systems I built.",
  line: "Each note starts from a failure or a decision, shows what it changed, and ends with a method you can apply to your own product. Published when a system teaches something, revised when a claim stops being true.",
} as const;

export const INDEX_COPY = {
  startHere: "Start here",
  readNote: "Read the note",
  otherNotes: "Other notes",
  systems: "The systems behind these notes",
  allCases: "All case studies",
  /** Under the shared Contact block, on this page only. "Compare notes" is the Email link. */
  compare: { lead: "Building an evaluation harness of your own?", link: "Compare notes" },
} as const;

/** The note chosen as the lead, with its proof visible. The navy panel is the page's one strong contrast. */
export const LEAD = {
  slug: "harnesses-graders-closed-loops",
  pitch: "What a grader, a harness and a protocol each decide, and why the difference matters the first time a system is allowed to block a release.",
  why: "Why start here: it shows the whole method on one real failure, in ten seconds.",
  proof: {
    kicker: "Recorded run · Lore, aviation maintenance",
    lead: "An engine was burning oil exactly at the limit set by the maintenance manual. The manual says that is already too high. Lore said it was normal.",
    // Lore's answer is quoted only in verbatim fragments of the recorded answer in section 12 of the note.
    steps: [
      { text: "Lore answers that the reading is **\"considered NORMAL\"** and that **\"no further action is required\"**. Fluent, and wrong.", tone: "plain" },
      { text: "The first harness passed it. Reading the answers caught it; the graders now fail it and block the release.", tone: "fail" },
      { text: "The code now holds the rule: when Lore contradicts the manual, the manual's verdict ships.", tone: "plain" },
    ],
    caption: "The replay of this case is in section 12.",
  },
} as const;

/** The other notes, as cards: a pitch and the moment that carries the note. */
export const CARDS: Record<string, { pitch: string; moment: { label: string; text: string } }> = {
  "agent-boundaries-aetherix": {
    pitch: "A wrong forecast is absorbed. A wrong action reaches a guest. Why I split prediction from action, and what the split costs.",
    moment: {
      label: "The moment authority changes hands",
      text: "The evening before, Aetherix suggests tomorrow's breakfast staffing to the hotel's F&B manager. The manager has the last word: from that reply on, the system decides nothing.",
    },
  },
  "whose-truth-is-the-ground-truth": {
    pitch: "A forecast is a claim, a manager's \"yes\" is a preference, real covers are a fact the next day. Which one your product learns from decides what it becomes.",
    moment: {
      label: "A yes is not a right",
      text: "A manager can approve a wrong forecast and reject a right one. A product that repeated last Tuesday's numbers would be approved often and teach nothing.",
    },
  },
};

/**
 * The reference zone of each note: the end matter, from the heading `from` to the end of the body, on a flat ground,
 * with a link list. A chip links to an id that exists in the page: a heading id, or an anchor on a figure that stays
 * where it is (an argument section is never moved into the zone). "Updates · N" is added by the page, from the data.
 */
export const REFERENCE_ZONE: Record<string, { from: string; chips: { label: string; id: string }[] }> = {
  "harnesses-graders-closed-loops": {
    from: "14-frequently-asked-questions",
    chips: [
      { label: "Vocabulary", id: "1-the-vocabulary-through-the-driving-test" },
      { label: "FAQ", id: "14-frequently-asked-questions" },
      { label: "Apply this to your project", id: "apply-this-to-your-project" },
      { label: "Closing note", id: "15-closing-note" },
    ],
  },
  "agent-boundaries-aetherix": {
    from: "apply-this-to-your-project",
    chips: [
      { label: "Who owns which job", id: "who-owns-which-job" },
      { label: "Apply this to your project", id: "apply-this-to-your-project" },
    ],
  },
  "whose-truth-is-the-ground-truth": {
    from: "7-checklist",
    chips: [
      { label: "Checklist", id: "7-checklist" },
      { label: "Apply this to your project", id: "apply-this-to-your-project" },
      { label: "FAQ", id: "8-faq" },
      { label: "Sources", id: "9-sources" },
    ],
  },
};

// ---------------------------------------------------------------------------------------------------------------
// Computed: read time, projects, revisions.

export const noteBySlug = (slug: string): JournalEntry => {
  const entry = JOURNAL_ENTRIES.find((e) => e.slug === slug);
  if (!entry) throw new Error(`Unknown Field Note: ${slug}`);
  return entry;
};

/** "A", "A and B", "A, B and C". */
export const joinNames = (names: string[]): string =>
  names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

/** "revised once", "revised twice", "revised 5 times"; nothing before the first revision. */
export const revisedLabel = (n: number): string =>
  n <= 0 ? "" : n === 1 ? "revised once" : n === 2 ? "revised twice" : `revised ${n} times`;

export const revisionCount = (entry: JournalEntry): number => entry.updates?.length ?? 0;

/** The projects a note was applied in, in the order of the knowledge map (journal.ts). */
export const testedOn = (slug: string): string[] =>
  (JOURNAL_KNOWLEDGE_QUESTIONS.find((q) => q.slug === slug)?.cases ?? []).map((c) => c.label);

/** "16 min", or "16 min · 22 with every detail open" when every fold open is at least 5 minutes longer. Computed, never typed. */
export const readLabel = (entry: JournalEntry): string => readingLabel(entry.readingMinutes ?? 0, entry.readingMinutesFull);

/** "18 min · tested on Aetherix and Lore · revised 7 times". */
export const metaLine = (entry: JournalEntry): string => {
  const tested = testedOn(entry.slug);
  return [readLabel(entry), tested.length ? `tested on ${joinNames(tested)}` : "", revisedLabel(revisionCount(entry))].filter(Boolean).join(" · ");
};

/** "3 notes · revised 13 times · tested on Aetherix and Lore". */
export const heroMeta = (): string => {
  const revisions = JOURNAL_ENTRIES.reduce((sum, e) => sum + revisionCount(e), 0);
  const projects = [...new Set(JOURNAL_ENTRIES.flatMap((e) => testedOn(e.slug)))];
  return [`${JOURNAL_ENTRIES.length} notes`, revisedLabel(revisions), projects.length ? `tested on ${joinNames(projects)}` : ""].filter(Boolean).join(" · ");
};

/** The two notes that are not `slug`, for the cards and for "Continue exploring". */
export const otherNotes = (slug: string): JournalEntry[] => JOURNAL_ENTRIES.filter((e) => e.slug !== slug);

/** Display order on the index: the lead first, then the others in the order of the knowledge map. */
export const notesInOrder = (): JournalEntry[] => {
  const order = JOURNAL_KNOWLEDGE_QUESTIONS.map((q) => q.slug);
  return [...JOURNAL_ENTRIES].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
};

/** The projects named in "The systems behind these notes": the union of `testedOn`, by their own names. */
export const systemNames = (): string[] => [...new Set(JOURNAL_ENTRIES.flatMap((e) => testedOn(e.slug)))];
