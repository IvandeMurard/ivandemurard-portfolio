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

export const COMPASS_CONFIDENCE = {
  Established: "The source names this premise directly, and the record is attached.",
  Corroborated: "Two independent public sources place the business here; neither names the premise.",
  Probable: "The fact is documented, but tying it to this premise is inferred.",
  Undetermined: "The source is silent, and says so.",
} as const;

export type CompassConfidence = keyof typeof COMPASS_CONFIDENCE;

export const COMPASS_TIMELINE: Array<{ date: string; event: string; amount?: string; confidence: CompassConfidence; withheld?: boolean }> = [
  { date: "2017", event: "Census · Withheld, licence not cleared", confidence: "Undetermined", withheld: true },
  { date: "Aug 2017", event: "Goodwill sold", amount: "€100,000", confidence: "Probable" },
  { date: "Mar 2019", event: "Goodwill sold", amount: "€95,000", confidence: "Probable" },
  { date: "Jul 2019", event: "Goodwill sold", amount: "€450,000", confidence: "Probable" },
  { date: "2020", event: "Census · Withheld, licence not cleared", confidence: "Undetermined", withheld: true },
  { date: "Aug 2021", event: "Goodwill sold", amount: "€87,500", confidence: "Probable" },
  { date: "2023", event: "Census · Asian restaurant", confidence: "Established" },
  { date: "Oct 2023", event: "Goodwill sold", amount: "€175,000", confidence: "Probable" },
  { date: "Jun 2024", event: "Goodwill sold", amount: "€120,000", confidence: "Probable" },
];

export const COMPASS_AGENT_EXCERPT = `{
  "occurred_on": "2021-08-05",
  "source": "BODACC cession",
  "source_licence": "Licence Ouverte",
  "kind": "sale",
  "amount_eur": 87500,
  "evidence": "Fonds acquis par achat au prix stipulé de 87500,00 euros.",
  "confidence": "probable",
  "confidence_reason": "2 locaux partagent cette adresse : lequel est concerné n'est pas publié"
}`;

export type CompassBlock =
  | { kind: "paragraph"; text: string; bold?: boolean }
  | { kind: "list"; items: string[] }
  | { kind: "table"; head: string[]; rows: string[][]; monospaceFirstColumn?: boolean }
  | { kind: "code"; label?: string; content?: string; language?: "json" | "sh"; caption?: string }
  | { kind: "confidenceLegend" }
  | { kind: "link"; text: string; href: string }
  | { kind: "figure"; figure: "timeline" | "readers" | "confidence"; caption: string; description: string };

export type CompassSection = { title: string; id: string; status?: string; blocks: CompassBlock[]; subsections?: CompassSection[] };

export const COMPASS_SECTIONS: CompassSection[] = [
  {
    title: "One address, read in context", id: "one-address-three-questions",
    blocks: [
      { kind: "paragraph", bold: true, text: "10 rue Mandar, Paris 2e. What public data says about it, exactly as the Compass server returned it on 7 October 2026." },
    ],
    subsections: [
      {
        title: "The address", id: "the-address",
        blocks: [
          { kind: "paragraph", bold: true, text: "Six goodwill sales in seven years." },
          { kind: "figure", figure: "timeline", caption: "10 rue Mandar, Paris 2e. Sources: APUR BDCom 2023 (ODbL), BODACC (Licence Ouverte). Retrieved 7 October 2026.", description: "Nine dated records from 2017 to 2024, including two deliberately withheld census rows, six goodwill sales, and the established 2023 census record." },
          { kind: "paragraph", text: "Why Probable: two shopfronts share this street number, and the legal notice does not say which one was sold." },
          { kind: "paragraph", text: "Three insolvency notices also carry this address. They give a company's registered office, not the shop, and are flagged as such." },
          { kind: "confidenceLegend" },
          { kind: "paragraph", text: "Compass also measures how many businesses of a given trade are still trading six years later, neighbourhood by neighbourhood. Those figures rest on the 2017 census and stay withheld until its licence is cleared." },
        ],
      },
      {
        title: "The surroundings", id: "the-surroundings",
        blocks: [
          { kind: "paragraph", bold: true, text: "Dense commercial fabric, sustained passing trade, strong rail access, many shops and services within walking distance." },
          { kind: "paragraph", text: "The server's own one-sentence reading of the 800 m around the address, translated from French." },
        ],
      },
      {
        title: "Against another address", id: "against-another-address",
        blocks: [
          { kind: "paragraph", bold: true, text: "Context only means something by comparison." },
          { kind: "table", head: ["Axis (score out of 100)", "10 rue Mandar, 2e", "A residential point, 20e"], rows: [
            ["Commercial density", "95", "82"],
            ["Shops and services within walking distance", "64", "22"],
            ["Food shops", "61", "22"],
            ["Rail access", "60", "70"],
            ["Passing trade (estimate)", "83", "78"],
            ["Road noise exposure (modelled)", "51", "100"],
          ] },
          { kind: "paragraph", bold: true, text: "On road noise, the residential point comes out twice as exposed: 100 against 51. This is a model built from the major roads within 500 m, not a measurement." },
          { kind: "paragraph", text: "Six other axes (schools, healthcare, groceries, parks, transit, walkability) reach the ceiling at both points, as they do across much of central Paris. The server excludes them from the comparison instead of presenting them as a difference." },
        ],
      },
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
        "the licensed 2023 door-to-door census of every Paris shopfront (APUR);",
        "legal notices of goodwill sales and insolvencies (BODACC);",
        "the business register (INSEE Sirene).",
      ] },
      { kind: "paragraph", text: "Earlier census records stay withheld until their licence is cleared." },
      { kind: "paragraph", text: "Compass joins them: APUR BDCom 2023 shopfront census · BODACC legal notices · INSEE Sirene · 85,418 units · every figure with its source, licence and date." },
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
    title: "Built for people and AI agents", id: "one-core-two-readers", status: "Agent-ready · MCP server published · six tools · read-only",
    blocks: [
      { kind: "paragraph", bold: true, text: "One scoring core. A person reads it on a map, an AI agent queries it directly." },
      { kind: "figure", figure: "readers", caption: "The same core serves both.", description: "Public sources (APUR BDCom, BODACC, INSEE Sirene) → One scoring core → Map, for a person / MCP server, for an agent." },
      { kind: "table", head: ["Tool", "What it answers"], monospaceFirstColumn: true, rows: [
        ["trace_premise", "What happened at this address, year by year"],
        ["find_premises", "Which shopfronts sit near this point"],
        ["score_location", "How this location scores, axis by axis"],
        ["compare_locations", "How two locations differ"],
        ["explain_score", "Why one score is what it is"],
        ["list_sources", "Which datasets, licences and dates are behind it"],
      ] },
      { kind: "code", label: "What an agent receives", content: COMPASS_AGENT_EXCERPT, language: "json", caption: "One row of trace_premise for 10 rue Mandar, excerpt. Same fact, same source, same confidence level as in the timeline above." },
      { kind: "paragraph", text: "An agent gets no shortcut: same figures, same sources, same confidence levels as the person." },
      { kind: "code", label: "Try it", language: "sh" },
    ],
  },
  {
    title: "How sure is it?", id: "how-sure-is-it",
    blocks: [
      { kind: "paragraph", text: "Every figure is checked against automatic rules before it ships, every day." },
      { kind: "paragraph", text: 'Each one carries one of four confidence levels. About half the corpus is certain. A third stays "probable", because public sources name an address and several shopfronts often share it. The product says so on screen.' },
      { kind: "link", text: "Read the four confidence definitions in Sec. 01.", href: "#confidence-legend" },
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
    ] },
      { kind: "paragraph", text: "Data attribution: Base de données des commerces et services de Paris (BDCom) 2023, © APUR, licensed under the Open Database License (ODbL 1.0). BODACC and INSEE Sirene: Licence Ouverte 2.0 (Etalab)." },
    ],
  },
];