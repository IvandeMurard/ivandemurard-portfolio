import { writeFileSync } from "node:fs";
import { COMPASS, COMPASS_CONFIDENCE, COMPASS_SECTIONS, COMPASS_TIMELINE, type CompassBlock } from "../src/content/compass";

const lines = [
  "# Compass", "", `Case study · ${COMPASS.classification}`, "", COMPASS.headline, "", COMPASS.subhead, "",
  `Type: ${COMPASS.label}`, "", `Role: ${COMPASS.role}`, "", `Status: ${COMPASS.status}`, "",
  `[Open the demo](${COMPASS.demo}) · [GitHub](${COMPASS.repo}) · [Live MCP](${COMPASS.mcp})`, "",
];
const renderBlocks = (blocks: CompassBlock[], sectionNumber: number) => {
  blocks.forEach((block) => {
    if (block.kind === "paragraph") lines.push(block.bold ? `**${block.text}**` : block.text, "");
    if (block.kind === "list") lines.push(...block.items.map((text) => `- ${text}`), "");
    if (block.kind === "code") lines.push(...(block.label ? [`**${block.label}**`, ""] : []), `\`\`\`${block.language ?? "sh"}`, block.content ?? COMPASS.command, "```", "", ...(block.caption ? [block.caption, ""] : []));
    if (block.kind === "confidenceLegend") lines.push("#### Confidence definitions", "", ...Object.entries(COMPASS_CONFIDENCE).map(([label, definition]) => `- **${label}** — ${definition}`), "");
    if (block.kind === "link") lines.push(`[${block.text}](${block.href})`, "");
    if (block.kind === "table") lines.push(`| ${block.head.join(" | ")} |`, `| ${block.head.map(() => "---").join(" | ")} |`, ...block.rows.map((row) => `| ${row.map((cell, index) => block.monospaceFirstColumn && index === 0 ? `\`${cell}\`` : cell).join(" | ")} |`), "");
    if (block.kind === "figure") {
      lines.push(`### Fig. ${sectionNumber}.1`, "");
      if (block.figure === "timeline") lines.push(...COMPASS_TIMELINE.map((item) => `- ${item.date} · ${item.event}${item.amount ? ` · ${item.amount}` : ""} · ${item.confidence}`), "");
      else lines.push(block.description, "");
      lines.push(block.caption, "");
    }
  });
};
COMPASS_SECTIONS.forEach((section, i) => {
  lines.push(`## ${i + 1}. ${section.title}`, "");
  if (section.status) lines.push(section.status, "");
  renderBlocks(section.blocks, i + 1);
  section.subsections?.forEach((subsection) => {
    lines.push(`### ${subsection.title}`, "");
    renderBlocks(subsection.blocks, i + 1);
  });
});
lines.push(`[Schedule a conversation](${COMPASS.schedule})`, "", "© Ivan de Murard. All rights reserved.", "");
writeFileSync("public/compass.md", lines.join("\n"));
console.log("[compass] synchronized Markdown mirror");