import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { JOURNAL_ENTRIES, type JournalBlock, type JournalEntry } from "../../../content/journal";
import { recoLineMarkdown } from "../../../content/recoLine";
import { blueprintMarkdown } from "../../../content/serviceBlueprint";
import { APPLY_GUIDES, applyMarkdown } from "../../../content/journalApply";
import { readingLabel } from "../../../content/readingTime";
import { axFigureMarkdown } from "../../../content/journalAxFigures";
import { displayOrder } from "../../journalOrder";
import { listenSummaryFor, listenSummarySection } from "../../../content/listenSummaries";
import { outline, section as pickSection } from "../sections";

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
    case "axFigure":
      // The text version of a figure: a list, a table or a sentence, the same data the page draws.
      return axFigureMarkdown(block.figure);
    case "console":
    case "mcp":
    case "diagnostic":
      return "";
    case "trap":
      // The version without JavaScript: the question and both lines as text.
      return `${block.question} (${block.choices.join(" or ")}) If you answer ${block.choices[0]}: ${block.reveal[0]} If you answer ${block.choices[1]}: ${block.reveal[1]}`;
    case "peak":
      return [
        `**${block.kicker}**`,
        block.lead,
        // The question is text here, and the boxes are all shown: this is the version without JavaScript.
        block.challenge ? `${block.challenge.rule} ${block.challenge.question} (${block.challenge.choices.join(" or ")}) If you answer ${block.challenge.choices[0]}: ${block.challenge.reveal[0]} If you answer ${block.challenge.choices[1]}: ${block.challenge.reveal[1]}` : "",
        ...block.boxes.map((x) => [`**${x.label}**`, x.text, x.bubble ?? "", x.chain ? x.chain.steps.join(", ") : "", x.note ?? ""].filter(Boolean).join(" ")),
        block.after ?? "",
        block.panes?.caption ?? "",
        block.link ? `${block.link.text} (#${block.link.to})` : "",
        block.contract ?? "",
      ].filter(Boolean).join("\n\n");
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

/** The entry from the TL;DR to the source line: everything except the title, subtitle and dateline. */
export function renderEntryBody(entry: JournalEntry): string {
    const related = entry.related?.length
      ? `## Continue exploring\n\n${entry.related.map((r) => `- ${r.role ? `${RELATED_ROLE[r.role]}: ` : ""}[${r.label}](${SITE_ORIGIN}${r.to})${r.why ? ` - ${r.why}` : ""}`).join("\n")}`
      : "";
    // In the order the page shows the sections (a note can move one; its heading ids do not change).
    const shown = displayOrder(entry.body, entry.moves).map((i) => entry.body[i]);
    // A recorded summary, when the note has one: the same section the page shows, from the same source (listenSummaries.ts).
    const listen = listenSummaryFor(`/journal/${entry.slug}`);
    const listenSection = listen ? listenSummarySection(listen.summary).trimEnd() : "";
    const bodyText = absolutize([...renderBlocks(shown), listenSection, related].filter(Boolean).join("\n\n"));
    const url = `${SITE_ORIGIN}/journal/${entry.slug}`;
    return [
      entry.tldr ? `**TL;DR** - ${entry.tldr}` : "",
      entry.glance
        ? [
            `**Read this if** ${entry.glance.audience}`,
            entry.glance.promise ? `**What it gives you**: ${entry.glance.promise}` : "",
            entry.glance.proof ? `**Tested on**: ${entry.glance.proof}` : "",
          ].filter(Boolean).join(" ")
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
      .join("\n\n");
}

/** "16 min read", or "16 min · 22 with every detail open" when every fold open is at least 5 minutes longer. */
const readLine = (entry: JournalEntry): string => {
  const label = readingLabel(entry.readingMinutes ?? 0, entry.readingMinutesFull);
  return label === `${entry.readingMinutes} min` ? `${label} read` : label;
};

/** The full Markdown of an entry, as published on the site and in the .md mirror. */
export function renderEntryMarkdown(entry: JournalEntry): string {
    return [
      `# ${entry.title}`,
      entry.hook,
      entry.intro,
      entry.subtitle && !entry.subtitle.includes(entry.hook) ? entry.subtitle : "",
      `${entry.category} · ${entry.date}${entry.readingMinutes ? ` · ${readLine(entry)}` : ""}`,
      renderEntryBody(entry),
    ]
      .filter(Boolean)
      .join("\n\n");
}

/** Fixed "Key: value" lines, one per field and always all seven, so a program can parse them. */
export function renderEntryHeader(entry: JournalEntry): string {
  return [
    `Title: ${entry.title}`,
    `Subtitle: ${entry.subtitle ?? "none"}`,
    `Date: ${entry.date}`,
    `Category: ${entry.category}`,
    `Reading time: ${entry.readingMinutes ? `${entry.readingMinutes} min` : "none"}`,
    `URL: ${SITE_ORIGIN}/journal/${entry.slug}`,
    `Markdown URL: ${entry.mirror ? `${SITE_ORIGIN}${entry.mirror}` : "none"}`,
  ].join("\n");
}

export default defineTool({
  name: "get_journal_entry",
  title: "Get Field Note",
  description:
    "Fetch one Field Notes entry in full by slug. Returns one text content: a metadata header of fixed 'Key: value' lines (Title, Subtitle, Date, Category, Reading time, URL, Markdown URL), a blank line, then the complete entry as Markdown, once. There is no structured content. Use list_journal_entries to discover valid slugs. To save context, pass outline_only to get the section titles, then section to fetch one section (header kept).",
  inputSchema: {
    slug: z.string().describe("Field Note slug, as returned by list_journal_entries."),
    outline_only: z.boolean().optional().describe("Return only the metadata header and the list of section titles."),
    section: z.string().min(1).max(80).optional().describe("Part of a section title, from outline_only; returns that section only."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug, outline_only, section }) => {
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

    // Text only, no structuredContent: the metadata header and the body are the whole payload, once.
    const full = renderEntryBody(entry);
    let body = full;
    if (outline_only) body = `Sections:\n${outline(full).map((t) => `- ${t}`).join("\n")}`;
    else if (section) {
      const part = pickSection(full, section);
      if (!part) {
        return {
          content: [{ type: "text" as const, text: `No section matching "${section}" in ${slug}. Sections: ${outline(full).join("; ")}` }],
          isError: true,
        };
      }
      body = part;
    }
    return {
      content: [{ type: "text" as const, text: `${renderEntryHeader(entry)}\n\n${body}` }],
    };
  },
});
