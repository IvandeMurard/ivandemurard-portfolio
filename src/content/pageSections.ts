// Section registry shared by the case-study pages (their section rail) and by Rose's source links,
// so a link to "/aetherix#where-it-stands" can be labelled with the section's own name before the page loads.
// Asset-free on purpose: the Rose dock imports it on every page.

export type PageSection = { id: string; label: string };

export const AETHERIX_SECTIONS: PageSection[] = [
  { id: "in-one-minute", label: "In one minute" },
  { id: "the-problem", label: "The problem" },
  { id: "product-strategy", label: "Product strategy" },
  { id: "how-it-works", label: "How it works" },
  { id: "what-it-does-today", label: "What it does today" },
  { id: "where-it-stands", label: "Where it stands" },
  { id: "how-its-built", label: "How it's built" },
  { id: "under-the-hood", label: "Under the hood" },
  { id: "talk-about-a-pilot", label: "Talk about a pilot" },
];

export const TACET_SECTIONS: PageSection[] = [
  { id: "overview", label: "Overview" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "architecture", label: "Architecture" },
  { id: "pillars", label: "Pillars" },
  { id: "impact", label: "Impact" },
  { id: "synergy", label: "Synergy" },
  { id: "horizon", label: "Horizon" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];
