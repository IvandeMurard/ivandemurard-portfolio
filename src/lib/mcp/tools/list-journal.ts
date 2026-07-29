import { defineTool } from "@lovable.dev/mcp-js";
import { JOURNAL_ENTRIES } from "../../../content/journal";

const SITE_ORIGIN = "https://ivandemurard.com";

export default defineTool({
  name: "list_journal_entries",
  title: "List Field Notes",
  description:
    "List Ivan de Murard's Field Notes (journal) entries with slug, title, date, category and excerpt. Use get_journal_entry with a slug from this list to read the full body.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const entries = JOURNAL_ENTRIES.map((e) => ({
      slug: e.slug,
      title: e.title,
      subtitle: e.subtitle ?? null,
      date: e.date,
      category: e.category,
      excerpt: e.excerpt,
      url: `${SITE_ORIGIN}/journal/${e.slug}`,
    })).sort((a, b) => b.date.localeCompare(a.date));

    return {
      content: [{ type: "text" as const, text: JSON.stringify(entries, null, 2) }],
      structuredContent: {
        index_url: `${SITE_ORIGIN}/journal`,
        entries,
      },
    };
  },
});
