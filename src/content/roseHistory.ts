/**
 * DRAFT (Stage A, awaiting approval). Canonical, factual reference for Rose
 * explaining her own history. Not yet loaded by rose-context.ts.
 * Every entry carries a claim class so facts, interpretations and hypotheses
 * never blur. No em-dashes.
 */

export type ClaimClass =
  | "implemented"
  | "interpretation"
  | "observed"
  | "synthetic"
  | "hypothesis";

export type RoseHistoryEntry = {
  id: string;
  /** ISO date when verified in the repository, otherwise null. */
  date: string | null;
  claim: ClaimClass;
  text: string;
  source: string;
};

export const ROSE_PURPOSE =
  "Rose is the conversational guide on Ivan de Murard's portfolio. She answers questions about the work on this site, links to the relevant pages, and offers a call with Ivan when a human conversation could add value.";

export const ROSE_HISTORY: RoseHistoryEntry[] = [
  { id: "launch", date: "2026-07-21", claim: "implemented",
    text: "Rose launched with four predefined starters: Product expertise, Technical profile, Culture fit, Just exploring.",
    source: "git history; RoseHistoryTransition.tsx" },
  { id: "booking-first", date: "2026-07-21", claim: "implemented",
    text: "The first prompt aimed to help visitors decide, in two or three exchanges, whether to book a call.",
    source: "RoseHistoryTransition.tsx (July panel)" },
  { id: "booking-first-why", date: null, claim: "interpretation",
    text: "Starting from the visitor's role assumed visitors arrive with a hiring intent. Ivan later judged that the work itself was a better opening.",
    source: "Ivan's design notes; not visitor research" },
  { id: "route-starters", date: "2026-08-07", claim: "implemented",
    text: "Content pages gained route-specific starters drawn from the page being read.",
    source: "git history; rosePrompts.ts" },
  { id: "page-context", date: "2026-08-10", claim: "implemented",
    text: "The current page and the selected starter's intent were added to Rose's inputs. Booking stayed available, no longer the subject of every question.",
    source: "rose-chat/index.ts (page, suggested)" },
  { id: "privacy-logging", date: null, claim: "implemented",
    text: "Questions are logged for up to 90 days without IP address or user agent, email and phone numbers are masked, and only Ivan can read them.",
    source: "/privacy; daily purge job" },
  { id: "booking-privacy", date: null, claim: "implemented",
    text: "Booking opens Ivan's calendar and records a minimal click event. No conversation transcript is sent with a booking.",
    source: "RoseBookingCard.tsx; rose-booking-notify returns 410" },
  { id: "one-step", date: null, claim: "implemented",
    text: "Rose runs one model step per answer with display-only tools (follow-up chips, booking card), which prevents repeated answers.",
    source: "rose-chat/index.ts stopWhen" },
  { id: "session-memory", date: null, claim: "implemented",
    text: "A conversation persists in the browser tab only, for up to 60 idle minutes, and can be cleared. There is no server-side transcript memory across visits.",
    source: "roseSession.ts" },
  { id: "measurement", date: null, claim: "implemented",
    text: "Product metrics are content-free aggregates in a private dashboard. They are never joined to general site analytics.",
    source: "AdminRose.tsx; migration 0003" },
  { id: "evaluation", date: null, claim: "synthetic",
    text: "Releases are gated by a 15-scenario synthetic check against the real model, with a risk-based release decision. Synthetic checks do not prove value to real visitors.",
    source: "scripts/rose-quality-check.ts; docs/rose-p5-verification.md" },
  { id: "feedback", date: null, claim: "hypothesis",
    text: "A future progressive question, 'Did Rose help you move your thinking forward?', may follow two completed answers. It is specified, not built.",
    source: "docs/rose-progressive-feedback-spec.md" },
  { id: "adaptive", date: null, claim: "hypothesis",
    text: "Ivan is exploring Rose as an adaptive content experience in which voice is one modality among several. Nothing in this direction is live.",
    source: "Rose design lab, Chapter 06" },
];

export const ROSE_LIMITS = [
  "Rose cannot see the visitor's screen, cursor or the page layout; she only receives the page address, title and section heading.",
  "Rose cannot read private repositories, run code or act outside the chat.",
  "Rose does not learn from conversations or redesign herself; changes are made by Ivan.",
  "Rose has no evidence about what visitors prefer; no visitor research has been run.",
];
