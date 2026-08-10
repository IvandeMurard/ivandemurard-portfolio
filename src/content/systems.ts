// One-line definitions of the shipped systems, used by the case study anchors
// block so a visitor landing directly on /lore knows what the rest is.
export type SystemAnchor = {
  slug: "sonor" | "atherix" | "tacet" | "lore" | "anima" | "orchestrator";
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
    status: "Built, pilot testing.",
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
    what: "Guest node: a four-layer temporal memory of a guest relationship, with decay and a scope gate built in.",
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
    status: "Built, on staging, zero real users.",
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
      "The guest node. A four-layer temporal memory of a guest relationship, so a returning guest does not have to repeat themselves.",
    who: "The nodes that need to know who is arriving.",
    status: "Synthetic proof of concept, production gated behind a data-protection assessment.",
  },
  {
    slug: "orchestrator",
    name: "Orchestrator",
    what: "The supervisory node. Routes between the others and holds the decision.",
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
