import { readFileSync } from "fs";
import { describe, expect, it } from "vitest";
import { renderJournalMeta } from "../../scripts/generate-journal-meta";

describe("Field Notes index data is split from the note bodies", () => {
  it("the generated index matches journal.ts (run bun scripts/generate-journal-meta.ts when this fails)", () => {
    expect(readFileSync("src/content/journalMeta.generated.ts", "utf8")).toBe(renderJournalMeta());
  });
  it("journalIndex.ts never imports the note bodies", () => {
    expect(readFileSync("src/content/journalIndex.ts", "utf8")).not.toMatch(/from "\.\/journal"|@\/content\/journal"/);
  });
});
