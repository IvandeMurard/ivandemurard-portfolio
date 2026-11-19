import { describe, expect, it } from "vitest";
import { outline, section } from "@/lib/mcp/sections";

const md = "Status: x\n\n# Title\n\n## Vision\nA\n\n### Sub\nB\n\n## Outcomes\nC";

describe("MCP section reading", () => {
  it("lists only top-level sections", () => {
    expect(outline(md)).toEqual(["Vision", "Outcomes"]);
  });
  it("returns one section with its subsections, stopping at the next", () => {
    expect(section(md, "vision")).toBe("## Vision\nA\n\n### Sub\nB");
  });
  it("returns null for an unknown section", () => {
    expect(section(md, "pricing")).toBeNull();
  });
});
