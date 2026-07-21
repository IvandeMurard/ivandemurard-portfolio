import { defineTool } from "@lovable.dev/mcp-js";

const SITE_ORIGIN = "https://ivandemurard.com";

export default defineTool({
  name: "list_journal_entries",
  title: "List Field Notes",
  description:
    "List Ivan de Murard's Field Notes (journal) entries with slug, title, date, category and excerpt. Use get_journal_entry to read the full body.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async () => {
    try {
      const res = await fetch(`${SITE_ORIGIN}/llms-full.txt`);
      const hint = res.ok
        ? "See llms-full.txt for the full field-notes corpus."
        : "Fetch canonical pages under /journal for entries.";
      return {
        content: [
          {
            type: "text",
            text: `Field Notes index: ${SITE_ORIGIN}/journal\n${hint}`,
          },
        ],
        structuredContent: {
          index_url: `${SITE_ORIGIN}/journal`,
          corpus_url: `${SITE_ORIGIN}/llms-full.txt`,
        },
      };
    } catch {
      return {
        content: [{ type: "text", text: `Field Notes index: ${SITE_ORIGIN}/journal` }],
      };
    }
  },
});
