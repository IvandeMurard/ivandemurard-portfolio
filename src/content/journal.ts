export type JournalCategory = "Product" | "Operations" | "Agentic AI" | "Field";

export type JournalEntry = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  category: JournalCategory;
  excerpt: string;
  body: string[]; // paragraphs
};

export type ReadingItem = {
  source: "Substack" | "Podcast" | "Article" | "Paper" | "Talk";
  title: string;
  author: string;
  url: string;
  take: string; // one-line point of view
  date: string;
};

// TODO: replace with real entries
export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    slug: "agent-boundaries-aetherix",
    title: "A hard call on Aetherix's agent boundaries",
    date: "2026-04-20",
    category: "Agentic AI",
    excerpt:
      "Where to draw the line between a forecasting model and an acting agent, and why splitting Prophet from Claude was the decision that shaped the rest of the architecture.",
    body: [
      "When you build an operations layer for boutique hotels, the temptation is to let one large model do everything: predict, decide, act. It looks elegant on a slide.",
      "In practice, it collapses. Forecasting and acting have different failure modes, different feedback loops, different audit requirements. So we split them. Prophet handles the read of the environment (occupancy, F&B demand, staffing pressure). Claude orchestrates the response, with the human always one click away from the loop.",
      "This is not a technical decision dressed up as a product one. It is a product decision that happens to need a specific architecture. The boundary is the experience.",
    ],
  },
];

// TODO: replace with real reading list
export const READING_LIST: ReadingItem[] = [
  {
    source: "Substack",
    title: "Placeholder essay on operations as product",
    author: "Author Name",
    url: "https://example.com",
    take: "Argues that the operating model is the product, and the UI is just its surface. Useful frame for hospitality tech.",
    date: "2026-03-12",
  },
  {
    source: "Podcast",
    title: "Placeholder podcast on agentic systems in regulated industries",
    author: "Host Name",
    url: "https://example.com",
    take: "The conversation about where the human stays in the loop is the right one. Skip the first 10 minutes.",
    date: "2026-02-04",
  },
  {
    source: "Article",
    title: "Placeholder article on field research for product teams",
    author: "Author Name",
    url: "https://example.com",
    take: "A reminder that you cannot design for an environment you have not stood inside.",
    date: "2026-01-21",
  },
];
