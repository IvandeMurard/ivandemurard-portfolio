import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { readFileSync } from "node:fs";
import JournalEntry from "@/pages/JournalEntry";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import { JOURNAL_ENTRIES } from "@/content/journal";
import { renderBlock } from "@/lib/mcp/tools/get-journal-entry";

// Harness note, phase 2: section 1 opens on the driving-test story, section 7 asks before it shows the figures
// (a trap, same question-and-two-buttons pattern as the peak), section 13 folds what the literature adds.
// Heading ids are tested in fieldNotesV2.test.tsx.

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
const page = () => render(<MoodProvider><AmbienceProvider><MemoryRouter initialEntries={[`/journal/${SLUG}`]}><Routes><Route path="/journal/:slug" element={<JournalEntry />} /></Routes></MemoryRouter></AmbienceProvider></MoodProvider>);

const QUESTION = "Two runs of the same 53 cases scored 38, then 36. Is the gate ready to block a release?";
const NOT_YET = "Right. Only 12 of the 17 failures were the same, and eight cases flipped between two identical runs. The score was a draw, not a measurement.";
const YES = "That is the trap. Eight cases flipped between two identical runs: the gate would have blocked or passed on luck.";

describe("Section 7: the trap", () => {
  it("asks the question with two buttons and one polite status line, and the figures are already visible", () => {
    const { container } = page();
    const trap = container.querySelector("[data-trap]") as HTMLElement;
    expect(trap.textContent).toContain(QUESTION);
    expect(within(trap).getAllByRole("button").map((b) => b.textContent)).toEqual(["Yes", "Not yet"]);
    const status = trap.querySelector("[role=status]")!;
    expect(status.getAttribute("aria-live")).toBe("polite");
    expect(status.textContent).toBe("");
    // The figures are not behind the answer.
    expect(container.textContent).toContain("Two runs, same 53 cases");
  });

  it.each([["Yes", YES], ["Not yet", NOT_YET]])("after %s: the line is %s, the buttons are 44 px, the figures stay", (name, line) => {
    const { container } = page();
    const trap = container.querySelector("[data-trap]") as HTMLElement;
    fireEvent.click(within(trap).getByRole("button", { name }));
    expect(trap.querySelector("[role=status]")!.textContent).toBe(line);
    expect(within(trap).getByRole("button", { name }).getAttribute("aria-pressed")).toBe("true");
    for (const b of within(trap).getAllByRole("button")) expect(b.className).toContain("min-h-[44px]");
    expect(container.textContent).toContain("Two runs, same 53 cases");
  });

  it("is the question and both lines as text, with no button, in the version without JavaScript", () => {
    (window as unknown as { __prerender?: boolean }).__prerender = true;
    const { container } = page();
    const trap = container.querySelector("[data-trap]") as HTMLElement;
    expect(within(trap).queryAllByRole("button")).toHaveLength(0);
    expect(trap.textContent).toContain(QUESTION);
    expect(trap.textContent).toContain(YES);
    expect(trap.textContent).toContain(NOT_YET);
  });

  it("is in the Markdown mirror and in llms-full.txt: the question and both lines", () => {
    const block = entry.body.find((b) => b.kind === "trap")!;
    const line = renderBlock(block);
    expect(line).toContain(QUESTION);
    expect(line).toContain(`If you answer Yes: ${YES}`);
    expect(line).toContain(`If you answer Not yet: ${NOT_YET}`);
    for (const f of ["public/harnesses-graders-closed-loops.md", "public/llms-full.txt"]) expect(readFileSync(f, "utf8"), f).toContain(line);
  });
});

describe("Section 1: the driving-test story", () => {
  it("opens on the story, with Section 6 as a link to its anchor, then the six definitions in the story's words", () => {
    const { container } = page();
    const story = [...container.querySelectorAll("p")].find((p) => p.textContent?.startsWith("A candidate drives the whole route without a fault."))!;
    expect(story.textContent).toBe("A candidate drives the whole route without a fault. Mirrors checked, signals on time, a clean parallel park. Then, once, they roll through a stop sign on an empty street, and the examiner fails them. Nobody calls it unfair: one major fault outweighs a perfect route, and everyone agreed on that rule before the engine started. Section 6 is the same scene with a model: 61 answers right out of 64, and a fail.");
    expect(story.querySelector("a")!.getAttribute("href")).toBe(`/journal/${SLUG}#6-acceptance-criteria-the-part-everyone-skips`);
    // Each block sits in its own wrapper: the next one is the wrapper's next sibling.
    const next = (el: Element) => el.closest("[data-reveal]")!.nextElementSibling!;
    expect(next(story).textContent).toBe("Every part of an evaluation harness is already in that scene.");
    const defs = next(next(story));
    expect(defs.textContent).toContain("The route. Chosen in advance, every situation with a known right answer. Also called a golden dataset.");
    expect(defs.textContent).toContain("\"Stopped at the stop sign?\" Yes or no, and why. One criterion, nothing more.");
    expect(defs.textContent).toContain("The examiner writes a report; someone may read it.");
    expect(defs.textContent).toContain("the licence is not issued, and next time the route includes that stop sign.");
    // Unchanged: the note on the word's second meaning, the quote and the common confusion.
    expect(defs.textContent).toContain("The word has a second meaning, now the more common one");
    expect(container.textContent).toContain("A protocol without a harness is an intention.");
    expect(container.textContent).toContain("The common confusion: a grader is not an alert.");
  });
});

describe("Section 13: what the literature adds is folded", () => {
  it("is a closed disclosure with its heading and content inside; the verdict, definitions, quote and the start of 'Where the two meet' stay out", () => {
    const { container } = page();
    const fold = [...container.querySelectorAll("details")].find((d) => d.querySelector("summary")?.textContent === "Read what that literature adds to this one")!;
    expect(fold).toBeTruthy();
    expect(fold.hasAttribute("open")).toBe(false);
    expect(fold.textContent).toContain("What that literature adds to this one");
    expect(fold.textContent).toContain("The tool gateway as its own layer.");
    // It is a sibling of the talk's disclosure, not inside it.
    const talk = [...container.querySelectorAll("details")].find((d) => d.querySelector("summary")?.textContent === "Read the full discussion of the talk")!;
    expect(talk.contains(fold)).toBe(false);
    expect(talk.textContent).not.toContain("What that literature adds to this one");
    for (const text of ["An agent harness proves the system can act. An evaluation harness proves it still should.", "Where the two meet: the verify step", "Harnesses in AI: A Deep Dive"]) {
      const el = [...container.querySelectorAll("blockquote, h3, p")].find((n) => n.textContent?.includes(text))!;
      expect(el, text).toBeTruthy();
      expect(fold.contains(el), text).toBe(false);
    }
  });

  it("keeps the text in the Markdown mirror", () => {
    const md = readFileSync("public/harnesses-graders-closed-loops.md", "utf8");
    expect(md).toContain("### What that literature adds to this one");
    expect(md).toContain("The tool gateway as its own layer.");
  });
});
