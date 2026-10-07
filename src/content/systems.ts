// One-line definitions of the shipped systems, used by the case study anchors
// block so a visitor landing directly on /lore knows what the rest is.
export type SystemAnchor = {
  slug: "sonor" | "atherix" | "tacet" | "lore" | "anima" | "compass" | "peritia" | "orchestrator" | "architecture";
  name: string;
  /** Omitted for systems with no page of their own. Rendered unlinked. */
  to?: string;
  what: string;
  who: string;
  status: string;
};


export const SYSTEM_ANCHORS: SystemAnchor[] = [
  {
    slug: "atherix",
    name: "Aetherix",
    to: "/aetherix",
    what: "The F&B agent for boutique hotels: one WhatsApp message a day with tomorrow's covers and staffing, and the outcome recorded next to the manager's reply.",
    who: "Other agents via MCP, or a hotel / F&B manager with WhatsApp.",
    status: "Built. Running on sandbox and public data. No hotel connected yet.",
  },
  {
    slug: "tacet",
    name: "Tacet",
    to: "/tacet",
    what: "Headless environmental twin: street, weather and crowd signals turned into yield rules, exposed via MCP.",
    who: "RMS, PMS and orchestration agents, not humans.",
    status: "Built, maintenance mode since July 2026.",
  },
  {
    slug: "lore",
    name: "Lore",
    to: "/lore",
    what: "A voice AI mentor that captures, qualifies, and leverages the tacit expertise from senior to junior collaborators. Just ask.",
    who: "A junior technician on the shop floor, hands busy.",
    status: "Prototype, synthetic data, harness in CI.",
  },
  {
    slug: "anima",
    name: "Anima",
    to: "/anima",
    what: "Guest memory node: it keeps what a guest said and what happened, so nobody has to ask twice, without watching.",
    who: "The nodes that need to know who is arriving.",
    status: "Synthetic PoC, production gated behind a data-protection assessment.",
  },
  {
    slug: "sonor",
    name: "Sonor",
    to: "/sonor",
    what: "Open-data SaaS mapping urban noise so cities can act on acoustic health.",
    who: "European cities and metropolitan areas.",
    status: "Shipped 2020 to 2022, company closed.",
  },
];

/**
 * Compass, standalone: not a node of the hospitality architecture. Used as an
 * entries override on /compass only, so its own card is marked there without
 * adding Compass to the "Where this sits" block of the other case studies.
 */
export const COMPASS_ANCHOR: SystemAnchor = {
  slug: "compass",
  name: "Compass",
  to: "/compass",
  what: "Address-level context for commercial location decisions in Paris, joined from public open data and served to a person on a map and to agents over MCP.",
  who: "A person studying one address, or an agent over MCP.",
  status: "Corpus and MCP server live; web demo on a frozen sample (17th arrondissement).",
};

/**
 * The five nodes of the architecture, as presented on /architecture. Peritia and
 * the Orchestrator have no case study of their own, so this is the only place
 * they are introduced. Lore is deliberately absent: it is a standalone
 * aviation project, not a node of this architecture.
 */
export const MESH_ANCHORS: SystemAnchor[] = [
  {
    slug: "atherix",
    name: "Aetherix",
    to: "/aetherix",
    what: "The F&B agent for boutique hotels: one WhatsApp message a day with tomorrow's covers and staffing, and the outcome recorded next to the manager's reply.",
    who: "Other agents via MCP, or a hotel / F&B manager with WhatsApp.",
    status: "Built. Running on sandbox and public data. No hotel connected yet.",
  },
  {
    slug: "tacet",
    name: "Tacet",
    to: "/tacet",
    what:
      "The environmental node. Turns street, weather and event signals into structured risk the other nodes can act on.",
    who: "Other agents, through MCP, not humans.",
    status: "Built, maintenance mode since July 2026.",
  },
  {
    slug: "anima",
    name: "Anima",
    to: "/anima",
    what:
      "The guest memory node. It keeps what a guest said and what happened, so nobody has to ask twice, without watching.",
    who: "The nodes that need to know who is arriving.",
    status: "Synthetic PoC, production gated behind a data-protection assessment.",
  },
  {
    slug: "peritia",
    name: "Peritia",
    what: "The trade agent. A house's know-how, held by the house rather than by whoever is on shift.",
    who: "The people who work in a property, and the agents that need what they know.",
    status: "Design. Named in the contract, no code.",
  },
  {
    slug: "orchestrator",
    name: "Orchestrator",
    what: "The supervisory agent. Routes between the others and holds the decision.",
    who: "The architecture itself.",
    status: "Design. A proto-stub exists.",
  },
];

/** "Where this sits" on /aetherix: the architecture and the nodes it works with. */
export const AETHERIX_ANCHORS: SystemAnchor[] = [
  {
    slug: "architecture",
    name: "Architecture",
    to: "/architecture",
    what: "Hospitality Multi-Agent Architecture: an orchestrator and domain agents, connected through MCP.",
    who: "The reader who wants the whole picture.",
    status: "Design, with built nodes.",
  },
  ...MESH_ANCHORS.filter((a) => ["atherix", "anima", "tacet"].includes(a.slug)),
];
