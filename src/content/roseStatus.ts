export type RoseStatus = "paused" | "live";

/**
 * Rose answers only when "live". When "paused" (the Lovable AI gateway has no credits) the dock calls neither
 * rose-chat nor rose-event, hides the input and the starters, and shows the notice below.
 */
export const ROSE_STATUS: RoseStatus = "live";

export const ROSE_PAUSED = {
  text: "Rose has run out of credits and will be back soon. The case studies and the CV answer most questions. For anything else, contact me.",
  links: [
    { label: "CV", href: "/cv" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

/** Shown instead of an empty bubble when an assistant turn ends with no text (only tool calls). Front end only. */
export const ROSE_EMPTY_ANSWER = "I could not write an answer this time. The [CV](/cv) and the case studies have the details.";
