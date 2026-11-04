import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import {
  CLOSE, GOT_WRONG, HERO, HERO_LEAD, IDEA, MILESTONES, NEXT, QUESTIONS, ROSE_CHAPTERS, RoseCaseStudy, SIX, TLDR, TRUST, CHAPTER_MARK,
} from "@/components/rose/RoseCaseStudy";
import { DESIGN_EXCHANGES, HERO_EXCHANGES, PASSAGE_QUESTIONS } from "@/components/rose/roseDemoData";
import { CONTACT } from "@/content/site";
import { STATUSES } from "@/content/statuses";
import { ROSE_NOTE_LABEL, renderRoseMirror } from "../../scripts/rose-mirror";

// public/rose-design-lab.md is generated from the page's own constants. It has every chapter, the markers, the sources,
// the cases and the test loop, the open questions and the contact; Rose's notes are marked as Ivan's; the demos are
// described in one line each as scripted; and it says nothing that the page does not.

const DATE = "2026-11-05";
const md = renderRoseMirror(DATE);
const committed = readFileSync("public/rose-design-lab.md", "utf8").replace(/\r\n/g, "\n");

const norm = (t: string) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();

describe("Rose mirror: what it contains", () => {
  it("starts with the title, the label, the status line and the lead", () => {
    const lines = md.split("\n\n");
    expect(lines[0]).toBe(`# ${HERO.headline.join("")}`);
    expect(lines[1]).toBe(HERO.label);
    expect(lines[2]).toBe(`Status: ${HERO.status}`);
    expect(`Status: ${HERO.status}`).toBe("Status: Live, text only");
    expect(STATUSES.rose.word).toBe(HERO.status);
    expect(lines[3]).toBe(`Last updated ${DATE}.`);
    expect(lines[4]).toBe(HERO_LEAD);
  });

  it("has the TL;DR", () => {
    expect(md).toContain("## TL;DR");
    for (const [t, d] of TLDR) expect(md).toContain(`- ${t}: ${d}`);
  });

  it("has every chapter heading, 00 to 10, in order, each with its kicker", () => {
    expect(ROSE_CHAPTERS).toHaveLength(11);
    let from = 0;
    for (const c of ROSE_CHAPTERS) {
      const at = md.indexOf(`## ${c.heading}\n\n${c.kicker}\n`, from);
      expect(at, c.heading).toBeGreaterThan(-1);
      from = at;
    }
  });

  it("marks each chapter Built, Validation or Design, as the page does", () => {
    for (const c of ROSE_CHAPTERS) {
      const base = `## ${c.heading}\n\n${c.kicker}\n\n`;
      const at = md.indexOf(base);
      expect(at, c.id).toBeGreaterThan(-1);
      const after = md.slice(at + base.length);
      const expected = CHAPTER_MARK[c.id];
      if (expected) expect(after.startsWith(`Marker: ${expected}\n`), c.id).toBe(true);
      else expect(after.startsWith("Marker:"), c.id).toBe(false);
    }
    expect(CHAPTER_MARK["ch-06"]).toBe("Design");
    expect(CHAPTER_MARK["ch-08"]).toBe("Validation");
  });

  it("carries the source line of each chapter 01 to 05", () => {
    for (const id of ["ch-01", "ch-02", "ch-03", "ch-04", "ch-05"]) {
      const m = MILESTONES[id];
      expect(md).toContain(`Source: ${m.source}`);
      for (const text of [m.brief, m.tension, m.decision, m.result]) expect(md).toContain(text);
    }
    expect(md).toContain(MILESTONES["ch-01"].tradeoff);
  });

  it("marks every Rose note as written by Ivan in her voice, and has all seven", () => {
    const notes = [IDEA.note, ...["ch-01", "ch-02", "ch-03", "ch-04", "ch-05"].map((id) => MILESTONES[id].note), GOT_WRONG.note];
    expect(ROSE_NOTE_LABEL).toBe("Rose's note (written by Ivan in her voice)");
    for (const n of notes) expect(md).toContain(`**${ROSE_NOTE_LABEL}**\n\n${n}\n`);
    expect(md.split(`**${ROSE_NOTE_LABEL}**`)).toHaveLength(notes.length + 1);
  });

  it("describes each demo in one line, marked as scripted", () => {
    const demos = md.split("\n").filter((l) => l.startsWith("Scripted demo"));
    expect(demos).toHaveLength(2);
    expect(demos[0]).toContain("three built exchanges");
    for (const e of HERO_EXCHANGES) expect(demos[0]).toContain(`"${e.q}"`);
    expect(demos[1]).toContain("four exchanges");
    for (const e of DESIGN_EXCHANGES) expect(demos[1]).toContain(`${e.format} (${e.mark})`);
    for (const p of PASSAGE_QUESTIONS) expect(md).toContain(`- ${p.format} (${p.mark}): ${p.q}`);
  });

  it("has the trust contracts, the answer rule and its answers", () => {
    expect(md).toContain(TRUST.intro);
    for (const c of TRUST.contracts) { expect(md).toContain(`### ${c.title}`); for (const it of c.items) expect(md).toContain(`(${it.mark}) `); }
    expect(md).toContain(`### ${TRUST.rule.heading}`);
    for (const a of TRUST.rule.answers) { expect(md).toContain(`"${a.text}"`); expect(md).toContain(a.note); }
  });

  it("has the chapter 08 cases, the cost, the seven-step test loop with its caption, and the rules", () => {
    for (const c of GOT_WRONG.cases) { expect(md).toContain(c.said); expect(md).toContain(c.changed); expect(md).toContain(c.meta); }
    expect(md).toContain(GOT_WRONG.cost.text);
    GOT_WRONG.loop.forEach((step, i) => expect(md).toContain(`${i + 1}. ${step}`));
    expect(md).toContain(GOT_WRONG.loopCaption);
    for (const [t, d] of GOT_WRONG.rules) expect(md).toContain(`${t} · ${d}`);
    expect(md).toContain(GOT_WRONG.campaign);
  });

  it("has the next steps, the four open questions with their reply link, and the contact", () => {
    expect(md).toContain(NEXT.intro);
    expect(md).toContain(NEXT.transfers);
    for (const q of QUESTIONS) {
      expect(md).toContain(`### ${q.n} · ${q.title}`);
      for (const t of [q.question, q.hypothesis, q.signal, q.decision, q.cost]) expect(md).toContain(t);
      expect(md).toContain(`(mailto:ivandemurard@gmail.com?subject=Open%20question%20${q.n})`);
    }
    for (const t of [CLOSE.askQuestion, CLOSE.line, CONTACT.heading, CONTACT.subline, SIX.intro]) expect(md).toContain(t);
  });
});

describe("Rose mirror: the date and the committed file", () => {
  it("is stamped with a date and nothing else changes with it", () => {
    expect(renderRoseMirror("2026-12-01").replace("2026-12-01", DATE)).toBe(md);
  });

  it("is what the generator writes: the committed file is current", () => {
    const date = committed.match(/Last updated (\d{4}-\d{2}-\d{2})/)?.[1] ?? "";
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(committed).toBe(renderRoseMirror(date));
  });
});

describe("Rose mirror: no text that is not on the page", () => {
  class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", NoopObserver);
    vi.stubGlobal("ResizeObserver", NoopObserver);
    window.scrollTo = vi.fn();
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

  /** The visible text of the page, with both states of every chapter vignette. */
  const pageText = () => {
    const { container } = render(<MemoryRouter><RoseCaseStudy reduced /></MemoryRouter>);
    const first = container.textContent ?? "";
    container.querySelectorAll('figure button[aria-pressed="false"]').forEach((b) => fireEvent.click(b));
    const second = container.textContent ?? "";
    // The demos play data of their own; the exchanges and formats are on the page as the loop runs.
    const demo = [...HERO_EXCHANGES.map((e) => `${e.q} ${e.a}`), ...DESIGN_EXCHANGES.map((e) => `${e.format} ${e.q} ${e.a}`)].join(" ");
    return norm(`${first} ${second} ${demo}`).replace(/ \((?:PDF, )?opens in a new tab\)/g, "");
  };

  /** Plain text of a mirror line: no list or heading marks, no link targets, no bold. */
  const plain = (line: string) =>
    line.replace(/^#{1,6} /, "").replace(/^- /, "").replace(/^\d+\. /, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\*\*/g, "").trim();

  it("says on the page every line of the mirror, apart from its structural lines", () => {
    const page = pageText();
    const onPage = (t: string) => page.includes(norm(t).replace(/^"|"$/g, ""));
    const missing: string[] = [];
    const check = (atom: string) => { if (atom && !onPage(atom)) missing.push(atom); };

    for (const raw of md.split("\n")) {
      if (!raw.trim() || /^\| ?-+/.test(raw)) continue;
      // Structural lines the mirror adds: status, date, markers, the label of Rose's notes, the demo lines, table header.
      if (raw.startsWith("Status: ")) { check(raw.slice(8)); continue; }
      if (raw.startsWith("Last updated ")) continue;
      if (raw.startsWith("Marker: ")) { expect(["Built", "Validation", "Design"]).toContain(raw.slice(8)); continue; }
      if (plain(raw) === ROSE_NOTE_LABEL) continue;
      if (raw.startsWith("Scripted demo")) {
        for (const quoted of raw.match(/"[^"]+"/g) ?? []) check(quoted);
        if (raw.includes("four exchanges")) check("These formats are in design. Live Rose answers in text only.");
        continue;
      }
      if (raw.startsWith("| Run |")) { raw.split("|").map((c) => c.trim()).filter((c) => c && c !== "Run").forEach(check); continue; }
      if (raw.startsWith("|")) { raw.split("|").map((c) => plain(c)).filter(Boolean).forEach(check); continue; }

      const text = plain(raw).replace(/^\((?:Built|Validation|Design)\) /, "");
      const format = text.match(/^(Reformulate|Locate|Connect|Sketch) \((?:Built|Design)\): (.+)$/);
      if (format) { check(format[1]); check(format[2]); continue; }
      if (onPage(text)) continue;
      // "Label: text" lines (legend, TL;DR, vignette states): the two sides are on the page.
      const at = text.indexOf(": ");
      if (at > 0) { check(text.slice(0, at)); check(text.slice(at + 2)); continue; }
      check(text);
    }
    expect(missing).toEqual([]);
  });
});
