import { describe, expect, it } from "vitest";
import {
  getRoseCuratedAnswer,
  ROSE_AETHERIX_MEASUREMENT_ANSWER,
  ROSE_AETHERIX_TECHNICAL_EVALUATION_ANSWER,
} from "../../supabase/functions/_shared/rose-curated-answers";

describe("Rose source-backed Aetherix answers", () => {
  it("serves the measurement answer only on /aetherix", () => {
    expect(getRoseCuratedAnswer({ question: "What does Ivan measure?", pagePath: "/aetherix" })).toBe(ROSE_AETHERIX_MEASUREMENT_ANSWER);
    expect(getRoseCuratedAnswer({ question: "What does Ivan measure?", pagePath: "/cv" })).toBeNull();
  });
  it("keeps the seven documented values and the boundaries in reader terms", () => {
    for (const value of ["30 restaurants", "49.71%", "55.86%", "28.5% versus 27.9%", "25% shift", "15.9% to 12.3%"]) {
      expect(ROSE_AETHERIX_MEASUREMENT_ANSWER).toContain(value);
    }
    expect(ROSE_AETHERIX_MEASUREMENT_ANSWER).toContain("not whether a staffing decision was optimal");
    expect(ROSE_AETHERIX_MEASUREMENT_ANSWER).toContain("no real hotel is connected");
    expect(ROSE_AETHERIX_MEASUREMENT_ANSWER).not.toMatch(/MAPE|recommendation error/);
  });
  it("states the merge contract for the technical question", () => {
    expect(getRoseCuratedAnswer({
      question: "How do evaluation gates protect Aetherix changes to forecasting, providers, memory or prompts before merge?",
      pagePath: "/aetherix",
    })).toBe(ROSE_AETHERIX_TECHNICAL_EVALUATION_ANSWER);
    expect(ROSE_AETHERIX_TECHNICAL_EVALUATION_ANSWER).toContain("A failing evaluation exit code blocks a merge.");
    expect(ROSE_AETHERIX_TECHNICAL_EVALUATION_ANSWER).toContain("it is not the merge decision");
  });
});
