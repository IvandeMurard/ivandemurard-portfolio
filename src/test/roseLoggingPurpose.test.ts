import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// The purpose of question logging, stated once per surface, in the third person (validated by Ivan).
const PURPOSE = "so Ivan can see how visitors use Rose, which topics they ask about and where her answers fail";

const flat = (file: string) => readFileSync(file, "utf8").replace(/\s+/g, " ");
const surfaces = {
  "/privacy": "src/pages/Privacy.tsx",
  "Rose self-knowledge": "src/content/roseHistory.ts",
  "generated history": "docs/rose-history.generated.md",
};

describe("Question logging purpose", () => {
  for (const [name, file] of Object.entries(surfaces)) {
    it(`${name} states the purpose exactly once`, () => {
      expect(flat(file).split(PURPOSE)).toHaveLength(2);
    });
  }
  it("is on the question-logging entry, next to the retention and masking text", () => {
    const history = flat("src/content/roseHistory.ts");
    const entry = history.slice(history.indexOf('id: "question-logging"'));
    expect(entry.indexOf("masked before storage")).toBeGreaterThan(-1);
    expect(entry.indexOf(PURPOSE)).toBeGreaterThan(entry.indexOf("masked before storage"));
    expect(entry.indexOf(PURPOSE)).toBeLessThan(entry.indexOf('id: "dom-integrity"'));
  });
  it("leaves the persona and the prompt alone: no first-person purpose statement there", () => {
    for (const file of ["src/content/rosePersona.ts", "supabase/functions/_shared/rose-context.ts"]) {
      const text = flat(file);
      expect(text, file).not.toContain(PURPOSE);
      expect(text, file).not.toMatch(/so Ivan can see how visitors use/i);
    }
  });
});
