import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { readFileSync } from "node:fs";
import JournalEntry from "@/pages/JournalEntry";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import { JOURNAL_ENTRIES, type PeakBlock } from "@/content/journal";
import { displayOrder } from "@/lib/journalOrder";
import { readingLabel } from "@/content/readingTime";

// Harness note, phase 1: the trap first, a reader's contract, a folded opening, the closing note after section 13,
// a folded FAQ, and an honest reading time. Heading ids are tested in fieldNotesV2.test.tsx.

class Noop { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", Noop);
  vi.stubGlobal("ResizeObserver", Noop);
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); delete (window as unknown as { __prerender?: boolean }).__prerender; });

const SLUG = "harnesses-graders-closed-loops";
const entry = JOURNAL_ENTRIES.find((e) => e.slug === SLUG)!;
const peakBlock = entry.body.find((b): b is PeakBlock => b.kind === "peak")!;
const page = () => render(<MoodProvider><AmbienceProvider><MemoryRouter initialEntries={[`/journal/${SLUG}`]}><Routes><Route path="/journal/:slug" element={<JournalEntry />} /></Routes></MemoryRouter></AmbienceProvider></MoodProvider>);

describe("The peak asks first", () => {
  it("shows the lead, the rule and the question with two buttons, and no box yet", () => {
    const { container } = page();
    const peak = container.querySelector("[data-peak]") as HTMLElement;
    expect(peak.textContent).toContain("An engine is burning oil exactly at the limit set by the maintenance manual.");
    expect(peak.textContent).toContain("The manual: normal below the limit, too high from the limit up.");
    expect(peak.textContent).toContain("The reading is exactly at the limit. Normal or too high?");
    expect(within(peak).getAllByRole("button").map((b) => b.textContent)).toEqual(["Normal", "Too high"]);
    expect(peak.textContent).not.toContain("1 · The answer");
    expect(within(peak).getByRole("link", { name: "Replay it in section 12" })).toBeTruthy();
  });

  it.each([
    ["Normal", "That is what Lore said, and what the first harness accepted. The manual says too high."],
    ["Too high", "Right. Lore said normal, and the first harness accepted it."],
  ])("after %s: one polite status line, then the three boxes", (name, line) => {
    const { container } = page();
    const peak = container.querySelector("[data-peak]") as HTMLElement;
    const status = peak.querySelector("[role=status]")!;
    expect(status.getAttribute("aria-live")).toBe("polite");
    fireEvent.click(within(peak).getByRole("button", { name }));
    expect(status.textContent).toBe(line);
    for (const label of ["1 · The answer", "2 · The graders", "3 · The code"]) expect(peak.textContent).toContain(label);
    for (const b of within(peak).getAllByRole("button")) expect(b.className).toContain("min-h-[44px]");
  });

  it("is text with the boxes visible in the version without JavaScript (the prerender capture)", () => {
    (window as unknown as { __prerender?: boolean }).__prerender = true;
    const { container } = page();
    const peak = container.querySelector("[data-peak]") as HTMLElement;
    expect(peak.textContent).toContain("Normal or too high?");
    expect(within(peak).queryAllByRole("button")).toHaveLength(0);
    for (const label of ["1 · The answer", "2 · The graders", "3 · The code"]) expect(peak.textContent).toContain(label);
  });

  it("is in the Markdown mirror: the question as text, every box", () => {
    const md = readFileSync("public/harnesses-graders-closed-loops.md", "utf8");
    expect(md).toContain("The reading is exactly at the limit. Normal or too high?");
    for (const b of peakBlock.boxes) expect(md).toContain(b.text);
  });
});

describe("The reader's contract and the folded opening", () => {
  it("says the exact line right after the peak, with sections 6 and 12 as links", () => {
    const { container } = page();
    const line = container.querySelector("[data-contract]")!;
    expect(line.textContent).toBe("If you only read three minutes: sections 6 and 12 are the story; the rest is the reference.");
    expect([...line.querySelectorAll("a")].map((a) => [a.textContent, a.getAttribute("href")])).toEqual([
      ["6", "#6-acceptance-criteria-the-part-everyone-skips"],
      ["12", "#12-what-a-harness-finds-that-no-unit-test-sees"],
    ]);
  });

  it("folds the two systems, the provenance and the quiz into one closed disclosure; the evidence key stays visible", () => {
    const { container } = page();
    const fold = [...container.querySelectorAll("details")].find((d) => d.querySelector("summary")?.textContent === "Before you start: the two systems, where the numbers come from, and a check of your own system")!;
    expect(fold).toBeTruthy();
    expect(fold.hasAttribute("open")).toBe(false);
    expect(fold.textContent).toContain("Provenance.");
    expect(fold.querySelector("[data-self-diagnostic], section[aria-label='Check your own system']")).not.toBeNull();
    const key = [...container.querySelectorAll("li")].find((l) => l.textContent?.includes("How to read the evidence here"))!;
    expect(fold.contains(key)).toBe(false);
  });
});

describe("Standfirsts, order, FAQ and reading time", () => {
  it("every section's verdict line is a standfirst directly under its heading", () => {
    const { container } = page();
    const h2s = [...container.querySelectorAll("h2[id]")].filter((h) => /^\d+\./.test(h.textContent ?? "") && !/Frequently|Closing/.test(h.textContent ?? ""));
    expect(h2s.length).toBeGreaterThanOrEqual(13);
    for (const h of h2s.slice(0, 13)) {
      const next = h.closest("[data-reveal]")!.nextElementSibling;
      expect(next?.querySelector("[data-standfirst]"), h.textContent ?? "").not.toBeNull();
    }
  });

  it("reads the closing note right after section 13, before the FAQ, numbered in order, with its own id", () => {
    const { container } = page();
    const ids = [...container.querySelectorAll("h2[id]")].map((h) => `${h.id}|${h.textContent}`);
    const at = (id: string) => ids.findIndex((x) => x.startsWith(`${id}|`));
    expect(at("13-two-harnesses-and-which-one-this-is")).toBeLessThan(at("15-closing-note"));
    expect(at("15-closing-note")).toBeLessThan(at("14-frequently-asked-questions"));
    expect(ids[at("15-closing-note")]).toContain("14. Closing note");
    expect(ids[at("14-frequently-asked-questions")]).toContain("15. Frequently asked questions");
    // The body keeps its own order, so the section index does not move.
    const body = displayOrder(entry.body, []);
    expect(displayOrder(entry.body, entry.moves)).not.toEqual(body);
    const md = readFileSync("public/harnesses-graders-closed-loops.md", "utf8");
    expect(md.indexOf("## 14. Closing note")).toBeLessThan(md.indexOf("## 15. Frequently asked questions"));
  });

  it("shows the most asked questions and folds the others under 'More questions'; the mirror and the JSON-LD keep them all", () => {
    const { container } = page();
    const more = container.querySelector("details[data-more-questions]")!;
    expect(more.querySelector("summary")!.textContent).toBe("More questions");
    expect(more.hasAttribute("open")).toBe(false);
    const lines = entry.body.find((b) => b.kind === "lines") as Extract<(typeof entry.body)[number], { kind: "lines" }>;
    const md = readFileSync("public/harnesses-graders-closed-loops.md", "utf8");
    const ld = readFileSync("scripts/seo-routes.ts", "utf8");
    for (const q of lines.items) {
      expect(md, q.q).toContain(`Q: ${q.q}`);
      expect(ld, q.q).toContain(q.q);
    }
    for (const q of lines.visible!) expect(more.textContent).not.toContain(q);
  });

  it("computes the reading-time label: the full count is said only when it is at least 5 minutes longer", () => {
    expect(readingLabel(18, 36)).toBe("18 min · 36 with every detail open");
    expect(readingLabel(18, 23)).toBe("18 min · 23 with every detail open");
    expect(readingLabel(18, 22)).toBe("18 min");
    expect(readingLabel(18)).toBe("18 min");
    for (const e of JOURNAL_ENTRIES) expect(e.readingMinutesFull!).toBeGreaterThanOrEqual(e.readingMinutes!);
  });
});
