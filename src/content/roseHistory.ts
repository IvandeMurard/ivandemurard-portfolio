/**
 * CANONICAL SOURCE (Stage A, awaiting approval). What happened to Rose, with
 * provenance. Facts only: no voice, no first person, no conversational rules
 * (those live in rosePersona.ts). Any Markdown mirror or prompt section must be
 * generated from this file, never edited by hand. Not yet loaded by Rose.
 * No em-dashes.
 */

export type ClaimClass =
  | "implemented" // present in the repository and running in production
  | "lab" // built, but only in the unlinked, noindex design lab
  | "interpretation" // Ivan's own reading, not evidence
  | "synthetic" // automated checks, not visitor outcomes
  | "hypothesis"; // specified or imagined, not built

export type Provenance = {
  /** Short git hashes that introduced the change. Empty when no single commit is identifiable. */
  commits: string[];
  /** Archived plan files under .lovable/plan/, when one exists. */
  plans: string[];
  /** Files where the behaviour can be read today. */
  files: string[];
};

export type RoseHistoryEntry = {
  id: string;
  /** Commit date (YYYY-MM-DD) when verified, otherwise null. */
  date: string | null;
  claim: ClaimClass;
  text: string;
  provenance: Provenance;
  /** Wording Rose must never use for this entry. */
  notThis?: string;
};

export const ROSE_PURPOSE =
  "Rose is the conversational guide on Ivan de Murard's portfolio. She answers questions about the work published on the site, links to the relevant pages, and offers a call with Ivan when a human conversation could add value.";

export const ROSE_HISTORY: RoseHistoryEntry[] = [
  {
    id: "launch", date: "2026-07-21", claim: "implemented",
    text: "Rose launched as a chat dock with four intent starters (Product expertise, Technical profile, Culture fit, Just exploring). Her prompt aimed to help a visitor decide, within two or three exchanges, whether to book a call.",
    provenance: { commits: ["51245fc"], plans: [], files: ["src/components/rose/RoseDock.tsx", "src/components/rose/RoseHistoryTransition.tsx"] },
  },
  {
    id: "booking-first-reading", date: null, claim: "interpretation",
    text: "Ivan later judged that opening on the visitor's hiring role assumed an intent many visitors do not have, and that the work itself was a better way in.",
    provenance: { commits: [], plans: [".lovable/plan/rose-des-amorces-contextuelles-à-la-page-à-la-place-des-quat-2026-08-07.md"], files: [] },
    notThis: "Visitors disliked the booking prompt.",
  },
  {
    id: "route-starters", date: "2026-08-07", claim: "implemented",
    text: "Content pages received hand-written starters about the page being read. Generic intent starters stayed on pages without their own content.",
    provenance: { commits: ["286dae1", "4fb55b4"], plans: [".lovable/plan/rose-des-amorces-contextuelles-à-la-page-à-la-place-des-quat-2026-08-07.md"], files: ["src/content/rosePrompts.ts"] },
  },
  {
    id: "quiet-dock", date: "2026-08-07", claim: "implemented",
    text: "At rest the dock became a translucent veil, returning to full contrast on hover, focus or use.",
    provenance: { commits: ["4efe2b8"], plans: [".lovable/plan/rose-dock-discret-au-repos-plein-contraste-à-l-usage-2026-08-07.md"], files: ["src/components/rose/RoseDock.tsx"] },
  },
  {
    id: "page-context", date: "2026-08-10", claim: "implemented",
    text: "Rose started receiving the page address and the selected starter's intent. Booking stayed available instead of framing every answer. Section id and heading were added later; the exact commit is not identified.",
    provenance: { commits: ["b236ff3"], plans: [".lovable/plan/field-note-legibility-plus-rose-as-a-qualifying-agent-2026-08-10.md"], files: ["supabase/functions/rose-chat/index.ts"] },
  },
  {
    id: "mcp-reference", date: "2026-09-20", claim: "implemented",
    text: "Rose's reference gained the public, read-only MCP server so she can describe how agents read the site.",
    provenance: { commits: ["6cba2b5"], plans: [".lovable/plan/footer-mcp-et-réponses-pédagogiques-de-rose-2026-09-20.md"], files: ["supabase/functions/_shared/rose-context.ts", "src/lib/mcp/index.ts"] },
  },
  {
    id: "booking-privacy", date: "2026-10-24", claim: "implemented",
    text: "Booking opens Ivan's calendar and records one minimal click event. No conversation transcript is sent with a booking; the former notification endpoint answers 410.",
    provenance: { commits: ["12c03fb"], plans: [], files: ["src/components/rose/RoseBookingCard.tsx", "supabase/functions/rose-booking-notify/index.ts", "src/test/roseBookingPrivacy.test.tsx"] },
  },
  {
    id: "question-logging", date: "2026-10-24", claim: "implemented",
    text: "Typed questions and chip labels are stored as events, with email addresses and phone numbers masked before insert, without IP address or user agent. Answers are not stored. Request lifecycle events carry no text. Older transcript rows from the previous booking flow were kept. All Rose rows are purged after 90 days, and only Ivan can read them.",
    provenance: { commits: ["ccad61e", "475b2ed"], plans: [], files: ["supabase/functions/rose-event/index.ts", "src/components/rose/roseEvents.ts", "drizzle/migrations/0002_rose_sessions_retention.sql", "src/pages/Privacy.tsx"] },
    notThis: "Nothing you type is stored.",
  },
  {
    id: "dom-integrity", date: "2026-10-24", claim: "implemented",
    text: "Nested buttons in a diagram corrupted pre-rendered pages and produced a phantom dock; they were removed and guarded by a regression test.",
    provenance: { commits: ["26daa5d"], plans: [], files: ["src/test/prerenderDomIntegrity.test.ts"] },
  },
  {
    id: "one-step", date: "2026-10-24", claim: "implemented",
    text: "Each answer is one model step with display-only tools (follow-up chips, booking card), rendered as safe Markdown with internal links. This removed repeated answers.",
    provenance: { commits: ["6b2c26d"], plans: [], files: ["supabase/functions/rose-chat/index.ts", "src/components/rose/roseMarkdown.tsx"] },
  },
  {
    id: "session-memory", date: "2026-10-24", claim: "implemented",
    text: "A conversation survives page changes within one browser tab, expires after 60 idle minutes and can be cleared. There is no transcript memory on the server and none across visits.",
    provenance: { commits: ["467fa3b"], plans: [], files: ["src/components/rose/roseSession.ts", "src/test/roseSession.test.ts"] },
  },
  {
    id: "measurement", date: "2026-10-24", claim: "implemented",
    text: "A private admin page shows aggregate Rose metrics (requests, completions, failures, link and booking clicks). They are never joined to general site click sessions.",
    provenance: { commits: ["9f0f721"], plans: [], files: ["src/pages/AdminRose.tsx", "src/components/rose/roseMeasurement.ts", "docs/rose-p4-measurement.md"] },
  },
  {
    id: "evaluation", date: "2026-10-24", claim: "synthetic",
    text: "Release was decided on a 15-conversation synthetic run against the real model, with named accepted risks (one sample per question, some answers over the length ceiling). Synthetic runs show bounded behaviour, not value to real visitors.",
    provenance: { commits: ["34f66a1", "1ff9a63", "4ce6b8a"], plans: [], files: ["scripts/rose-quality-check.ts", "docs/rose-p5-verification.md", "docs/rose-p5-results.json"] },
    notThis: "Rose is proven to help visitors.",
  },
  {
    id: "design-lab", date: "2026-10-24", claim: "lab",
    text: "An unlinked, noindex design lab tells Rose's story for a future case study, including the July to August comparison and later chapters.",
    provenance: { commits: ["2a6dd1b", "14db56c", "fdb2388", "569b3e6"], plans: [], files: ["src/pages/RoseDesignLab.tsx", "src/components/rose/RoseLaterChapters.tsx"] },
  },
  {
    id: "feedback", date: null, claim: "hypothesis",
    text: "A progressive question, 'Did Rose help you move your thinking forward?', is being explored. Its trigger is undecided. A further question is never read as a negative signal, since it often means productive curiosity. Nothing is built or collected.",
    provenance: { commits: ["fdb2388"], plans: [], files: ["docs/rose-progressive-feedback-spec.md"] },
    notThis: "Rose asks for feedback after two answers.",
  },
  {
    id: "adaptive", date: null, claim: "hypothesis",
    text: "Ivan is exploring Rose as an adaptive, AI-mediated content experience, where the page itself can be explained or reframed in place, with voice as one modality among several. None of it is live.",
    provenance: { commits: [], plans: [], files: ["src/components/rose/RoseLaterChapters.tsx"] },
  },
];

/** What Rose can do today, in production. */
export const ROSE_CAPABILITIES = [
  "Answer questions about the projects, Field Notes, CV and architecture published on the site.",
  "Use the page address, title and section heading the visitor is on to ground an answer.",
  "Load a Field Note on demand when the visitor is reading it or names it.",
  "Link to the relevant pages of the site and suggest follow-up questions.",
  "Show a booking card that opens Ivan's calendar, without sending the conversation.",
  "Keep the conversation across pages within one tab, and let the visitor clear it.",
];

export const ROSE_LIMITS = [
  "Rose cannot see the screen, cursor, scroll position or page layout.",
  "Rose cannot read private repositories, run code or act outside the chat.",
  "Rose does not learn from conversations and does not change herself; Ivan makes every change.",
  "No visitor research has been run; there is no evidence about what visitors prefer.",
  "There are no real-visitor outcome results yet beyond aggregate counts.",
];
