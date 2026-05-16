/**
 * Contextual glossary used by the <Term> component on case study pages.
 * One entry per concept. brief: 12 to 30 words. detail: 40 to 80 words.
 * No em-dashes (project rule). Tone: calm, plain, business-first.
 */

export type GlossaryEntry = {
  id: string;
  term: string;
  brief: string;
  detail: string;
  link?: { label: string; href: string; external?: boolean };
};

export const GLOSSARY: Record<string, GlossaryEntry> = {
  // Shared
  saas: {
    id: "saas",
    term: "SaaS",
    brief: "Software as a Service. The product runs in the cloud, customers pay a subscription, no install needed.",
    detail:
      "Short for Software as a Service. Instead of selling a one-off license, the vendor hosts the software, ships updates continuously, and charges a recurring fee. For buyers it lowers the cost of entry and shifts maintenance to the vendor. For builders it means the product is never really finished, every release is a chance to learn from real usage.",
  },
  b2g: {
    id: "b2g",
    term: "B2G",
    brief: "Business to Government. Selling to public bodies like cities, ministries, or agencies, not to private companies.",
    detail:
      "Business to Government. The buyer is a public organisation: a city hall, a metropolitan authority, a ministry. Sales cycles are longer and more procedural than B2B, often involving tenders and political timing. The upside is mission alignment and recurring contracts; the downside is the cash runway needed to survive the wait.",
  },
  mvp: {
    id: "mvp",
    term: "MVP",
    brief: "Minimum Viable Product. The smallest version that can be put in front of real users to test a real assumption.",
    detail:
      "Minimum Viable Product. Not a half-finished prototype, but the smallest honest product that lets you test the riskiest assumption with real users. The goal is learning, not impressing. A good MVP feels uncomfortably small; a bad one tries to look like the full vision and learns nothing.",
  },
  openData: {
    id: "openData",
    term: "open data",
    brief: "Data published freely by public bodies for anyone to reuse, often via APIs or downloadable files.",
    detail:
      "Datasets, often produced by public administrations, that are released for free reuse under permissive licences. In Europe this includes traffic counts, building permits, weather observations, noise measurements, and more. Open data is the raw material that lets small teams build credible products without owning the sensors themselves.",
  },

  // Aetherix / hospitality
  pms: {
    id: "pms",
    term: "PMS",
    brief: "Property Management System. The hotel's operating system: reservations, rooms, check-in, billing, guest profiles.",
    detail:
      "Property Management System. The software a hotel uses to run day-to-day operations: reservations, room status, check-in and check-out, billing, guest history. It is the system of record. Anything that wants to act on hotel operations, including an AI agent, needs a clean read and write path to the PMS.",
  },
  rms: {
    id: "rms",
    term: "RMS",
    brief: "Revenue Management System. The pricing brain that adjusts room rates based on demand, events, and competition.",
    detail:
      "Revenue Management System. The software that decides how much a room should cost tonight, tomorrow, next month. It reads occupancy, market signals, events, and competitor pricing, then suggests or applies rate changes. Plugging external context like weather or construction noise into the RMS is how environmental risk becomes a pricing decision.",
  },
  agenticAi: {
    id: "agenticAi",
    term: "agentic AI",
    brief: "An AI system that can plan steps and call tools to act, not just answer questions.",
    detail:
      "An AI system designed to take actions, not just produce text. It can plan a sequence of steps, call external tools (APIs, databases, messaging), observe the result, and adjust. In a hotel context this means proposing a shift grid, drafting a guest message, or flagging an over-order, with a human staying in the loop for the final call.",
  },
  fnb: {
    id: "fnb",
    term: "F&B",
    brief: "Food and Beverage. Everything that happens around eating and drinking on the hotel premises.",
    detail:
      "Food and Beverage. The part of hotel operations that covers the restaurant, bar, room service, breakfast, and events catering. It is one of the hardest things to forecast: too much prep means waste, too little means a guest leaves unhappy. Better anticipation here protects both margin and experience.",
  },
  humanInTheLoop: {
    id: "humanInTheLoop",
    term: "human-in-the-loop",
    brief: "The AI proposes, a human approves, adjusts, or overrides. The final decision stays with the team.",
    detail:
      "A design pattern where an automated system makes a recommendation but a person validates the action before it ships. It keeps accountability with the team, captures local expertise that a model cannot see, and builds trust progressively. The opposite, full autonomy, is rarely the right starting point in operations.",
  },
  rag: {
    id: "rag",
    term: "RAG",
    brief: "Retrieval Augmented Generation. The model fetches relevant past cases first, then writes its answer.",
    detail:
      "Retrieval Augmented Generation. Before generating a response, the system retrieves relevant context from a knowledge base or vector database, then conditions the answer on that evidence. The benefit is explainability: a manager can see which past scenarios informed a recommendation, instead of trusting a black box.",
  },
  mcp: {
    id: "mcp",
    term: "MCP",
    brief: "Model Context Protocol. A standard way for AI agents to discover and call external tools and data sources.",
    detail:
      "Model Context Protocol. An open standard that lets AI agents connect to tools, databases, and APIs through a uniform interface. Instead of writing a custom integration for every model and every system, the agent speaks MCP and the tool exposes itself once. It is what makes an agent composable across hotel systems.",
    link: { label: "modelcontextprotocol.io", href: "https://modelcontextprotocol.io", external: true },
  },

  // Tacet / acoustic
  headless: {
    id: "headless",
    term: "headless",
    brief: "The product has no user interface of its own. It exposes data and decisions through an API for other systems.",
    detail:
      "A headless product ships intelligence without a screen. It pushes structured signals (alerts, scores, recommendations) into the tools where decisions already happen, instead of asking users to watch yet another dashboard. The benefit is adoption: nothing new to learn, the value shows up inside the system the team already trusts.",
  },
  syntheticAcousticTwin: {
    id: "syntheticAcousticTwin",
    term: "synthetic acoustic twin",
    brief: "A software-only model of how sound behaves around a building, built from physics and public data.",
    detail:
      "A digital model that simulates how sound propagates from streets, construction, and events to specific rooms inside a building. It is synthetic because it relies on physics and proxy data rather than hardware sensors on the roof. The advantage is coverage without capex, and the ability to forecast risk before it materialises.",
  },
  apiFirst: {
    id: "apiFirst",
    term: "API-first",
    brief: "The product is designed as an interface for other systems to consume, before any user-facing surface is built.",
    detail:
      "An architecture where the API is the primary product. Every capability is exposed as a clean, documented endpoint from day one, and any UI is just one consumer among others. It forces clear contracts, makes integrations cheap, and lets partners build on top without waiting for a feature to land in a dashboard.",
  },
  jsonAlerts: {
    id: "jsonAlerts",
    term: "JSON alerts",
    brief: "Structured machine-readable notifications, pushed to other systems so they can act automatically.",
    detail:
      "Alerts emitted in JSON, a lightweight data format that any modern system can parse. Instead of a human email or a dashboard ping, the signal arrives as structured data that the RMS or PMS can route, filter, and act on. It is the difference between informing a person and triggering a workflow.",
  },
  proxyData: {
    id: "proxyData",
    term: "proxy data",
    brief: "Public signals (permits, weather, traffic, events) used as indirect indicators of something harder to measure directly.",
    detail:
      "Data that stands in for a phenomenon you cannot measure cheaply yourself. Construction permits proxy for future noise. Traffic APIs proxy for street disturbance. Weather forecasts proxy for window-open behaviour. Combined, they let a software model estimate acoustic reality without deploying a single sensor.",
  },
  yield: {
    id: "yield",
    term: "yield management",
    brief: "Selling the right room to the right guest at the right price, to maximise revenue across the whole inventory.",
    detail:
      "The discipline of adjusting price and allocation in real time to extract the most revenue from a perishable inventory like hotel rooms. Yield management blends demand forecasts, segmentation, and competitive context. Feeding it environmental risk, like a noisy morning on the east wing, sharpens both the price and the room assignment.",
  },
};

export function getEntry(id: string): GlossaryEntry | undefined {
  return GLOSSARY[id];
}
