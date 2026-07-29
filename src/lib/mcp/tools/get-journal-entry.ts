import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { JOURNAL_ENTRIES, type JournalBlock } from "../../../content/journal";

const SITE_ORIGIN = "https://ivandemurard.com";

function renderBlock(block: JournalBlock): string {
  switch (block.kind) {
    case "p":
      return block.text;
    case "h2":
      return `## ${block.text}`;
    case "h3":
      return `### ${block.text}`;
    case "quote":
      return `> ${block.text}`;
    case "list":
      return block.items.map((i) => `- ${i}`).join("\n");
    case "code":
      return `\`\`\`${block.lang ?? ""}\n${block.text}\n\`\`\``;
    case "table":
      return [
        `| ${block.head.join(" | ")} |`,
        `| ${block.head.map(() => "---").join(" | ")} |`,
        ...block.rows.map((r) => `| ${r.join(" | ")} |`),
      ].join("\n");
    case "defs":
      return block.items.map((i) => `**${i.term}**: ${i.def}`).join("\n");
    case "pyramid":
      return block.layers
        .map((l) => `${l.level}: ${l.name}${l.note ? ` (${l.note})` : ""}${l.base ? " [foundation]" : ""}`)
        .join("\n");
    case "deployed":
      return block.items.map((i) => `Deployed: ${i.project} (${SITE_ORIGIN}${i.to}) ${i.text}`).join("\n");
    case "lines":
      return block.items.map((i) => `Q: ${i.q}\nA: ${i.a}`).join("\n\n");
    default:
      return "";
  }
}

export default defineTool({
  name: "get_journal_entry",
  title: "Get Field Note",
  description:
    "Fetch one Field Notes entry in full by slug: title, subtitle, date, category and the complete body rendered as readable Markdown. Use list_journal_entries to discover valid slugs.",
  inputSchema: {
    slug: z.string().describe("Field Note slug, as returned by list_journal_entries."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const entry = JOURNAL_ENTRIES.find((e) => e.slug === slug);
    if (!entry) {
      const available = JOURNAL_ENTRIES.map((e) => e.slug).join(", ");
      return {
        content: [
          {
            type: "text" as const,
            text: `Unknown Field Note slug "${slug}". Available slugs: ${available || "none"}.`,
          },
        ],
        isError: true,
      };
    }

    const bodyText = entry.body.map(renderBlock).filter(Boolean).join("\n\n");
    const url = `${SITE_ORIGIN}/journal/${entry.slug}`;
    const text = [
      `# ${entry.title}`,
      entry.subtitle ?? "",
      `${entry.category} · ${entry.date}${entry.readingMinutes ? ` · ${entry.readingMinutes} min read` : ""}`,
      entry.excerpt,
      bodyText,
      `Source: ${url}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    return {
      content: [{ type: "text" as const, text }],
      structuredContent: {
        slug: entry.slug,
        title: entry.title,
        subtitle: entry.subtitle ?? null,
        date: entry.date,
        category: entry.category,
        excerpt: entry.excerpt,
        reading_minutes: entry.readingMinutes ?? null,
        related: entry.related ?? [],
        url,
        body: entry.body,
        body_text: bodyText,
      },
    };
  },
});
