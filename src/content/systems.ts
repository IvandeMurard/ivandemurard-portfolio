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
    status: "Built and instrumented, pilot partner in recruitment.",
  },
  {
    slug: "tacet",
    name: "Tacet",
    to: "/tacet",
    what: "Headless environmental twin: street, weather and crowd signals turned into yield rules, exposed via MCP.",
    who: "RMS, PMS and orchestration agents, not humans.",
    status: "Prototype.",
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
    what: "Guest node: memory that makes every guest a regular, anticipating needs and learning from every stay without watching.",
    who: "The nodes that need to know who is arriving.",
    status: "Synthetic proof of concept, production gated behind a data-protection assessment.",
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
 * The five nodes of the mesh, as presented on /architecture. Anima and the
 * Orchestrator have no case study of their own, so this is the only place
 * they are introduced.
 */
export const MESH_ANCHORS: SystemAnchor[] = [
  {
    slug: "atherix",
    name: "Aetherix",
    to: "/aetherix",
    what: "A food & beverage execution agent for hotels. It tells a manager how many covers to expect, how to staff for them, and how to cut food waste.",
    who: "Other agents via MCP, or a hotel / F&B manager with WhatsApp.",
    status: "Built and instrumented, on staging, pilot partner in recruitment.",
  },
  {
    slug: "tacet",
    name: "Tacet",
    to: "/tacet",
    what:
      "The environmental node. Turns street, weather and event signals into structured risk the other nodes can act on.",
    who: "Other agents, through MCP, not humans.",
    status: "Built, public repository.",
  },
  {
    slug: "anima",
    name: "Anima",
    to: "/anima",
    what:
      "The guest node. Memory that makes every guest a regular: it anticipates needs and learns from every stay, without watching.",
    who: "The nodes that need to know who is arriving.",
    status: "Synthetic proof of concept, production gated behind a data-protection assessment.",
  },
  {
    slug: "peritia",
    name: "Peritia",
    what: "The trade agent. A house's know-how, held by the house rather than by whoever is on shift.",
    who: "The people who work in a property, and the agents that need what they know.",
    status: "Named in the contract, not started.",
  },
  {
    slug: "orchestrator",
    name: "Orchestrator",
    what: "The supervisory agent. Routes between the others and holds the decision.",
    who: "The mesh itself.",
    status: "Design; a stub exists.",
  },
  {
    slug: "lore",
    name: "Lore",
    to: "/lore",
    what:
      "A voice AI mentor that captures, qualifies, and leverages the tacit expertise from senior to junior collaborators. Just ask. Not part of this mesh; the same pattern in aviation maintenance, where a licensed technician signs the release.",
    who: "A junior technician on the shop floor, hands busy.",
    status: "Here as evidence the pattern holds outside hospitality.",
  },
];
