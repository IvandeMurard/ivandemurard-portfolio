import { defineTool } from "@lovable.dev/mcp-js";
import { JOURNAL_ENTRIES, JOURNAL_KNOWLEDGE_QUESTIONS } from "../../../content/journal";

const SITE_ORIGIN = "https://ivandemurard.com";

export default defineTool({
  name: "list_journal_entries",
  title: "List Field Notes",
  description:
    "List Ivan de Murard's Field Notes (journal) entries with slug, title, date, category, excerpt, Markdown URL, the question each note answers (01 Evaluate, 02 Set boundaries, 03 Learn) and evidence case studies. Use get_journal_entry with a slug from this list to read the full body.",
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

    return {
      content: [{ type: "text" as const, text: JSON.stringify(entries, null, 2) }],
      structuredContent: {
        index_url: `${SITE_ORIGIN}/journal`,
        corpus_url: `${SITE_ORIGIN}/llms-full.txt`,
        reading_note: "The three notes answer complementary questions and can be read in any order. Notes teach methods; case studies hold implementation evidence.",
        entries,
      },
    };
  },
});
