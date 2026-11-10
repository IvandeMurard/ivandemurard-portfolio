import { defineTool } from "@lovable.dev/mcp-js";
import { STATUSES, COMPASS_SOURCES_LINE } from "../../../content/statuses";

const BASE = [
  {
    slug: "sonor",
    name: "Sonor",
    label: "SaaS · Urban Noise Insights · 2020-2022",
    tagline:
      "B2G SaaS that turned acoustic open data into a decision tool for cities. Taken from discovery to MVP; stopped in 2022 after discovery concluded no contract would clear.",
    url: "https://ivandemurard.com/sonor",
    markdown_path: "/sonor.md",
  },
  {
    slug: "aetherix",
    name: "Aetherix",
    label: "AI Agent · Boutique Hotel Operations · 2026",
    tagline:
      "The F&B agent for boutique hotels. It works inside the tools the hotel already runs, its PMS and WhatsApp: one recommendation a day, the manager's reply, the outcome recorded next to it. Built to improve with every day it runs. Built and evaluated on historical data. Staged on Fly.io, connected to the Apaleo sandbox. Ready for a 30-day pilot.",
    url: "https://ivandemurard.com/aetherix",
    markdown_path: "/aetherix.md",
  },
  {
    slug: "tacet",
    name: "Tacet",
    label: "B2B · Hospitality · Environmental Twin · 2026",
    tagline:
      "Headless Environmental Twin for the hospitality sector. Turns street, weather and crowd signals into yield rules and Chain of Thought payloads, exposed via an MCP server that any RMS, PMS or orchestration agent can consume.",
    url: "https://ivandemurard.com/tacet",
    markdown_path: "/tacet.md",
  },
  {
    slug: "lore",
    name: "Lore",
    label: "AI Agent · Aviation Maintenance · 2026",
    tagline:
      "Voice AI mentor for aviation maintenance. Captures the tacit knowledge a retiring technician never wrote down and returns it to a junior on the shop floor by voice, always behind the procedure. Graded by a 64-case evaluation harness with pure-function graders and a hard safety tier.",
    url: "https://ivandemurard.com/lore",
    markdown_path: "/lore.md",
  },
  {
    slug: "anima",
    name: "Anima",
    label: "AI Agent · Guest Memory · 2026",
    tagline:
      "The guest memory node of the Hospitality Multi-Agent Architecture. A four-layer temporal memory of a guest relationship (working, episodic, semantic, segment), claims carrying weight, source and age with decay, and a scope gate that makes total recall impossible. Synthetic PoC. Architecture ready, deployment frozen until the data-protection impact assessment (DPIA) clears.",
    url: "https://ivandemurard.com/anima",
    markdown_path: "/anima.md",
  },
  {
    slug: "rose",
    name: "Rose",
    label: "AI service · Portfolio agent · 2026",
    tagline: "Rose answers questions about the page you are reading, from the site's own text. Next, she will locate passages, rephrase them and connect pages across the site. The case study shows how I built her and the decisions I made.",
    url: "https://ivandemurard.com/rose-design-lab",
    markdown_path: "/rose-design-lab.md",
  },
  {
    slug: "compass",
    name: "Compass",
    group: "Standalone projects",
    label: "Data product · Commercial premises · Paris · 2026",
    tagline:
      "Every address has a story. Compass helps entrepreneurs choose premises that fit their project, with the context listings leave out: past trades, how often the place changed hands, the neighbourhood around it and, next, its amenities. Make informed decisions, envision your project. " + COMPASS_SOURCES_LINE + ".",
    url: "https://ivandemurard.com/compass",
    markdown_path: "/compass.md",
  },
];

const STUDIES = BASE.map((s) => ({ ...s, status: { ...STATUSES[s.slug as keyof typeof STATUSES] } }));

export default defineTool({
  name: "list_case_studies",
  title: "List case studies",
  description:
    "List Ivan de Murard's published product case studies (Sonor, Aetherix, Tacet, Lore, Anima, Rose, Compass) with slug, label, tagline, status (signal go|warn|stop|dark, word, note) and URL. Use get_case_study to fetch the full narrative for one of them.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(STUDIES, null, 2) }],
    structuredContent: { case_studies: STUDIES },
  }),
});
