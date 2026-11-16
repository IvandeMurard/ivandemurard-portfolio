import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// The Aetherix CI gate runs on synthetic scenarios; only the public restaurant benchmark is real data.
// The v2 case study moved the sentence "A fixed set of synthetic scenarios checks every change." out with the old
// "How it's built" list (chapter 06 comes back in the next branch with the reference copy, which words it
// "A fixed set of scenarios checks every change"). Until then the test keeps the part that still holds on the
// page and the markdown: the gate is never described as real-world.
describe("Aetherix CI gate wording", () => {
  it("never calls the gate's scenarios real-world", () => {
    for (const file of ["public/aetherix.md", "src/pages/Atherix.tsx", "src/content/aetherixCase.ts"]) {
      const text = readFileSync(file, "utf8");
      expect(text).not.toContain("fixed set of real-world scenarios");
    }
  });

  it("the Atrium blurb states today's stage and the snapshot matches it", () => {
    const blurb = "Built to forecast covers every day from each hotel's own data. Today: evaluated on historical data and staged on the Apaleo sandbox; staffing and waste outcomes are pilot hypotheses, not measured results.";
    expect(readFileSync("src/content/site.ts", "utf8")).toContain(blurb);
    expect(readFileSync("prerendered/atrium.html", "utf8")).toContain(blurb);
    expect(readFileSync("prerendered/atrium.html", "utf8")).not.toContain("against real data");
  });
});

