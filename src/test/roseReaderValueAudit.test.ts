import { describe, expect, it } from "vitest";
import { flagRoseReaderValue } from "../lib/roseReaderValueAudit";

describe("Rose reader-value QA (offline advisory)", () => {
  it("flags internal engineering jargon in an ordinary measurement answer", () => {
    const result = flagRoseReaderValue(
      "What does Ivan measure?",
      "Prophet forecast error is compared with the baseline. Every code change must pass versioned golden datasets.",
      "/aetherix",
    );
    expect(result.map(warning => warning.code)).toContain("unrequested_implementation_detail");
  });

  it("allows details of the test harness when the visitor explicitly asks about testing", () => {
    const result = flagRoseReaderValue(
      "How do your tests and release gates work?",
      "The golden datasets determine whether code changes are accepted.",
      "/aetherix",
    );
    expect(result.map(warning => warning.code)).not.toContain("unrequested_implementation_detail");
  });

  it("does not penalize a factual reader-first answer without implementation jargon", () => {
    expect(flagRoseReaderValue(
      "What does Ivan measure?",
      "He compares forecast error on public restaurant data against a simple baseline and has not validated outcomes in a live hotel.",
      "/aetherix",
    )).toEqual([]);
  });

  it("reports the broken link and unsupported guardrail-reliability phrasing observed in Lovable", () => {
    const result = flagRoseReaderValue(
      "What does Ivan measure?",
      "He measures guardrail reliability. See [Agent Boundaries](/agent-boundaries-aetherix).",
      "/aetherix",
    );
    expect(result.map(warning => warning.code)).toEqual([
      "noncanonical_field_note_link",
      "unsupported_guardrail_reliability",
    ]);
  });

  it("does not report a correctly scoped description of unmeasured guardrails", () => {
    expect(flagRoseReaderValue(
      "What does Ivan measure?",
      "Guardrail reliability is not measured yet. See [Agent Boundaries](/journal/agent-boundaries-aetherix).",
      "/aetherix",
    )).toEqual([]);
  });
});
