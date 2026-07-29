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
  instructions:
    "Public MCP server exposing Ivan de Murard's portfolio: case studies (Sonor, Aetherix, Tacet), professional bio and contact, and Field Notes. Start with list_case_studies or get_about, then fetch details with get_case_study or get_journal_entry.",
  tools: [listCaseStudies, getCaseStudy, getAbout, listJournal, getJournalEntry],
});

