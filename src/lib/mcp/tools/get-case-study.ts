import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const SITE_ORIGIN = "https://ivandemurard.com";

const SLUGS = {
  sonor: "/sonor.md",
  aetherix: "/aetherix.md",
  tacet: "/tacet.md",
} as const;

export default defineTool({
  name: "get_case_study",
  title: "Get case study",
  description:
    "Fetch the full Markdown narrative for one case study by slug. Slugs: 'sonor', 'aetherix', 'tacet'. Content covers vision, architecture, stack and outcomes.",
  inputSchema: {
    slug: z
      .enum(["sonor", "aetherix", "tacet"])
      .describe("Case study slug: sonor, aetherix, or tacet."),
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
      const markdown = await res.text();
      return {
        content: [{ type: "text", text: markdown }],
        structuredContent: {
          slug,
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
