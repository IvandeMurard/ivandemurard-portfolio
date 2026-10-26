import { describe, expect, it } from "vitest";
import { flagRoseFollowupValue, flagRoseReaderValue } from "../lib/roseReaderValueAudit";

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

  it("flags the observed confusion between forecast error and recommendation accuracy", () => {
    const result = flagRoseReaderValue(
      "What does Ivan measure?",
      "Ivan measures the forecast error of the agent's recommendations against what actually happened.",
      "/aetherix",
    );
    expect(result.map(warning => warning.code)).toContain("forecast_recommendation_boundary");
  });

  it("flags inflated DomusVi rollout framing but permits the sourced status", () => {
    const inflated = flagRoseReaderValue(
      "What did Ivan deliver at DomusVi?",
      "Delivery at Scale: the product was rolled out to 500+ users across 100 care homes.",
      "/cv",
    );
    expect(inflated.map(warning => warning.code)).toContain("inflated_delivery_status");

    expect(flagRoseReaderValue(
      "What did Ivan deliver at DomusVi?",
      "He delivered the MVP and prepared deployment and training. The rollout was planned for 500+ users across 100 care homes.",
      "/cv",
    ).map(warning => warning.code)).not.toContain("inflated_delivery_status");
  });

  it("flags the technical evaluation-gate overclaims observed in Stage B v2", () => {
    const question = "How do evaluation gates protect Aetherix changes to forecasting, providers, memory or prompts before merge?";
    const answer = "A hard CI gate blocks any change that regresses quality. This ensures prompts, providers and memory do not introduce silent failures. Forecast evaluation uses a synthetic series with a stand-in parser. Any trip of the guardrails emits a reason that blocks the merge. See the [Aetherix architecture](https://ivandemurard.com/journal/agent-boundaries-aetherix).";
    const result = flagRoseReaderValue(question, answer, "/aetherix");
    expect(result.map(warning => warning.code)).toEqual(expect.arrayContaining([
      "unscoped_evaluation_gate",
      "unsupported_gate_guarantee",
      "mixed_evaluation_layers",
      "guardrail_merge_conflation",
      "misleading_evaluation_link",
    ]));
  });

  it("flags Lore evidence and release wording transferred into an Aetherix gate answer", () => {
    const question = "How do evaluation gates protect Aetherix changes to forecasting, providers, memory or prompts before merge?";
    const answer = "The harness runs fixed scenarios through the real model path, scoring them with deterministic graders. A refusal to follow the recovery procedure emits a failing exit code that blocks the release.";
    expect(flagRoseReaderValue(question, answer, "/aetherix").map(warning => warning.code)).toEqual(expect.arrayContaining([
      "transferred_lore_evaluation",
      "release_not_merge",
    ]));
  });

  it("flags the v4 gate answer's generic merge claim, blended layers and invented checks", () => {
    const question = "How do evaluation gates protect Aetherix changes to forecasting, providers, memory or prompts before merge?";
    const answer = "The Aetherix evaluation gate acts as a hard CI block to prevent regressions before any code is merged. It requires a passing exit code for changes affecting the core logic. Forecasting validates accuracy against a synthetic data series and a rule-based parser. Providers check response format, memory ensures retrieval of historical context remains relevant, and prompts verify the refusal contract or safety guardrails.";
    expect(flagRoseReaderValue(question, answer, "/aetherix").map(warning => warning.code)).toEqual(expect.arrayContaining([
      "unscoped_evaluation_gate",
      "mixed_evaluation_layers",
      "invented_evaluation_detail",
      "missing_merge_exit_code",
    ]));
  });

  it("permits a scoped technical evaluation answer and flags an unsupported override follow-up", () => {
    const question = "How do evaluation gates protect Aetherix changes to forecasting, providers, memory or prompts before merge?";
    const answer = "Changes to forecasting, providers, memory and prompts need a green evaluation pipeline before merge. It catches known regression cases. Forecast evaluation uses a synthetic series, while the reply parser is checked with a rule-based stand-in. Guardrail trips record reasons; a failing evaluation exit code blocks merge. See [Evaluate](/journal/harnesses-graders-closed-loops).";
    expect(flagRoseReaderValue(question, answer, "/aetherix")).toEqual([]);
    expect(flagRoseFollowupValue(
      question,
      ["Show me the technical EVAL_GATE document", "How does the manager's override improve the forecast?"],
      "/aetherix",
    ).map(warning => warning.code)).toEqual(["unsupported_outcome_learning_followup"]);
    expect(flagRoseFollowupValue(
      question,
      ["Show me the restaurant benchmark results"],
      "/aetherix",
    ).map(warning => warning.code)).toEqual(["unfocused_technical_followup"]);
  });

  it("flags a tooling-led follow-up after an ordinary measurement answer", () => {
    const result = flagRoseFollowupValue(
      "What does Ivan measure?",
      ["How are evaluation gates built?", "What is the benchmark's scope?"],
      "/aetherix",
    );
    expect(result.map(warning => warning.code)).toEqual(["unrequested_implementation_followup"]);
  });

  it("allows a release-engineering follow-up when the visitor asked for it", () => {
    expect(flagRoseFollowupValue(
      "How do evaluation gates protect changes before merge?",
      ["Which changes must pass the evaluation gate?"],
      "/aetherix",
    )).toEqual([]);
  });
});
