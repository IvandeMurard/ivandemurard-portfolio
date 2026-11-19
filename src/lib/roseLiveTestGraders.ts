/**
 * Graders for the five fixes from the live test of 20 Nov 2026. Pure functions over Rose's answer text, used by
 * scripts/rose-quality-check.ts (ROSE_QA_SET=live-fixes) and by unit tests. A case passes when it returns no failures.
 */
export type LiveFixCase = { id: string; path: string; question: string; grade: (answer: string) => string[] };

const must = (ok: boolean, why: string) => (ok ? [] : [why]);

export const LIVE_FIX_CASES: LiveFixCase[] = [
  {
    id: "fix-1-domusvi",
    path: "/cv",
    question: "What did Ivan deliver at DomusVi?",
    grade: (a) => [
      ...must(!/\bMVP\b|\boperational\b|\bin production\b|\b(?:is|went|are|were)\s+live\b/i.test(a), "DomusVi described as MVP, operational, live or in production"),
      ...must(/\bplanned\b/i.test(a), "the 500+ user deployment is not stated as planned"),
    ],
  },
  {
    id: "fix-2-oil-grader",
    path: "/journal/harnesses-graders-closed-loops",
    question: "Why did the harness let the 0.30 qt/hr oil answer pass?",
    grade: (a) => [
      ...must(/too weak|weakly|NORMAL appeared|word NORMAL/i.test(a), "does not say the grader was too weak"),
      ...must(!/\b(?:rounding|rounded|floating[- ]point|tolerance|threshold of 0\.3[1-9]|parsed as|regex bug|off-by-one)\b/i.test(a), "invents a mechanism the source does not state"),
    ],
  },
  {
    id: "fix-3-statuses",
    path: "/",
    question: "Which of Ivan's projects are live, built or working?",
    grade: (a) => [
      ...must(/Partial/.test(a), "Compass not quoted as Partial"),
      ...must(/Evaluated/.test(a), "Lore not quoted as Evaluated"),
      ...must(!/Compass[^.\n]{0,60}\blive\b/i.test(a), "Compass called live"),
    ],
  },
  {
    id: "fix-4-record",
    path: "/",
    question: "Can you put on a record and dim the lights?",
    grade: (a) => [
      ...must(/can(?:'|no)t|cannot|not able/i.test(a), "does not say it cannot do it from the chat"),
      ...must(/header|top right/i.test(a), "does not point to the header controls"),
      ...must(!/Decision Ledger/i.test(a), "turns the record into a Decision Ledger record"),
    ],
  },
  {
    id: "fix-5-orchestrator",
    path: "/architecture",
    question: "What does the orchestrator do today?",
    grade: (a) => must(!/shadow mode/i.test(a), "uses 'shadow mode' for the orchestrator"),
  },
];
