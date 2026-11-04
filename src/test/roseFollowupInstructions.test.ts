import { describe, expect, it } from "vitest";
import {
  ROSE_FOLLOWUPS_TOOL_DESCRIPTION, ROSE_FOLLOWUP_VOICE, isRoseFollowupAllowed, roseFollowupPolicyDescription,
} from "../../supabase/functions/_shared/rose-tool-contract";

// The model copied the one example question in the instructions into 67 of 80 answers
// (docs/rose-eval-2026-11-03-career.md, "Still open"). The instructions now describe the form only.
const instructions = () => [
  ROSE_FOLLOWUPS_TOOL_DESCRIPTION,
  ROSE_FOLLOWUP_VOICE,
  roseFollowupPolicyDescription({ question: "What kind of role is Ivan looking for?", pagePath: "/rose-design-lab" }),
  roseFollowupPolicyDescription({ question: "What does Ivan measure?", pagePath: "/aetherix" }),
  roseFollowupPolicyDescription({ question: "How do evaluation gates protect Aetherix changes to forecasting, providers, memory or prompts before merge?", pagePath: "/aetherix" }),
];

describe("Rose follow-up instructions", () => {
  it("contain no quoted example question the model can copy", () => {
    for (const text of instructions()) {
      expect(text).not.toMatch(/["'“‘][^"'“”‘’]{12,}\?["'”’]/); // a quoted sentence ending in a question mark
      expect(text).not.toMatch(/\bfor example\b/i);
      expect(text).not.toContain("Would you tell me more");
      expect(text).not.toContain("AI-native projects");
    }
  });

  it("describe the form: a polite question to Rose, Ivan in the third person, about something the answer mentioned", () => {
    for (const text of [ROSE_FOLLOWUPS_TOOL_DESCRIPTION, ROSE_FOLLOWUP_VOICE]) {
      expect(text).toMatch(/polite question to Rose/);
      expect(text).toMatch(/third person/);
      expect(text).toContain('"he"');
      expect(text).toContain('"his"');
      expect(text).toMatch(/answer[^.]*mentioned/);
      expect(text).toContain('"you" or "your"');
    }
  });

  it("keep the policy for the two Aetherix measurement questions", () => {
    expect(roseFollowupPolicyDescription({ question: "What does Ivan measure?", pagePath: "/aetherix" })).toContain("plain-language Aetherix measurement question");
    expect(roseFollowupPolicyDescription({ question: "How do evaluation gates protect Aetherix changes to forecasting, providers, memory or prompts before merge?", pagePath: "/aetherix" })).toContain("gates, case sets");
  });

  it("leave isRoseFollowupAllowed as it was: third person allowed, addressing Ivan as you rejected", () => {
    const ctx = { question: "What kind of role is Ivan looking for?", pagePath: "/rose-design-lab" };
    expect(isRoseFollowupAllowed("Would you tell me more about his AI-native projects?", ctx)).toBe(true);
    expect(isRoseFollowupAllowed("What is your role?", ctx)).toBe(false);
  });
});
