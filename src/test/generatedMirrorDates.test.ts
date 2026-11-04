import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { normalizeEol, stableDate, writeIfChanged } from "../../scripts/content-date";

// "Last updated" in public/agents.md, AGENTS_BUILD_DATE and the sitemap lastmod are the date of the last content
// change, not the build date: a build with no content change rewrites no file.

describe("stableDate", () => {
  const render = (d: string) => `agents page\nLast updated ${d}.\n`;

  it("keeps the committed date when the content is unchanged, whatever day it is built", () => {
    expect(stableDate({ render, existing: render("2026-11-03"), existingDate: "2026-11-03", today: "2026-12-01" })).toBe("2026-11-03");
    expect(stableDate({ render, existing: render("2026-11-03"), existingDate: "2026-11-03", today: "2027-01-01" })).toBe("2026-11-03");
  });

  it("uses today when the content changed", () => {
    expect(stableDate({ render, existing: "an older page\nLast updated 2026-11-03.\n", existingDate: "2026-11-03", today: "2026-12-01" })).toBe("2026-12-01");
  });

  it("uses today when there is no file yet or no date in it", () => {
    expect(stableDate({ render, existing: null, existingDate: null, today: "2026-12-01" })).toBe("2026-12-01");
    expect(stableDate({ render, existing: "x", existingDate: null, today: "2026-12-01" })).toBe("2026-12-01");
  });

  it("does not take a line-ending difference for a content change", () => {
    const crlf = normalizeEol(render("2026-11-03")).replace(/\n/g, "\r\n");
    expect(stableDate({ render, existing: crlf, existingDate: "2026-11-03", today: "2026-12-01" })).toBe("2026-11-03");
  });
});

describe("writeIfChanged", () => {
  const dir = mkdtempSync(join(tmpdir(), "write-if-changed-"));
  afterAll(() => rmSync(dir, { recursive: true, force: true }));

  it("writes a new file, skips identical content (even with CRLF), and rewrites a changed one", () => {
    const file = join(dir, "a.txt");
    expect(writeIfChanged(file, "one\ntwo\n")).toBe(true);
    expect(writeIfChanged(file, "one\ntwo\n")).toBe(false);
    writeFileSync(file, "one\r\ntwo\r\n");
    expect(writeIfChanged(file, "one\ntwo\n")).toBe(false);
    expect(readFileSync(file, "utf8")).toBe("one\r\ntwo\r\n"); // untouched
    expect(writeIfChanged(file, "one\nthree\n")).toBe(true);
  });
});

describe("two builds in a row with no content change leave the tracked files as they were", () => {
  const repo = resolve(".");
  let work: string;
  const GENERATORS = ["generate-agents.ts", "generate-journal-mirror.ts", "generate-rose-mirror.ts", "generate-sitemap.ts", "generate-llms-full.ts"];

  /** Runs the real prebuild generators, in a scratch copy of the files they write, on a given day. */
  const build = (today: string) => {
    for (const script of GENERATORS) {
      const runner = script === "generate-journal-mirror.ts" || script === "generate-rose-mirror.ts" ? "bun" : "bun x tsx";
      execSync(`${runner} "${join(repo, "scripts", script)}"`, { cwd: work, env: { ...process.env, BUILD_TODAY: today }, stdio: "pipe", shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh" });
    }
  };

  const TRACKED = ["public/agents.md", "public/llms-full.txt", "public/sitemap.xml", "src/content/agents.generated.ts",
    "public/agent-boundaries-aetherix.md", "public/harnesses-graders-closed-loops.md", "public/whose-truth-is-the-ground-truth.md", "public/rose-design-lab.md"];
  const snapshot = () => Object.fromEntries(TRACKED.map((f) => [f, normalizeEol(readFileSync(join(work, f), "utf8"))]));

  beforeAll(() => {
    work = mkdtempSync(join(tmpdir(), "mirror-dates-"));
    mkdirSync(join(work, "public"), { recursive: true });
    mkdirSync(join(work, "scripts"), { recursive: true });
    mkdirSync(join(work, "src/content"), { recursive: true });
    for (const f of readdirSync(join(repo, "public"))) if (/\.(md|txt|xml)$/.test(f)) cpSync(join(repo, "public", f), join(work, "public", f));
    cpSync(join(repo, "scripts/llms-full-preamble.txt"), join(work, "scripts/llms-full-preamble.txt"));
    cpSync(join(repo, "src/content/agents.generated.ts"), join(work, "src/content/agents.generated.ts"));
  });
  afterAll(() => rmSync(work, { recursive: true, force: true }));

  it("leaves every date-bearing and mirror file byte-identical, on the same day and on a later one", () => {
    const before = snapshot();
    build("2026-12-01");
    expect(snapshot()).toEqual(before);
    build("2026-12-02");
    expect(snapshot()).toEqual(before);
    build("2027-03-15");
    expect(snapshot()).toEqual(before);
  }, 180_000);

  it("moves the date when the content does change, and only then", () => {
    const sonor = join(work, "public/sonor.md");
    writeFileSync(sonor, readFileSync(sonor, "utf8").replace(/^(# .*)$/m, "$1 (edited)"));
    build("2026-12-03");
    const edited = snapshot();
    expect(edited["public/agents.md"]).toContain("Last updated 2026-12-03");
    expect(edited["src/content/agents.generated.ts"]).toContain('AGENTS_BUILD_DATE = "2026-12-03"');
    // The next build, with no further change, keeps that date.
    build("2026-12-09");
    expect(snapshot()).toEqual(edited);
  }, 180_000);

  it("moves the sitemap lastmod only when the route list changed", () => {
    const file = join(work, "public/sitemap.xml");
    const before = normalizeEol(readFileSync(file, "utf8"));
    expect(existsSync(file)).toBe(true);
    // An older sitemap with one route fewer: the route list changed, so lastmod is today's date.
    writeFileSync(file, before.replace(/ {2}<url>\n {4}<loc>[^\n]*<\/loc>\n[\s\S]*?<\/url>\n/, ""));
    build("2026-12-20");
    const after = normalizeEol(readFileSync(file, "utf8"));
    expect(after).toContain("<lastmod>2026-12-20</lastmod>");
    expect(after).not.toContain("<lastmod>2026-11");
    build("2027-01-05");
    expect(normalizeEol(readFileSync(file, "utf8"))).toBe(after);
  }, 180_000);
});
