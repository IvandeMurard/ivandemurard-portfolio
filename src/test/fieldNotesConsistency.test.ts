import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { JOURNAL_ENTRIES, JOURNAL_KNOWLEDGE_QUESTIONS } from "@/content/journal";
import { getRosePrompts } from "@/content/rosePrompts";
import { selectNotes } from "../../supabase/functions/_shared/rose-context";

const NOTES = ["harnesses-graders-closed-loops", "agent-boundaries-aetherix", "whose-truth-is-the-ground-truth"];
const read = (p: string) => readFileSync(p, "utf8");
// Current text only: drop dated correction logs, which may quote an old claim.
const current = (p: string) => read(p).split(/^## Updates|^## Update log/m)[0];

describe("Field Notes corpus", () => {
  it("has exactly the three current notes, each with a Markdown mirror", () => {
    expect(JOURNAL_ENTRIES.map((e) => e.slug).sort()).toEqual([...NOTES].sort());
    for (const s of NOTES) expect(existsSync(`public/${s}.md`)).toBe(true);
  });
  it("knowledge map points to real notes and real case studies", () => {
    for (const q of JOURNAL_KNOWLEDGE_QUESTIONS) {
      expect(NOTES).toContain(q.slug);
      for (const c of q.cases) expect(["/aetherix", "/lore"]).toContain(c.to);
    }
  });
  it("no current text says Lore receives its signed work record", () => {
    for (const p of ["public/harnesses-graders-closed-loops.md", "public/whose-truth-is-the-ground-truth.md", "public/llms.txt"])
      expect(current(p)).not.toMatch(/returns both the SOP and the signed work record/i);
  });
  it("no current text calls the Aetherix repository private", () => {
    for (const p of [...NOTES.map((s) => `public/${s}.md`), "public/llms.txt", "public/aetherix.md"])
      expect(current(p)).not.toMatch(/whose repository is private/i);
  });
  it("Rose names the real MCP tool", () => {
    const rose = read("supabase/functions/_shared/rose-context.ts");
    expect(rose).toContain("list_journal_entries");
    expect(rose).not.toMatch(/list_journal[,\s]/);
  });
  it("llms.txt lists the three questions with route-shaped Markdown URLs", () => {
    const t = read("public/llms.txt");
    for (const s of NOTES) expect(t).toContain(`/journal/${s}.md`);
    for (const q of ["01 Evaluate", "02 Set boundaries", "03 Learn"]) expect(t).toContain(q);
  });
});

describe("Rose starters per route", () => {
  const labels = (p: string) => getRosePrompts(p).map((x) => x.label);
  it.each([
    ["/journal", "Which Field Note should I read?"],
    ["/journal/harnesses-graders-closed-loops", "What should block an agent release?"],
    ["/journal/agent-boundaries-aetherix", "Where should human approval sit?"],
    ["/journal/whose-truth-is-the-ground-truth", "Why isn't approval ground truth?"],
    ["/aetherix", "What has actually been built?"],
    ["/lore", "What does the voice mentor actually do?"],
  ])("%s", (path, first) => {
    expect(labels(path)[0]).toBe(first);
    expect(labels(path).at(-1)).toBe("Book a call");
  });
});

describe("Rose loads the right note", () => {
  it("loads the current note on an article page", () => {
    expect(selectNotes("/journal/agent-boundaries-aetherix", "Summarise this")).toEqual(["agent-boundaries-aetherix"]);
  });
  it("loads a companion note named in a free-text question", () => {
    expect(selectNotes("/journal/harnesses-graders-closed-loops", "Does manager approval prove it was right?"))
      .toContain("whose-truth-is-the-ground-truth");
  });
  it("loads nothing extra for an unrelated question", () => {
    expect(selectNotes("/sonor", "When did Sonor stop?")).toEqual([]);
  });
});
