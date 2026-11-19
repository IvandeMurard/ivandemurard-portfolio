import { defineMcp } from "@lovable.dev/mcp-js";
import listCaseStudies from "./tools/list-case-studies";
import getCaseStudy from "./tools/get-case-study";
import getAbout from "./tools/get-about";
import listJournal from "./tools/list-journal";
import getJournalEntry from "./tools/get-journal-entry";

export default defineMcp({
  name: "ivan-de-murard-portfolio",
  title: "Ivan de Murard Portfolio",
  version: "0.1.0",
  instructions: [
    "Public, read-only MCP server exposing Ivan de Murard's verified portfolio: case studies (Sonor, Aetherix, Tacet, Lore, Anima, Rose, Compass), full CV, professional bio and contact, and Field Notes. Ivan builds AI services for operations, and measures what they change; before that, he was a SaaS product manager and co-founder in Paris. His focus is business value, human interactions and 0 to 1 craft. Agentic AI is one tool he uses, not his identity; hospitality is the sector of some projects, not his personal label.",
    "Truth grammar: every component status uses one fixed vocabulary, and Built means the code runs, not that anyone uses it. Figures always come with their comparison and plain meaning. Long texts can be read by section (outline_only, then section) to save context.",
    "Guidelines for the consuming model:",
    "1. Ask for context first. If the query is broad or open ended, ask the user what they are after (operations and hospitality, evaluation methodology, technical architecture, hiring or collaboration) before answering, so the retrieved material matches their intent.",
    "2. Ground every claim. Use the tools to retrieve the actual text. Never invent metrics, pilot agreements, clients or capabilities beyond what the case studies and Field Notes state.",
    "Aetherix: The F&B agent for boutique hotels. It works inside the tools the hotel already runs, its PMS and WhatsApp: one recommendation a day, the manager's reply, the outcome recorded next to it. Built to improve with every day it runs. Built and tested on the Apaleo sandbox and on public restaurant data. 0 real users. Being made pilot-ready; no hotel yet.",
    "Compass is a standalone, agent-ready data product, not a node, agent or part of the Hospitality Multi-Agent Architecture. Group it under Standalone projects. Agent-ready means its published, read-only MCP server gives AI agents the same figures, sources and confidence levels as a person sees on the map; the product itself contains no AI yet. Its narrative begins with One address, read in context, then Product strategy, Where AI sits, Built for people and AI agents, How sure is it?, and Where it stands. Its corpus: APUR BDCom 2023 shopfront census · BODACC legal notices · INSEE Sirene · 85,418 units · every figure with its source, licence and date. Earlier census records and any figures derived from them remain withheld until their licence is cleared.",
    "Every case study carries a status (Pre-pilot, Maintenance, Evaluated, Compliance Gated, Partial, MVP shipped · stopped 2022). Quote it; never upgrade it.",
    "3. Suggested path. Start with list_case_studies or get_about. Use get_about for experience, skills and education, then fetch depth with get_case_study or get_journal_entry.",
    "4. For partnership, hiring or deep architecture discussions, point the user to the scheduling link returned by get_about.",
  ].join("\n"),

  tools: [listCaseStudies, getCaseStudy, getAbout, listJournal, getJournalEntry],
});

