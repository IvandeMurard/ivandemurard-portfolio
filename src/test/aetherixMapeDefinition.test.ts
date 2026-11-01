import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { GLOSSARY } from "../content/glossary";

// The MAPE definition next to the benchmark figures is the glossary's, word for word.
const definition = Object.values(GLOSSARY).find((g) => g.term === "MAPE")!.brief;

describe("Aetherix MAPE definition", () => {
  it("is the glossary text, on the markdown, the llms mirror and the page", () => {
    expect(definition).toMatch(/^Mean absolute percentage error\./);
    for (const file of ["public/aetherix.md", "public/llms-full.txt", "src/pages/Atherix.tsx"]) {
      expect(readFileSync(file, "utf8")).toContain(definition);
    }
  });
  it("sits right after the benchmark figures in the markdown", () => {
    const md = readFileSync("public/aetherix.md", "utf8");
    expect(md.indexOf(definition)).toBeGreaterThan(md.indexOf("The protocol was not pre-registered for this run."));
    expect(md.indexOf(definition) - md.indexOf("The protocol was not pre-registered for this run.")).toBeLessThan(400);
  });
});
