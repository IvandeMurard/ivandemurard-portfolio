import { writeFileSync } from "node:fs";
import { COMPASS, COMPASS_SECTIONS } from "../src/content/compass";

const lines = [
  "# Compass", "", COMPASS.headline, "", COMPASS.subhead, "",
  COMPASS.label, "", `Role: ${COMPASS.role}`, "", `Status: ${COMPASS.status}`, "",
  `[Open the demo](${COMPASS.demo}) · [GitHub](${COMPASS.repo})`, "", `\`${COMPASS.command}\``, "",
];
COMPASS_SECTIONS.forEach((section, i) => {
  lines.push(`## ${i + 1}. ${section.title}`, "");
  if (section.status) lines.push(section.status, "");
  section.blocks.forEach((block) => {
    if (block.kind === "paragraph") lines.push(block.text, "");
    if (block.kind === "list") lines.push(...block.items.map((text) => `- ${text}`), "");
    if (block.kind === "code") lines.push("```sh", COMPASS.command, "```", "");
    if (block.kind === "table") lines.push(`| ${block.head.join(" | ")} |`, `| ${block.head.map(() => "---").join(" | ")} |`, ...block.rows.map((row) => `| ${row.join(" | ")} |`), "");
    if (block.kind === "figure") lines.push(`### Fig. ${i + 1}.1`, "", block.description, "", block.caption, "");
  });
});
lines.push(`[Schedule a conversation](${COMPASS.schedule})`, "", "© Ivan de Murard. All rights reserved.", "");
writeFileSync("public/compass.md", lines.join("\n"));
console.log("[compass] synchronized Markdown mirror");