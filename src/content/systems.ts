// One-line definitions of the four shipped systems, used by the case study
// anchors block so a visitor landing directly on /lore knows what the rest is.
export type SystemAnchor = {
  slug: "sonor" | "atherix" | "tacet" | "lore";
  name: string;
  to: string;
  what: string;
  who: string;
  status: string;
};

export const SYSTEM_ANCHORS: SystemAnchor[] = [
  {
    slug: "atherix",
    name: "Aetherix",
    to: "/aetherix",
    what: "F&B execution agent: tomorrow's covers, a staffing grid that fits, waste flagged, one WhatsApp message a day.",
    who: "Boutique hotel F&B and operations managers.",
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
    what: "Voice mentor that captures what a retiring technician never wrote down and returns it on the shop floor.",
    who: "Junior aviation maintenance technicians.",
    status: "Prototype, synthetic data, harness in CI.",
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
