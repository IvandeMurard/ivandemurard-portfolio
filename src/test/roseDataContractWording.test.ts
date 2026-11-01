import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// One fact, one wording: every surface that states the Rose data contract uses these sentences.
const CONVERSATION = "Your conversation stays in this tab for 60 minutes, or until you reload the page.";
const QUESTIONS = "Questions are stored, then purged after 90 days. Emails, phone numbers, addresses, card and bank numbers are masked before storage.";

const flat = (file: string) => readFileSync(file, "utf8").replace(/\s+/g, " ");
const surfaces = {
  "copy deck §6.5": "docs/rose-case-study-copy.md",
  "/privacy": "src/pages/Privacy.tsx",
  "dock disclosure": "src/components/rose/RoseDock.tsx",
  "Rose self-knowledge": "src/content/roseHistory.ts",
  "generated history": "docs/rose-history.generated.md",
};

describe("Rose data contract wording", () => {
  for (const [name, file] of Object.entries(surfaces)) {
    it(`${name} states the conversation sentence`, () => {
      expect(flat(file)).toContain(CONVERSATION);
    });
    it(`${name} states the questions sentence`, () => {
      expect(flat(file)).toContain(QUESTIONS);
    });
  }
  it("no surface still states the superseded wording", () => {
    for (const file of [...Object.values(surfaces), "docs/rose-case-study.md", "src/components/rose/RoseLaterChapters.tsx"]) {
      expect(flat(file), file).not.toMatch(/hard refresh|personal details masked|email and phone (patterns )?masking?|Reloading or Clear erases/i);
    }
  });
});
