export type RoseStatus = "paused" | "live";

/**
 * Rose answers only when "live". When "paused" (the Lovable AI gateway has no credits) the dock calls neither
 * rose-chat nor rose-event, hides the input and the starters, and shows the notice below.
 */
export const ROSE_STATUS: RoseStatus = "paused";

export const ROSE_PAUSED = {
  text: "Rose has run out of credits and will be back soon. The case studies and the CV answer most questions. For anything else, contact me.",
  links: [
    { label: "CV", href: "/cv" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
