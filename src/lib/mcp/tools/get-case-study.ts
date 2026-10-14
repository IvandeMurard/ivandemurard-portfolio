import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { statusLine } from "../../../content/statuses";

const SITE_ORIGIN = "https://ivandemurard.com";

const SLUGS = {
  sonor: "/sonor.md",
  aetherix: "/aetherix.md",
  tacet: "/tacet.md",
  lore: "/lore.md",
  anima: "/anima.md",
  compass: "/compass.md",
} as const;

export default defineTool({
  name: "get_case_study",
  title: "Get case study",
  description:
    "Fetch the full Markdown narrative for one case study by slug. Slugs: 'sonor', 'aetherix', 'tacet', 'lore', 'anima', 'compass'. The first line states the project status (for example Status: Stopped · ...); the rest covers vision, architecture, stack and outcomes.",
  inputSchema: {
    slug: z
      .enum(["sonor", "aetherix", "tacet", "lore", "anima", "compass"])
      .describe("Case study slug: sonor, aetherix, tacet, lore, anima, or compass."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: true },
  handler: async ({ slug }) => {
    const path = SLUGS[slug];
    const url = `${SITE_ORIGIN}${path}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        return {
          content: [{ type: "text", text: `Failed to fetch ${slug}: HTTP ${res.status}` }],
          isError: true,
        };
      }
      const markdown = `${statusLine(slug)}\n\n${await res.text()}`;
      return {
        content: [{ type: "text", text: markdown }],
        structuredContent: {
          slug,
          ...(slug === "compass" ? { group: "Standalone projects" } : {}),
          source_url: url,
          canonical_url: `${SITE_ORIGIN}/${slug === "aetherix" ? "aetherix" : slug}`,
          markdown,
        },
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Error fetching ${slug}: ${(err as Error).message}` }],
        isError: true,
      };
    }
  },
});
