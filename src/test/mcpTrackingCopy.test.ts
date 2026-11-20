import { describe, expect, it } from "vitest";
import { AGENTS_DOC, MCP_TRACKING_COPY, MCP_TRACKING_SINCE } from "../content/agents";

describe("Published tracking copy", () => {
  it("names a start date as soon as one is set, and never speaks of agents or users", () => {
    if (MCP_TRACKING_SINCE) {
      expect(MCP_TRACKING_SINCE).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(MCP_TRACKING_COPY).toContain(`resumed on ${MCP_TRACKING_SINCE}`);
      expect(MCP_TRACKING_COPY).toContain("The unit is the call");
    } else {
      expect(MCP_TRACKING_COPY).toContain("suspended");
    }
    expect(MCP_TRACKING_COPY).not.toContain("—");
  });

  it("lists the tools that read by section", () => {
    const lines = Object.fromEntries(AGENTS_DOC.tools.map(([name, text]) => [name, text]));
    for (const name of ["get_case_study", "get_journal_entry"]) {
      expect(lines[name]).toContain("outline_only");
      expect(lines[name]).toContain("section");
    }
  });
});
