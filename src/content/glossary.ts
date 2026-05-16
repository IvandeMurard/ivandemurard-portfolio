/**
 * Contextual glossary used by the <Term> component on case study pages.
 * One self-sufficient definition per concept. 20 to 45 words.
 * No em-dashes (project rule). Tone: calm, plain, business-first. English first.
 */

export type GlossaryEntry = {
  id: string;
  term: string;
  brief: string;
};

export const GLOSSARY: Record<string, GlossaryEntry> = {
  // Shared
  saas: {
    id: "saas",
    term: "SaaS",
    brief:
      "Software as a Service. The product is hosted in the cloud and accessed through a subscription, with no install and continuous updates shipped by the vendor.",
  },
  b2g: {
    id: "b2g",
    term: "B2G",
    brief:
      "Business to Government. Selling to public bodies like cities, ministries, or agencies. Sales cycles are longer, often tender-driven, and tied to political timing rather than to a private buyer.",
  },
  mvp: {
    id: "mvp",
    term: "MVP",
    brief:
      "Minimum Viable Product. The smallest honest version of a product, put in front of real users to test the riskiest assumption and learn before investing further.",
  },
  openData: {
    id: "openData",
    term: "open data",
    brief:
      "Datasets, often produced by public administrations, released for free reuse under permissive licences. They include traffic counts, building permits, weather, and noise measurements that small teams can build on.",
  },

  // Aetherix / hospitality
  pms: {
    id: "pms",
    term: "PMS",
    brief:
      "Property Management System. The hotel's system of record for reservations, room status, check-in and check-out, billing, and guest history. Anything that acts on operations needs a clean path to the PMS.",
  },
  rms: {
    id: "rms",
    term: "RMS",
    brief:
      "Revenue Management System. The software that sets room rates based on occupancy, demand, events, and competitor pricing. Plugging external context like noise risk into it turns environment into a pricing decision.",
  },
  agenticAi: {
    id: "agenticAi",
    term: "agentic AI",
    brief:
      "An AI system designed to act, not just answer. It can plan steps, call tools and APIs, observe the result, and adjust, while a human stays in the loop for the final call.",
  },
  fnb: {
    id: "fnb",
    term: "F&B",
    brief:
      "Food and Beverage. The part of hotel operations covering restaurant, bar, room service, breakfast, and catering. Hard to forecast: too much prep means waste, too little means a disappointed guest.",
  },
  humanInTheLoop: {
    id: "humanInTheLoop",
    term: "human-in-the-loop",
    brief:
      "A design pattern where the system recommends and a person validates before action ships. It keeps accountability with the team and captures local expertise that a model cannot see.",
  },
  rag: {
    id: "rag",
    term: "RAG",
    brief:
      "Retrieval Augmented Generation. The system first fetches relevant context from a knowledge base, then conditions its answer on that evidence, so a recommendation can be traced back to past cases.",
  },
  mcp: {
    id: "mcp",
    term: "MCP",
    brief:
      "Model Context Protocol. An open standard that lets AI agents connect to tools, databases, and APIs through a uniform interface, so an agent becomes composable across systems instead of bespoke per integration.",
  },

  // Tacet / acoustic
  headless: {
    id: "headless",
    term: "headless",
    brief:
      "A product with no interface of its own. It pushes structured signals into the tools where decisions already happen, instead of asking users to watch yet another dashboard.",
  },
  syntheticAcousticTwin: {
    id: "syntheticAcousticTwin",
    term: "synthetic acoustic twin",
    brief:
      "A software model that simulates how sound propagates from streets, construction, and events to specific rooms, built from physics and public data rather than rooftop sensors.",
  },
  apiFirst: {
    id: "apiFirst",
    term: "API-first",
    brief:
      "An architecture where the API is the primary product. Every capability ships as a clean documented endpoint from day one, and any UI is just one consumer among others.",
  },
  jsonAlerts: {
    id: "jsonAlerts",
    term: "JSON alerts",
    brief:
      "Structured, machine-readable notifications. Instead of an email or a dashboard ping, the signal arrives as data that the RMS or PMS can route, filter, and act on automatically.",
  },
  proxyData: {
    id: "proxyData",
    term: "proxy data",
    brief:
      "Public signals used as indirect indicators of something harder to measure. Construction permits proxy for future noise, traffic for street disturbance, weather for window-open behaviour.",
  },
  yield: {
    id: "yield",
    term: "yield management",
    brief:
      "Adjusting price and allocation in real time to extract the most revenue from a perishable inventory like hotel rooms, by blending demand forecasts, segmentation, and competitive context.",
  },
};

export function getEntry(id: string): GlossaryEntry | undefined {
  return GLOSSARY[id];
}
