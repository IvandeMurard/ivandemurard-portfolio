import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { AETHERIX_CHAPTERS, CLOSE, HERO, HOW, LEGEND, PROBLEM, PROVEN, STRATEGY, TECH_LABEL, TLDR } from "../content/aetherixCase";

// The page renders src/content/aetherixCase.ts; public/aetherix.md must carry the same words.
const md = readFileSync("public/aetherix.md", "utf8");
const page = readFileSync("src/pages/Atherix.tsx", "utf8");

describe("Aetherix Markdown mirror", () => {
  it("has every chapter heading, and the kicker numbers in order", () => {
    let at = -1;
    for (const c of AETHERIX_CHAPTERS) {
      expect(md, c.heading).toContain(c.heading);
      const k = md.indexOf(`## ${c.kicker}`);
      expect(k, c.kicker).toBeGreaterThan(at);
      at = k;
    }
    expect(md.indexOf(`## ${CLOSE.kicker}`)).toBeGreaterThan(at);
  });

  it("carries the hero, the TL;DR, the legend and the close", () => {
    for (const s of [HERO.lead, HERO.role, HERO.status, CLOSE.heading, CLOSE.text, TECH_LABEL]) expect(md, s).toContain(s);
    for (const [t, d] of TLDR) expect(md).toContain(`${t}: ${d}`);
    for (const [t, d] of LEGEND) expect(md).toContain(`${t}: ${d}`);
  });

  it("carries chapters 01 to 04 word for word", () => {
    for (const s of [PROBLEM.p1, PROBLEM.p2, PROBLEM.origin, HOW.intro, HOW.note, STRATEGY.intro, PROVEN.workingNote, PROVEN.testLimit]) expect(md, s).toContain(s);
    for (const [label, text] of HOW.steps) expect(md).toContain(`${label.replace(/^\d · /, "")}: ${text}`);
    for (const [, title, why] of STRATEGY.decisions) expect(md).toContain(`| ${title} | ${why} |`);
    for (const u of STRATEGY.unproven) expect(md, u).toContain(u);
    for (const w of PROVEN.working) { const t = typeof w === "string" ? w : w.join(""); expect(md, t).toContain(t); }
    expect(md).toContain(PROVEN.test.join(""));
    for (const [glyph, label, text] of PROVEN.phases) expect(md).toContain(`${glyph} ${label}: ${text}`);
  });

  it("states the parties of the who figure", () => {
    expect(md).toContain(STRATEGY.whoCaption);
    for (const p of STRATEGY.who) expect(md).toContain(`- ${p.role}: ${p.name}. ${p.text}`);
  });
});

describe("Aetherix page", () => {
  it("drops what the v2 reference drops", () => {
    expect(page).not.toContain("EntryActions");
    expect(page).not.toContain("CaseAnchors");
    expect(page).not.toContain("AetherixDailyReceipt");
    expect(page).not.toContain("What the manager receives");
    expect(md).not.toContain("What the manager receives");
    expect(md).not.toContain("Mock-up of the message format");
  });

  it("renders the existing homepage loop, not a redrawing", () => {
    expect(page).toContain('import { AetherixHomepageLoop } from "@/components/atherix/AetherixHomepageLoop"');
  });
});
