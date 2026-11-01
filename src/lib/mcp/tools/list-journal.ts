import { defineTool } from "@lovable.dev/mcp-js";
import { JOURNAL_ENTRIES, JOURNAL_KNOWLEDGE_QUESTIONS } from "../../../content/journal";

const SITE_ORIGIN = "https://ivandemurard.com";

export default defineTool({
  name: "list_journal_entries",
  title: "List Field Notes",
  description:
    "List Ivan de Murard's Field Notes (journal) entries with slug, title, date, category, excerpt, Markdown URL, the question each note answers (01 Evaluate, 02 Set boundaries, 03 Learn) and evidence case studies. The text starts with fixed 'Key: value' lines (Index URL, Corpus URL, Reading note), a blank line, then the entries as JSON. Use get_journal_entry with a slug from this list to read the full body.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const entries = JOURNAL_ENTRIES.map((e) => {
      const q = JOURNAL_KNOWLEDGE_QUESTIONS.find((k) => k.slug === e.slug);
      return {
      slug: e.slug,
      title: e.title,
      subtitle: e.subtitle ?? null,
      date: e.date,
      category: e.category,
      excerpt: e.excerpt,
      url: `${SITE_ORIGIN}/journal/${e.slug}`,
      markdown_url: `${SITE_ORIGIN}/journal/${e.slug}.md`,
      question: q ? { number: q.number, label: q.label, text: q.question, outcome: q.description } : null,
      evidence: q ? q.cases.map((c) => ({ label: c.label, url: `${SITE_ORIGIN}${c.to}` })) : [],
      };
    }).sort((a, b) => b.date.localeCompare(a.date));

    const indexUrl = `${SITE_ORIGIN}/journal`;
    const corpusUrl = `${SITE_ORIGIN}/llms-full.txt`;
    const readingNote = "The three notes answer complementary questions and can be read in any order. Notes teach methods; case studies hold implementation evidence.";

    // The fields other than the entries are fixed "Key: value" lines, then the entries as JSON.
    const header = [`Index URL: ${indexUrl}`, `Corpus URL: ${corpusUrl}`, `Reading note: ${readingNote}`].join("\n");
    return {
      content: [{ type: "text" as const, text: `${header}\n\n${JSON.stringify(entries, null, 2)}` }],
      structuredContent: { index_url: indexUrl, corpus_url: corpusUrl, reading_note: readingNote, entries },
    };
  },
});
