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
    brief: "Property management system: the hotel's booking and operations software",
  },
  covers: {
    id: "covers",
    term: "covers",
    brief: "meals served",
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
      "A software model that ray-traces how sound propagates from streets, construction and events to specific rooms, built from physics and public data rather than rooftop sensors.",
  },
  environmentalTwin: {
    id: "environmentalTwin",
    term: "environmental twin",
    brief:
      "A software model of the hotel and its surroundings that simulates acoustic, weather and mobility impacts on specific rooms, so the property can anticipate friction before guests feel it.",
  },
  rayTracing: {
    id: "rayTracing",
    term: "ray-tracing",
    brief:
      "A geometric technique that draws 3D lines of sight between a noise source and a facade, then applies shielding penalties when buildings stand in the way. Cuts false positives.",
  },
  dualMemory: {
    id: "dualMemory",
    term: "dual memory",
    brief:
      "A stateful store with two layers. Idiosyncratic memory learns each hotel's quirks at a GPS coordinate. Hive Mind (Research: no network to aggregate yet) would recalibrate baseline sensitivity across the network.",
  },
  chainOfThought: {
    id: "chainOfThought",
    term: "Chain of Thought",
    brief:
      "A structured breakdown of the calculation embedded in every payload (base noise, distance attenuation, ray-tracing penalty, final impact), so a client agent can explain the decision in natural language.",
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

  // Aviation maintenance
  mro: {
    id: "mro",
    term: "MRO",
    brief:
      "Maintenance, Repair and Overhaul. The industry that keeps aircraft airworthy between flights, covering scheduled checks, fault diagnosis and component replacement, usually under a regulator-approved organisation.",
  },
  sop: {
    id: "sop",
    term: "SOP",
    brief:
      "Standard Operating Procedure. The written, approved method for a task. In maintenance it carries the numbers that matter: limits, bands, intervals. It always takes precedence over informal advice.",
  },
  amm: {
    id: "amm",
    term: "AMM",
    brief:
      "Aircraft Maintenance Manual. The manufacturer's approved procedures for a specific aircraft type, referenced by chapter number. It is the document a technician is accountable to, not a guideline.",
  },
  part145: {
    id: "part145",
    term: "Part 145",
    brief:
      "The European approval that lets an organisation perform aircraft maintenance. It defines who may certify that work was done correctly, and that person is always a named human being.",
  },
  airworthiness: {
    id: "airworthiness",
    term: "airworthiness",
    brief:
      "The condition of an aircraft being safe and legal to fly. Every maintenance decision either preserves it or compromises it, which is why informal advice never overrides an approved procedure.",
  },
  tacitKnowledge: {
    id: "tacitKnowledge",
    term: "tacit knowledge",
    brief:
      "What an expert knows but has never written down. The exceptions, the quirks of one machine, the pattern learned over years. It leaves the organisation when the person does.",
  },

  // Evaluation
  goldenDataset: {
    id: "goldenDataset",
    term: "golden dataset",
    brief:
      "A fixed set of situations with known-correct answers, used to measure a system before release. It doubles as a specification: writing it forces you to define what a bad output actually is.",
  },
  grader: {
    id: "grader",
    term: "grader",
    brief:
      "One line of an evaluation grid. It checks a single property of an answer and returns pass or fail with a reason. Kept deterministic, because a model judging a model fails the same way.",
  },
  evalHarness: {
    id: "evalHarness",
    term: "eval harness",
    brief:
      "The machinery that runs a case set through a system, applies the graders, and returns a verdict with an exit code. It turns a pass rate into a decision about whether to ship.",
  },
  abstention: {
    id: "abstention",
    term: "abstention",
    brief:
      "A system saying it does not know, rather than guessing. In safety contexts it is a feature to be measured, because an honest refusal followed by an invented figure is worse than either alone.",
  },
  stt: {
    id: "stt",
    term: "STT",
    brief:
      "Speech to text. Converting spoken audio into written words in real time. In a workshop the hard part is not the words but the noise, the accents, and the jargon a general model has never heard.",
  },
  caseSet: {
    id: "caseSet",
    term: "case set",
    brief:
      "The situations a system is tested against, chosen in advance, each with a known correct answer. Writing it is the moment a team has to agree on what a bad output actually is.",
  },
  harness: {
    id: "harness",
    term: "harness",
    brief:
      "The whole examination: the case set, the graders, the pass mark and the report. It runs the test end to end and returns a verdict a pipeline can act on.",
  },
  protocol: {
    id: "protocol",
    term: "protocol",
    brief:
      "The rules around the measurement. What to measure, on what data, above what threshold it is unacceptable, who decides, and when it blocks a release. A document, not code.",
  },
  openLoop: {
    id: "openLoop",
    term: "open loop",
    brief:
      "You measure, a human reads the result, they may act on it. The measurement changes nothing by itself, so quality depends on someone remembering to look.",
  },
  closedLoop: {
    id: "closedLoop",
    term: "closed loop",
    brief:
      "The measurement is wired back into the system and changes it without a human step. A merge is blocked, a release pulled, a failure turned into a new test case.",
  },
  mape: {
    id: "mape",
    term: "MAPE",
    brief:
      "Mean absolute percentage error. The average gap between a forecast and what actually happened, expressed as a percentage, which makes errors comparable across covers, revenue, or volumes.",
  },
  drift: {
    id: "drift",
    term: "drift",
    brief:
      "The inputs a system sees in production slowly stop looking like the ones it was tested on. Nothing breaks visibly; accuracy just decays until someone measures it.",
  },
  canary: {
    id: "canary",
    term: "canary",
    brief:
      "A repeated identical run used to prove a measurement is stable before it is allowed to block anything. If the same input scores differently twice, the score is a draw, not a measurement.",
  },
  counterfactual: {
    id: "counterfactual",
    term: "counterfactual",
    brief:
      "What would have happened had the system been followed instead of overridden. When a human escalates, that outcome is never observed, so the signal needed to learn disappears.",
  },
  ciGate: {
    id: "ciGate",
    term: "CI gate",
    brief:
      "An automated check in the build pipeline that can stop a change from being merged. Advisory while it only reports, blocking once a failing score actually holds the release.",
  },
  precisionAtK: {
    id: "precisionAtK",
    term: "precision at k",
    brief:
      "Of the top k results a retrieval step returns, how many are genuinely relevant. Precision at five below 0.7 means two of the five passages handed to the model were noise.",
  },
  ontology: {
    id: "ontology",
    term: "ontology",
    brief:
      "An explicit map of the concepts in a domain and how they relate. It lets a system know that two differently worded items are the same thing, which plain text similarity cannot.",
  },
  prophet: {
    id: "prophet",
    term: "Prophet",
    brief:
      "An open-source statistical forecasting library, originally from Meta, built for time series with strong seasonality: weekday patterns, holidays, local events. It returns a number and an uncertainty range. It does not reason, phrase, or decide.",
  },
  llm: {
    id: "llm",
    term: "LLM",
    brief:
      "Large language model. Strong at reasoning over context and phrasing a recommendation, weak at producing a calibrated number, and it will produce a plausible one anyway if asked.",
  },
};



export function getEntry(id: string): GlossaryEntry | undefined {
  return GLOSSARY[id];
}
