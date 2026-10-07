export const COMPASS = {
  name: "Compass",
  classification: "Standalone project",
  mcp: "https://www.npmjs.com/package/paris-compass-mcp",
  headline: "Every address has a story. Compass reads it before you sign.",
  subhead: "Open data turned into traceable, address-level context for commercial location decisions in Paris.",
  label: "Data product · Commercial premises · Paris · 2026",
  role: "Product and data design, built by directing AI coding agents.",
  status: "Corpus and MCP server live. Web demo on a frozen sample (17th arrondissement).",
  demo: "https://paris-compass.lovable.app",
  repo: "https://github.com/IvandeMurard/paris-compass",
  command: "npx -y paris-compass-mcp",
  schedule: "https://cal.com/ivandemurard/discussion-and-introduction",
} as const;

export type CompassBlock =
  | { kind: "paragraph"; text: string; bold?: boolean }
  | { kind: "list"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][] }
  | { kind: "code" }
  | { kind: "figure"; figure: "timeline" | "readers" | "confidence"; caption: string; description: string };

export type CompassSection = { title: string; id: string; status?: string; blocks: CompassBlock[]; subsections?: CompassSection[] };

export const COMPASS_SECTIONS: CompassSection[] = [
  {
    title: "One address, three questions", id: "one-address-three-questions",
    blocks: [
      { kind: "paragraph", text: "You are standing in front of an empty shopfront. The agent says the street is lively." },
      { kind: "list", items: [
        "What was here? A florist in 2017, a florist in 2020, gone by 2023.",
        "Is the street dying or churning? Rue d'Argout turned over half its shops in three years, and refilled its three empty units.",
        "What did people pay? The median Paris goodwill sells between 160,000 and 170,000 €. A café goes for 220,000 €, a clothing shop for 86,000 €.",
      ] },
      { kind: "figure", figure: "timeline", caption: "One address across three censuses. Illustrative.", description: '2017: Florist → 2020: Florist → 2023: No longer a shop.' },
    ],
  },
  {
    title: "Product strategy", id: "product-strategy",
    blocks: [{ kind: "paragraph", bold: true, text: "Join public data at the address, and refuse what cannot be verified." }],
    subsections: [
  {
    title: "The problem", id: "the-problem",
    blocks: [
      { kind: "paragraph", text: "An entrepreneur chooses a shopfront on one visit, a hunch about passing trade, and what the landlord says. Listings describe the unit: floor area, rent, photos. Nothing describes the street." },
      { kind: "paragraph", text: "More than 2,000 goodwill sales are published with their price in Paris every year. Each one is a decision made with that little." },
    ],
  },
  {
    title: "The bet", id: "the-bet",
    blocks: [
      { kind: "paragraph", text: "The answer is already public, in pieces nobody joins at the address:" },
      { kind: "list", items: [
        "three door-to-door censuses of every Paris shopfront (APUR, 2017, 2020, 2023);",
        "legal notices of goodwill sales and insolvencies (BODACC);",
        "the business register (INSEE Sirene).",
      ] },
      { kind: "paragraph", text: "Compass joins them: 85,418 units, each figure with its source, licence and date." },
    ],
  },
  {
    title: "What it refuses", id: "what-it-refuses",
    blocks: [{ kind: "table", head: ["Refused", "What that buys"], rows: [
      ["A single score out of 100", "A bakery wants footfall, a yoga studio wants quiet. One score averages that away."],
      ["A rent estimate", "Honesty on the number everyone wants. No open dataset of commercial rents exists in France."],
      ["Brokers as users", "Depth for one person studying one address. Brokers get the API."],
      ["Any figure without a cited public source", "A claim the reader can re-derive, including against Compass."],
    ] }],
  },
  {
    title: "Against what exists", id: "against-what-exists",
    blocks: [
      { kind: "table", head: ["Existing tool", "What it answers", "What it leaves out"], rows: [
        ["Listing portals", "What is on the market today", "What the street did before, and what is about to come free"],
        ["Footfall vendors", "How many people pass", "A modelled figure from a phone panel the buyer cannot inspect"],
        ["Broker platforms", "Many locations, compared in bulk", "One address, read in depth by the person who will sign"],
      ] },
      { kind: "paragraph", text: "Compass sits upstream of the listing: a business that has ceased trading or entered insolvency is public months before any advert." },
    ],
  },
    ],
  },
  {
    title: "Where AI sits", id: "where-ai-sits", status: "Design, planned for Q4 2026.",
    blocks: [
      { kind: "paragraph", text: "AI stays out of the scoring core, which is deterministic and replayable. It works above it: reading legal notices, matching a sale to one of several shopfronts at the same address, explaining a result for a given trade. Everything it produces is labelled derived or probable, never established." },
      { kind: "paragraph", text: 'Ruled out: a generated rent or revenue, a probability of success, a score "explained by AI".' },
    ],
  },
  {
    title: "One core, two readers", id: "one-core-two-readers",
    blocks: [
      { kind: "paragraph", text: "The same figures reach a person on the map and an agent over MCP." },
      { kind: "code" },
      { kind: "paragraph", text: "Six tools, read-only, published on npm and the MCP registry." },
      { kind: "figure", figure: "readers", caption: "One core, two readers.", description: "Public sources (APUR BDCom, BODACC, INSEE Sirene) → One scoring core → Map, for a person / MCP server, for an agent." },
    ],
  },
  {
    title: "How sure is it?", id: "how-sure-is-it",
    blocks: [
      { kind: "paragraph", text: "Every figure is checked against automatic rules before it ships, every day." },
      { kind: "paragraph", text: 'Each one carries one of four confidence levels. About half the corpus is certain. A third stays "probable", because public sources name an address and several shopfronts often share it. The product says so on screen.' },
      { kind: "figure", figure: "confidence", caption: "Confidence levels across the corpus, measured 6 October 2026.", description: "Established 51% · Corroborated 6% · Probable 37% · Undetermined 6%." },
    ],
  },
  {
    title: "Where it stands", id: "where-it-stands",
    blocks: [{ kind: "table", head: ["Component", "State"], rows: [
      ["Corpus and evaluation", "Live"],
      ["MCP server", "Published"],
      ["Web demo", "Frozen sample, 17th arrondissement"],
      ["Demo on the live corpus", "In progress"],
      ["AI layer", "Design"],
    ] }],
  },
];