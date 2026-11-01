import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// The Aetherix CI gate runs on synthetic scenarios; only the public restaurant benchmark is real data.
const SENTENCE = "A fixed set of synthetic scenarios checks every change.";

describe("Aetherix CI gate wording", () => {
  it("says synthetic on the markdown and the page, never real-world", () => {
    for (const file of ["public/aetherix.md", "src/pages/Atherix.tsx"]) {
      const text = readFileSync(file, "utf8");
      expect(text).toContain(SENTENCE);
      expect(text).not.toContain("fixed set of real-world scenarios");
    }
  });
});
