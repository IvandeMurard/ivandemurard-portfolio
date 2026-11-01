import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// One fact, one wording: every surface that states the Rose data contract uses these sentences.
const CONVERSATION = "Reloading the page or pressing Clear erases it.";
const QUESTIONS = "email addresses, phone numbers, postal addresses, links, card numbers, IBANs and IP addresses masked by pattern, then deleted after 90 days.";

const flat = (file: string) => readFileSync(file, "utf8").replace(/\s+/g, " ");
const surfaces = {
  "copy deck §6.5": "docs/rose-case-study-copy.md",
  "/privacy": "src/pages/Privacy.tsx",
  "Rose self-knowledge": "src/content/roseHistory.ts",
  "generated history": "docs/rose-history.generated.md",
};

describe("Rose data contract wording", () => {
  for (const [name, file] of Object.entries(surfaces)) {
    it(`${name} states the questions sentence`, () => {
      expect(flat(file)).toContain(QUESTIONS);
    });
    it(`${name} states the reload and Clear sentence`, () => {
      expect(flat(file)).toContain(CONVERSATION);
    });
  }
  it("the dock disclosure mentions reload, Clear and the 90-day deletion", () => {
    const dock = flat("src/components/rose/RoseDock.tsx");
    expect(dock).toContain("Reloading or Clear erases this chat.");
    expect(dock).toContain("deleted after 90 days");
  });
  it("no surface still claims a hard refresh or personal details masked", () => {
    for (const file of [...Object.values(surfaces), "docs/rose-case-study.md", "src/components/rose/RoseDock.tsx"]) {
      expect(flat(file), file).not.toMatch(/hard refresh|personal details masked|email and phone (patterns )?masking?/i);
    }
  });
});
