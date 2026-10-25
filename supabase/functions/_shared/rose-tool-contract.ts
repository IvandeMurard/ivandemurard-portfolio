/** Shared, runtime-equivalent Rose tool descriptions.
 * The synthetic harness must use the same tool contracts as the edge handler.
 * UI-only tools have no execute callback; the visitor triggers any booking.
 */
export const ROSE_BOOKING_TOOL_DESCRIPTION =
  "Render a booking CTA card in the chat when the visitor's intent is clear enough to warrant a 30-minute call with Ivan. No execute: the human clicks the rendered card.";

export const ROSE_FOLLOWUPS_TOOL_DESCRIPTION =
  "Optional, call at most once, after the answer text. Up to two short follow-up questions in the visitor's voice (imperative, never 'Ivan' in the third person), each about content that exists on this site. Rendered as chips under the answer.";
