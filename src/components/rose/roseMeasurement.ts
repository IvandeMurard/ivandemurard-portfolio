import { logRoseEvent } from "./roseEvents";

export const REFERENCE_ROUTES = new Set([
  "/", "/aetherix", "/tacet", "/anima", "/compass", "/sonor", "/lore",
  "/architecture", "/cv", "/atrium", "/journal", "/contact", "/agents",
  "/journal/harnesses-graders-closed-loops", "/journal/agent-boundaries-aetherix",
  "/journal/whose-truth-is-the-ground-truth",
]);

/** Only known portfolio destinations, never query strings, external URLs or free text. */
export const referencePath = (href: string): string | null => {
  try {
    const url = new URL(href, "https://ivandemurard.com");
    if (!["https://ivandemurard.com", "https://www.ivandemurard.com"].includes(url.origin)) return null;
    const path = url.pathname.replace(/\/$/, "") || "/";
    return REFERENCE_ROUTES.has(path) ? path : null;
  } catch { return null; }
};

type Pending = { session_id: string; path: string; request_id: string };
let pending: Pending | null = null;
const proposed = new Set<string>();

/** Owned outside React: remounts and rehydration never create measurement events. */
export const startRoseRequest = (session_id: string, path: string) => {
  pending = { session_id, path, request_id: crypto.randomUUID() };
  logRoseEvent({ ...pending, kind: "rose_request_started" });
};
export const finishRoseRequest = (failed: boolean) => {
  if (!pending) return;
  const event = pending;
  pending = null;
  logRoseEvent({ ...event, kind: failed ? "rose_answer_failed" : "rose_answer_completed" });
};
export const logBookingProposal = (session_id: string, path: string, messageId: string) => {
  if (proposed.has(messageId)) return;
  proposed.add(messageId);
  // Bound memory without affecting the current 60-message conversation.
  if (proposed.size > 200) proposed.delete(proposed.values().next().value ?? "");
  logRoseEvent({ session_id, path, kind: "booking_proposed", request_id: messageId });
};