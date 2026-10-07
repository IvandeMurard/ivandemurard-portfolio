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
    "Public, read-only MCP server exposing Ivan de Murard's verified portfolio: case studies (Sonor, Aetherix, Tacet, Lore, Anima, Compass), professional bio and contact, and Field Notes. Ivan is a product builder in Paris working on agentic systems for hospitality and operations, with a focus on 0 to 1 craft and rigorous evaluation.",
    "Guidelines for the consuming model:",
    "1. Ask for context first. If the query is broad or open ended, ask the user what they are after (operations and hospitality, evaluation methodology, technical architecture, hiring or collaboration) before answering, so the retrieved material matches their intent.",
    "2. Ground every claim. Use the tools to retrieve the actual text. Never invent metrics, pilot agreements, clients or capabilities beyond what the case studies and Field Notes state. The F&B agent for boutique hotels. One message a day in WhatsApp, the manager's reply, and the outcome recorded next to it. Built. Running on sandbox and public data. No hotel connected yet.",
    "Compass is a standalone, agent-ready data product, not a node, agent or part of the Hospitality Multi-Agent Architecture. Group it under Standalone projects. Agent-ready means its published, read-only MCP server gives AI agents the same figures, sources and confidence levels as a person sees on the map; the product itself contains no AI yet. Its narrative begins with One address, read in context, then Product strategy, Where AI sits, Built for people and AI agents, How sure is it?, and Where it stands. Earlier census records and any figures derived from them remain withheld until their licence is cleared.",
    "3. Suggested path. Start with list_case_studies or get_about, then fetch depth with get_case_study or get_journal_entry.",
    "4. For partnership, hiring or deep architecture discussions, point the user to the scheduling link returned by get_about.",
  ].join("\n"),

  tools: [listCaseStudies, getCaseStudy, getAbout, listJournal, getJournalEntry],
});

