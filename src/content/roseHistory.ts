/**
 * CANDIDATE CANONICAL FACT SOURCE (Stage A, pending editorial acceptance).
 * Historical claims, provenance, present capabilities and limitations only.
 * Conversational behavior belongs in rosePersona.ts. This file is NOT yet
 * connected to the server-side Rose prompt. Stage B must generate and validate
 * any derived prompt/reference output instead of maintaining manual copies.
 * No em-dashes.
 */

export type ClaimClass =
  | "implemented" // verified in repository code; deployment parity is NOT implied
  | "lab" // built, but only in the unlinked, noindex design lab
  | "interpretation" // a documented design reading, not a measured visitor result
  | "synthetic" // bounded model/test observations, not visitor outcomes
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
  "Rose is the conversational guide embedded in Ivan de Murard's portfolio. She helps visitors question the published work, explore evidence and find relevant pages; a conversation with Ivan remains optional. The longer-term design explores a more self-referential, context-responsive reading experience, not a capability already delivered.";

export const ROSE_HISTORY: RoseHistoryEntry[] = [
  {
    id: "launch", date: "2026-07-21", claim: "implemented",
    text: "Rose launched as a chat dock with four intent starters (Product expertise, Technical profile, Culture fit, Just exploring). Her prompt aimed to help a visitor decide, within two or three exchanges, whether to book a call.",
    provenance: { commits: ["51245fc"], plans: [], files: ["src/components/rose/RoseDock.tsx", "src/components/rose/RoseHistoryTransition.tsx"] },
  },
  {
    id: "booking-first-reading", date: null, claim: "interpretation",
    text: "Ivan reconsidered beginning with a visitor-role or hiring qualification and chose to let questions about the work lead. This is a documented design interpretation, not a finding about what visitors actually wanted.",
    provenance: { commits: [], plans: [".lovable/plan/rose-des-amorces-contextuelles-à-la-page-à-la-place-des-quat-2026-08-07.md"], files: [] },
    notThis: "Visitors disliked the booking prompt.",
  },
  {
    id: "route-starters", date: "2026-08-07", claim: "implemented",
    text: "Content pages received hand-written starters about the page being read. Generic intent starters stayed on pages without their own content.",
    provenance: { commits: ["286dae1"], plans: [".lovable/plan/rose-des-amorces-contextuelles-à-la-page-à-la-place-des-quat-2026-08-07.md"], files: ["src/content/rosePrompts.ts"] },
  },
  {
    id: "route-starters-refinement", date: "2026-08-10", claim: "implemented",
    text: "Route matching was refined so exact routes take priority over prefix matches. This refined the already implemented contextual starters, rather than introducing them on August 10.",
    provenance: { commits: ["4fb55b4"], plans: [], files: ["src/content/rosePrompts.ts"] },
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
    text: "Rose's system reference gained an explanation of the site's separate public, read-only portfolio MCP interface, so she could answer questions about how external agents access published content.",
    provenance: { commits: ["6cba2b5"], plans: [".lovable/plan/footer-mcp-et-réponses-pédagogiques-de-rose-2026-09-20.md"], files: ["supabase/functions/_shared/rose-context.ts", "src/lib/mcp/index.ts"] },
  },
  {
    id: "booking-privacy", date: "2026-10-24", claim: "implemented",
    text: "Opening the booking link navigates to Ivan's calendar and records a bounded click event. The booking link does not include the conversation or a summary; the deprecated transcript-notification endpoint responds with HTTP 410.",
    provenance: { commits: ["12c03fb"], plans: [], files: ["src/components/rose/RoseBookingCard.tsx", "supabase/functions/rose-booking-notify/index.ts", "src/test/roseBookingPrivacy.test.tsx"] },
  },
  {
    id: "question-logging", date: "2026-10-24", claim: "implemented",
    text: "The site logs typed questions and selected chip labels with pattern-based email and phone masking, which is imperfect. Rose application event records do not include IP addresses or user agents, but providers and hosting may process separate network data. Generated answers are not saved in the current application event table; request-lifecycle events are content-free. Deprecated booking-transcript rows may remain until the scheduled 90-day purge. Access to Rose event records is restricted to the site admin.",
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
    text: "The backend is configured for one model step per request, with UI-display tools for follow-up questions and booking cards. Markdown and link rendering have separate client-side safeguards. These changes were intended to address duplicated answers; one-step execution is not a guarantee against every form of repetition.",
    provenance: { commits: ["6a63c1e", "6b2c26d"], plans: [], files: ["supabase/functions/rose-chat/index.ts", "src/components/rose/roseMarkdown.tsx", "src/components/rose/RoseDock.tsx"] },
  },
  {
    id: "session-memory", date: "2026-10-24", claim: "implemented",
    text: "Chat history is kept in browser-tab sessionStorage across page navigation, expires after 60 minutes of inactivity and can be cleared. It is not persisted as a current server-side chat transcript. Some browsers may restore tab sessionStorage, and model-provider processing is a separate boundary.",
    provenance: { commits: ["467fa3b"], plans: [], files: ["src/components/rose/roseSession.ts", "src/test/roseSession.test.ts"] },
  },
  {
    id: "measurement", date: "2026-10-24", claim: "implemented",
    text: "The private admin page defines aggregates for Rose requests, completions, failures, evidence-link use and booking-link clicks, using tab-scoped event data separate from general site click-session data. These metrics do not establish visitor understanding or satisfaction.",
    provenance: { commits: ["9f0f721"], plans: [], files: ["src/pages/AdminRose.tsx", "src/components/rose/roseMeasurement.ts", "docs/rose-p4-measurement.md"] },
  },
  {
    id: "evaluation", date: "2026-10-24", claim: "synthetic",
    text: "The October 24 risk-based release decision used a final sample of 15 synthetic model conversations, alongside other checks. Accepted limitations included one sample per scenario and several overlong answers. This supports only bounded test-case conclusions, not consistency across all visitors or demonstrated visitor value.",
    provenance: { commits: ["34f66a1", "1ff9a63", "4ce6b8a"], plans: [], files: ["scripts/rose-quality-check.ts", "docs/rose-p5-verification.md", "docs/rose-p5-results.json"] },
    notThis: "Rose is proven to help visitors.",
  },
  {
    id: "design-lab", date: "2026-10-24", claim: "lab",
    text: "An unlinked design-lab route was added for reviewing Rose's retrospective case study; its historical transition and later chapters are prototype UI, not evidence of shipped adaptive-reading capabilities. The route is excluded from standard discovery, but unlinked does not mean access-controlled.",
    provenance: { commits: ["2a6dd1b", "fdb2388"], plans: [], files: ["src/pages/RoseDesignLab.tsx", "src/components/rose/RoseLaterChapters.tsx"] },
  },
  {
    id: "feedback", date: null, claim: "hypothesis",
    text: "Optional, response-level feedback after a real Rose answer is a proposed learning mechanism, not a deployed collection flow. An explicit submission, limited metadata, retention and privacy review remain design gates; prompting rules are undecided. A follow-up question alone cannot distinguish productive curiosity from confusion.",
    provenance: { commits: ["fdb2388"], plans: [], files: ["docs/rose-progressive-feedback-spec.md"] },
    notThis: "Rose asks for feedback after two answers.",
  },
  {
    id: "adaptive", date: null, claim: "hypothesis",
    text: "Ivan is exploring adaptive, AI-mediated reading in which content could be located, annotated or explained in place, with voice as one potential modality. Generative page adaptation and voice are not implemented capabilities.",
    provenance: { commits: [], plans: [], files: ["src/components/rose/RoseLaterChapters.tsx"] },
  },
];

/** Capabilities evidenced in the current repository; confirm deployed parity separately. */
export const ROSE_CAPABILITIES = [
  "Answer questions about the projects, Field Notes, CV and architecture published on the site.",
  "Use the page address, title and section heading the visitor is on to ground an answer.",
  "Load a Field Note on demand when the visitor is reading it or names it.",
  "Link to the relevant pages of the site and suggest follow-up questions.",
  "Show a booking card that opens Ivan's calendar, without sending the conversation.",
  "Keep the conversation across pages within one tab, and let the visitor clear it.",
];

export const ROSE_LIMITS = [
  "Rose receives page metadata per message and has no direct access to the full screen, cursor, scroll position, private browser state or arbitrary DOM.",
  "Rose does not inspect private repositories, execute visitor code, or modify website content in response to chat.",
  "Rose does not autonomously train on conversations or redesign her product. Product changes are made by people and must be grounded in documented authorship.",
  "The reviewed Rose evidence does not document visitor research establishing preferences or validating the July-to-August design change.",
  "The reviewed records do not establish visitor comprehension, satisfaction, reading outcomes, successful meetings or causal product value.",
];
