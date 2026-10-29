import { describe, expect, it } from "vitest";
import { getRoseSystemPrompt } from "../../supabase/functions/_shared/rose-context";

// §11.6: Aetherix figures and rules must not leak into Rose-only answers.
const AETHERIX_FIGURES = ["49.71", "55.86", "28.5%", "27.9%", "15.9%", "12.3%", "MAPE"];

const roseOnly = () => getRoseSystemPrompt({
  page: { path: "/rose-design-lab", section_id: "ch-learn", section_heading: "Does Rose actually help?" },
  question: "What does Ivan measure about Rose?",
});

describe("Rose prompt scope (§11.4, §11.6, §11.7)", () => {
  it("a Rose-only prompt contains no Aetherix figures", async () => {
    const prompt = await roseOnly();
    for (const figure of AETHERIX_FIGURES) expect(prompt).not.toContain(figure);
    expect(prompt).not.toContain("Aetherix answer rules");
  });

  it("the Chapter 06 section no longer pulls Aetherix into scope", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/rose-design-lab", section_id: "ch-next" }, question: "What does Ivan measure here?" });
    for (const figure of AETHERIX_FIGURES) expect(prompt).not.toContain(figure);
  });

  it("an Aetherix prompt loads the Aetherix rules with both caveats", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/aetherix" }, question: "What does Ivan measure?" });
    expect(prompt).toContain("Aetherix answer rules");
    expect(prompt).toContain("next-day forecasts");
    expect(prompt).toContain("public restaurant data only");
  });

  it("a broad question on the homepage loads the Aetherix rules", async () => {
    const prompt = await getRoseSystemPrompt({ page: { path: "/" }, question: "What has Ivan built?" });
    expect(prompt).toContain("Aetherix answer rules");
  });

  it("a Rose-only prompt forbids describing unloaded projects", async () => {
    expect(await roseOnly()).toContain("Never describe what another project does, measures or contains unless its reference block is in this prompt. If another project is relevant, name it and link to its page, with no claim about it.");
  });

  it("every prompt carries the figures rule and the 90/180 word budget", async () => {
    const prompt = await roseOnly();
    expect(prompt).toContain("never alone");
    expect(prompt).toContain("90 words");
    expect(prompt).toContain("180 words");
    expect(prompt).toContain('Never derive "proves", "adds value" or "better than a human"');
    expect(prompt).toContain("Never nudge toward a booking because of the number of exchanges");
    expect(prompt).not.toContain("110 words");
  });
});
