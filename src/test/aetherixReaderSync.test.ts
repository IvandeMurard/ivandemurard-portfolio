import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import getCaseStudy from "../lib/mcp/tools/get-case-study";
import listCaseStudies from "../lib/mcp/tools/list-case-studies";
import { HERO, TLDR } from "../content/aetherixCase";
import { STATUSES } from "../content/statuses";
import { getRoseSystemPrompt } from "../../supabase/functions/_shared/rose-context";

afterEach(() => vi.unstubAllGlobals());

describe("Aetherix shared reader sources", () => {
  it("passes the same complete case study to Rose and MCP without losing the sandbox status", async () => {
    vi.stubGlobal("fetch", async (url: string) => new Response(
      readFileSync(`public/${new URL(url).pathname.slice(1)}`, "utf8"),
      { status: 200 },
    ));
    const md = readFileSync("public/aetherix.md", "utf8");
    const tool = getCaseStudy as unknown as { handler: (input: object) => Promise<{ structuredContent: { markdown: string } }> };
    const response = await tool.handler({ slug: "aetherix" });
    const prompt = await getRoseSystemPrompt({ page: { path: "/aetherix" }, question: "What problem does Aetherix address?" });
    expect(response.structuredContent.markdown).toContain(md);
    expect(prompt).toContain(`--- BEGIN CASE STUDY: aetherix ---\n${md}\n--- END CASE STUDY: aetherix ---`);
    expect(response.structuredContent.markdown).toContain(STATUSES.aetherix.note);
    expect(prompt).toContain(STATUSES.aetherix.note);
  });

  it("derives the MCP listing from the page's maintained problem and delivery status", () => {
    const tool = listCaseStudies as unknown as { handler: () => { structuredContent: { case_studies: Array<{ slug: string; tagline: string; status: { note: string } }> } } };
    const study = tool.handler().structuredContent.case_studies.find(item => item.slug === "aetherix");
    expect(study?.tagline).toBe(`${HERO.headline.join("")} ${TLDR[0][1]} ${HERO.lead} ${STATUSES.aetherix.note}`);
    expect(study?.status.note).toBe(STATUSES.aetherix.note);
  });
});