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
  rose: "/rose-design-lab.md",
  compass: "/compass.md",
} as const;

/** The page of a case study is its mirror's path without ".md", except Rose, whose slug is shorter than her route. */
const PAGES: Partial<Record<keyof typeof SLUGS, string>> = { rose: "/rose-design-lab" };

export default defineTool({
  name: "get_case_study",
  title: "Get case study",
  description:
    "Fetch the full Markdown narrative for one case study by slug. Slugs: 'sonor', 'aetherix', 'tacet', 'lore', 'anima', 'rose', 'compass'. The text starts with fixed 'Key: value' lines (Slug, Group when present, Source URL, Canonical URL), a blank line, then the Markdown once. The Markdown's first line states the project status (for example Status: Pilot-ready · ...); the rest covers vision, architecture, stack and outcomes.",
  inputSchema: {
    slug: z
      .enum(["sonor", "aetherix", "tacet", "lore", "anima", "rose", "compass"])
      .describe("Case study slug: sonor, aetherix, tacet, lore, anima, rose, or compass."),
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
      const group = slug === "compass" ? "Standalone projects" : undefined;
      const canonicalUrl = `${SITE_ORIGIN}${PAGES[slug] ?? `/${slug}`}`;
      // Every structuredContent field except the Markdown is a fixed "Key: value" line, then the Markdown once.
      const header = [
        `Slug: ${slug}`,
        ...(group ? [`Group: ${group}`] : []),
        `Source URL: ${url}`,
        `Canonical URL: ${canonicalUrl}`,
      ].join("\n");
      return {
        content: [{ type: "text", text: `${header}\n\n${markdown}` }],
        structuredContent: {
          slug,
          ...(group ? { group } : {}),
          source_url: url,
          canonical_url: canonicalUrl,
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
