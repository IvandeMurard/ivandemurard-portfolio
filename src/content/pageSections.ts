// Section registry of the pages. Two readers:
// - the case-study pages, for their section rail (id + label);
// - Rose's source links, which label "/aetherix#where-it-stands" as "§ Where it stands" before the page loads.
// `heading` is the text of the heading as the page shows it; only sections with a heading are used for labels.
// `within` is the id of the section that holds a collapsible panel: arrival opens the panel and highlights it.
// A test renders every page and checks that each id exists and that its heading text matches (pageSections.test.tsx).
// Asset-free on purpose: the Rose dock imports it on every page.

export type PageSection = { id: string; label: string; heading?: string; within?: string };

const same = (id: string, label: string): PageSection => ({ id, label, heading: label });

export const AETHERIX_SECTIONS: PageSection[] = [
  same("in-one-minute", "In one minute"),
  same("the-problem", "The problem"),
  same("product-strategy", "Product strategy"),
  same("how-it-works", "How it works"),
  same("what-it-does-today", "What it does today"),
  same("where-it-stands", "Where it stands"),
  // A collapsible panel: its own summary text is its heading.
  { id: "the-numbers", label: "The numbers", heading: "The numbers", within: "where-it-stands" },
  same("how-its-built", "How it's built"),
  same("under-the-hood", "Under the hood"),
  same("talk-about-a-pilot", "Talk about a pilot"),
];

export const TACET_SECTIONS: PageSection[] = [
  { id: "overview", label: "Overview", heading: "From dashboard to anticipation" },
  { id: "problem", label: "Problem", heading: "RMS and PMS run on history." },
  { id: "solution", label: "Solution" },
  { id: "architecture", label: "Architecture", heading: "The intelligence pipeline" },
  { id: "pillars", label: "Pillars", heading: "Four pillars give Tacet its edge" },
  { id: "impact", label: "Impact", heading: "Impact, beyond yield" },
  { id: "synergy", label: "Synergy", heading: "Tacet and Aetherix" },
  { id: "horizon", label: "Horizon", heading: "Where Tacet is going" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
];

// The id "honesty" stays: links to it already exist.
export const LORE_SECTIONS: PageSection[] = [
  { id: "loss", label: "The loss", heading: "Not retrieval, elicitation." },
  { id: "modes", label: "Three modes", heading: "Capture, query, log. All by voice." },
  { id: "hangar", label: "The hangar", heading: "The hangar, 23:00." },
  { id: "thesis", label: "Same thesis", heading: "The same thesis as Aetherix, one industry over." },
  { id: "hazard", label: "The hazard", heading: "The hazard nobody else has." },
  { id: "admissible", label: "Admissible", heading: "What makes an answer admissible." },
  { id: "evaluation", label: "Evaluation", heading: "How we know it holds." },
  { id: "purpose", label: "What it is for", heading: "What it is for." },
  { id: "honesty", label: "Where it stands", heading: "Where it stands." },
  { id: "contact", label: "Stack & links", heading: "Stack and links." },
];

export const ANIMA_SECTIONS: PageSection[] = [
  same("the-questions", "The questions it exists to answer"),
  same("lineage", "Where it stands, and what the gate is for"),
  same("memory-layers", "One stay, four memory layers"),
  same("confidence", "Claims carry confidence, and confidence decays"),
  same("remembering", "Remembering is not neutral"),
  same("scope-gated", "Scope-gated, and it never decides"),
  same("in-the-architecture", "Where it sits in the architecture"),
];

export const ARCHITECTURE_SECTIONS: PageSection[] = [
  same("why-one-agent-is-not-enough", "Why several agents and not one"),
  same("one-scene-four-signals", "One scene, four signals"),
  same("the-nodes", "The five agents"),
  same("five-rules", "Five rules that hold it together"),
  same("what-each-node-learns", "What each node is allowed to learn"),
  same("where-twins-stop", "Where the sector's twins stop"),
  same("where-it-stands", "Verification and pointers"),
];

export const CV_SECTIONS: PageSection[] = [
  same("founder-builder", "Founder & Builder"),
  same("product-roles", "Product & Customer Roles"),
  same("skills", "Skills"),
  same("education", "Education"),
];

// The contact page has a single heading and no section a link can point at.
export const CONTACT_SECTIONS: PageSection[] = [];

/** Sonor's story, one block per heading. The page renders these titles; the rail and the labels read the same list. */
export const SONOR_NARRATIVE: ReadonlyArray<{ id: string; title: string }> = [
  { id: "what-happened", title: "What happened" },
  { id: "why-it-stopped", title: "Why it stopped" },
  { id: "what-id-change", title: "What I'd change" },
  { id: "what-i-applied-next", title: "What I applied next" },
  { id: "related-work", title: "Related work" },
];

/** Sonor's sections: the fixed ones around its narrative blocks. */
export const sonorSections = (narrative: ReadonlyArray<{ id: string; title: string }> = SONOR_NARRATIVE): PageSection[] => [
  { id: "hypothesis", label: "Prototype", heading: "Our first 2020 prototype" },
  { id: "product", label: "What it is", heading: "From prototype to MVP." },
  ...narrative.map((n) => same(n.id, n.title)),
  { id: "platform", label: "Platform", heading: "Explore the Platform" },
];

export const SONOR_SECTIONS: PageSection[] = sonorSections();

/** Pages that are not case studies in site.ts, with the title their layout gives them. */
export const OTHER_PAGE_TITLES: Record<string, string> = {
  "/architecture": "Hospitality Multi-Agent Architecture",
  "/cv": "CV",
  "/contact": "Contact",
};

/** The section lists by page path (Compass reads its own content tree; the Field Notes read the generated index). */
export const PAGE_SECTIONS: Record<string, PageSection[]> = {
  "/aetherix": AETHERIX_SECTIONS,
  "/tacet": TACET_SECTIONS,
  "/lore": LORE_SECTIONS,
  "/anima": ANIMA_SECTIONS,
  "/architecture": ARCHITECTURE_SECTIONS,
  "/cv": CV_SECTIONS,
  "/contact": CONTACT_SECTIONS,
  "/sonor": SONOR_SECTIONS,
};
