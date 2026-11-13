/**
 * Chapter 06 · "How Rose works": the loop (canvas board F, variant B). Copy is final and verbatim from
 * docs/rose-case-study-copy-v2.md. The component (HowRoseWorks.tsx) and the Markdown mirror both read this
 * file, so the page and the mirror cannot say different things.
 */
export const HOW_ROSE_WORKS = {
  label: "How Rose works: a loop of five steps around the site's text",
  rules: [
    { title: "Tested before every release", text: "Each change runs on fixed questions. A critical failure blocks it.", icon: "check" },
    { title: "Questions kept 90 days", text: "Contact details are masked before they are stored.", icon: "lock" },
  ],
  centre: {
    /** Shown before the title in the list layout only. */
    pre: "At the centre: ",
    title: "The site's text",
    text: "Case studies, Field Notes, CV. The same text AI agents read through the MCP server.",
  },
  steps: [
    { n: "01", title: "You read a page", text: "The section in view and the passages Ivan marked travel with your question." },
    { n: "02", title: "You ask in the dock", text: "In your words, or with a starter question written for that page." },
    { n: "03", title: "Rose reads the site", text: "A language model, under rules Ivan wrote: answer from the pages, cite them." },
    { n: "04", title: "She answers with sources", text: "With follow-up questions, and the booking line on a profile question.", tags: ["Next: relations", "Next: diagrams"] },
    { n: "05", title: "A source opens the passage", text: "Highlighted, with a way back to where you were." },
  ],
  caption: "How Rose works. Solid lines are built; dashed lines are design.",
} as const;
