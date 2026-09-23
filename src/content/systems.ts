// One-line definitions of the shipped systems, used by the case study anchors
// block so a visitor landing directly on /lore knows what the rest is.
export type SystemAnchor = {
  slug: "sonor" | "atherix" | "tacet" | "lore" | "anima" | "peritia" | "orchestrator";
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
    what: "A food & beverage execution agent for hotels. It tells a manager how many covers to expect, how to staff for them, and how to cut food waste.",
    who: "Other agents via MCP, or a hotel / F&B manager with WhatsApp.",
    status: "Built, 0 real users, forecast in shadow mode, pilot partner in recruitment.",
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
    what: "A food & beverage execution agent for hotels. It tells a manager how many covers to expect, how to staff for them, and how to cut food waste.",
    who: "Other agents via MCP, or a hotel / F&B manager with WhatsApp.",
    status: "Built, 0 real users, forecast in shadow mode, pilot partner in recruitment.",
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
