import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { JOURNAL_ENTRIES, type JournalBlock, type JournalEntry } from "../../../content/journal";
import { recoLineMarkdown } from "../../../content/recoLine";
import { blueprintMarkdown } from "../../../content/serviceBlueprint";
import { APPLY_GUIDES, applyMarkdown } from "../../../content/journalApply";

const SITE_ORIGIN = "https://ivandemurard.com";

export function renderBlock(block: JournalBlock): string {
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
      return block.items.map((i) => `**${i.term}**: ${i.def}${i.note ? `\n*${i.note}*` : ""}`).join("\n");
    case "pyramid":
      return block.layers
        .map((l) => `${l.level}: ${l.name}${l.note ? ` (${l.note})` : ""}${l.base ? " [foundation]" : ""}`)
        .join("\n");
    case "deployed":
      return block.items.map((i) => `Deployed: ${i.project} (${SITE_ORIGIN}${i.to}) ${i.text}`).join("\n");
    case "lines":
      return block.items.map((i) => `Q: ${i.q}\nA: ${i.a}`).join("\n\n");
    case "key":
      return `**${block.sigil}** ${block.oneLine}${block.concrete ? ` Concrete case: ${block.concrete}` : ""}`;
    case "anchors":
      return block.items.map(i => `**${i.project}** (${SITE_ORIGIN}${i.to}): ${i.what} Users: ${i.who} Feedback: ${i.feedback}`).join("\n");
    case "timeline":
      return block.steps.map(i => `${i.value}: ${i.label}${i.note ? ` (${i.note})` : ""}`).join("\n");
    case "cards":
      return block.items.map(i => `**${i.title}**: ${i.body}`).join("\n\n");
    case "matrix":
      return [block.columns.join(" | "), ...block.rows.map(r => `${r.arm} (${r.when}): ${r.cells.map(c => `${c.state}: ${c.instance}${c.cost ? ` (${c.cost})` : ""}`).join(" | ")}`)].join("\n");
    case "vocab":
      return block.items.map(i => i.label).join(", ");
    case "askRose":
      return [block.label, block.note, ...block.prompts].filter(Boolean).join("\n");
    case "stepper":
      return [
        block.label ? `**${block.label}**` : "",
        `Technician: ${block.question} (${block.rule})`,
        `Model answer, verbatim: "${block.answer}"`,
        ...block.steps.map(
          (st, i) =>
            `Step ${i + 1}, ${st.tab}: ${st.verdict}. ${st.checks.map((c) => `${c.grader}: ${c.result}`).join("; ")}.${st.answer ? ` What ships: "${st.answer}"` : ""} ${st.reading}`
        ),
        block.note ?? "",
      ]
        .filter(Boolean)
        .join("\n");
    case "fold":
      return [`**${block.summary}**`, ...block.blocks.map(renderBlock)].filter(Boolean).join("\n\n");
    case "recoLine":
      return [`**Figure.** ${block.caption}`, recoLineMarkdown(block.layer), block.link ? `${block.link.text}: ${SITE_ORIGIN}${block.link.to}` : ""].filter(Boolean).join("\n\n");
    case "blueprint":
      return blueprintMarkdown();
    case "console":
    case "mcp":
      return "";
    case "arms":
      return [block.label, "Arm A: offline before the merge. Arm B: runtime in production. Arm C: outcome after the fact.", block.link ? `${block.link.text}: ${SITE_ORIGIN}${block.link.to}` : ""].filter(Boolean).join("\n");
    case "callout":
      return `**${block.title}**\n${block.text}\n[${block.link.text}](${SITE_ORIGIN}${block.link.to})`;
    case "apply": {
      const g = APPLY_GUIDES[block.slug];
      return g ? applyMarkdown(g) : "";
    }
  }
}

/** Contiguous runs of Markdown table lines ("| ... |"), one string per table. */
export function tableRuns(md: string): string[] {
  const runs: string[] = [];
  let run: string[] = [];
  for (const line of md.split("\n")) {
    if (line.startsWith("|")) run.push(line);
    else if (run.length) { runs.push(run.join("\n")); run = []; }
  }
  if (run.length) runs.push(run.join("\n"));
  return runs;
}

/** Identity of a table regardless of spacing and apostrophe style ("|---|" equals "| --- |"). */
export const tableKey = (table: string): string => table.replace(/\s+/g, "").replace(/[‘’]/g, "'");

/**
 * Renders a body block by block. A figure can already print its data as a table (recoLine), so an
 * explicit table block that repeats a table already emitted is skipped: no table is emitted twice.
 */
export function renderBlocks(blocks: JournalBlock[]): string[] {
  const seen = new Set<string>();
  return blocks.map((block) => {
    const out = renderBlock(block);
    const tables = tableRuns(out).map(tableKey);
    if (block.kind === "table" && tables.length > 0 && tables.every((t) => seen.has(t))) return "";
    for (const t of tables) seen.add(t);
    return out;
  });
}

const RELATED_ROLE ={ method: "Read the method", decision: "Understand the design decision", evidence: "Inspect implementation evidence" } as const;

/** Internal Markdown links become canonical public URLs so agents can follow them. */
const absolutize = (md: string) => md.replace(/\]\((\/[^\s)]*)\)/g, `](${SITE_ORIGIN}$1)`);

export function renderEntryMarkdown(entry: JournalEntry): string {
    const related = entry.related?.length
      ? `## Continue exploring\n\n${entry.related.map((r) => `- ${r.role ? `${RELATED_ROLE[r.role]}: ` : ""}[${r.label}](${SITE_ORIGIN}${r.to})${r.why ? ` - ${r.why}` : ""}`).join("\n")}`
      : "";
    const bodyText = absolutize([...renderBlocks(entry.body), related].filter(Boolean).join("\n\n"));
    const url = `${SITE_ORIGIN}/journal/${entry.slug}`;
    return [
      `# ${entry.title}`,
      entry.subtitle ?? "",
      `${entry.category} · ${entry.date}${entry.readingMinutes ? ` · ${entry.readingMinutes} min read` : ""}`,
      entry.tldr ? `**TL;DR** - ${entry.tldr}` : "",
      entry.glance
        ? `**Read this if** ${entry.glance.audience} **What it gives you**: ${entry.glance.promise} **Tested on**: ${entry.glance.proof}`
        : "",
      entry.takeaways?.length
        ? `What you will decide differently:\n${entry.takeaways.map((t) => `- ${t}`).join("\n")}`
        : "",
      entry.takeawayPunch ?? "",
      entry.diagnostic
        ? `**${entry.diagnostic.label}.** ${entry.diagnostic.intro}\n${entry.diagnostic.questions
            .map((q, i) => `${i + 1}. (Arm ${q.arm}) ${q.ask} If not: ${q.gap} See ${SITE_ORIGIN}/journal/${entry.slug}#${q.to}`)
            .join("\n")}\n${entry.diagnostic.caveat}`
        : "",
      entry.excerpt,
      bodyText,
      entry.updates?.length ? `## Updates\n\nThis piece is revised when something it claims stops being true. Each revision says what changed and why.\n\n${entry.updates.map(u => `${u.date} · ${u.summary} ${u.reason}`).join("\n")}` : "",
      entry.license ? `Licence: ${entry.license.label} (${entry.license.url}). ${entry.license.note ?? ""}` : "",
      `Source: ${url}`,
    ]
      .filter(Boolean)
      .join("\n\n");;
}

export default defineTool({
  name: "get_journal_entry",
  title: "Get Field Note",
  description:
    "Fetch one Field Notes entry in full by slug. The text content is the complete entry as readable Markdown, once; structured content carries only the short metadata (slug, title, subtitle, date, category, excerpt, reading time, URLs). Use list_journal_entries to discover valid slugs.",
  inputSchema: {
    slug: z.string().describe("Field Note slug, as returned by list_journal_entries."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    // JSON round-trip gives the stripped Deno bundle a loose entry instead of a union of
    // literal note shapes (which fails strict type checking); the source stays typed.
    const found = JOURNAL_ENTRIES.find((e) => e.slug === slug);
    const entry: JournalEntry | undefined = found ? JSON.parse(JSON.stringify(found)) : undefined;
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

    const url = `${SITE_ORIGIN}/journal/${entry.slug}`;
    const text = renderEntryMarkdown(entry);

    // The full entry is in `content` only: repeating it in structuredContent doubled the payload.
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
        url,
        markdown_url: entry.mirror ? `${SITE_ORIGIN}${entry.mirror}` : null,
      },
    };
  },
});
