import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import Atherix from "@/pages/Atherix";
import Tacet from "@/pages/Tacet";
import Lore from "@/pages/Lore";
import Anima from "@/pages/Anima";
import Architecture from "@/pages/Architecture";
import Cv from "@/pages/Cv";
import Contact from "@/pages/Contact";
import Sonor from "@/pages/Sonor";
import Compass from "@/pages/Compass";
import JournalEntry from "@/pages/JournalEntry";
import { PAGE_SECTIONS } from "@/content/pageSections";
import { SECTION_INDEX } from "@/content/sectionIndex.generated";
import { JOURNAL_ENTRIES } from "@/content/journal";
import { journalHeadingIds } from "@/lib/journalHeadingIds";
import { headingOf } from "@/lib/sourceArrival";
import { headingText } from "@/lib/sourceJump";
import { internalSourceLabel, pageTitleFor, sectionsFor } from "@/content/sourceLabels";
import { COMPASS_SECTIONS, type CompassSection } from "@/content/compass";
import { shortNoteTitle } from "@/lib/shortTitle";

// Rose's source links label "/page#id" as "§ <heading>" before the page loads, from registries. A registry that
// drifts from the page would put a wrong heading on a link, so each registered id is checked in the rendered page.

class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const mount = (path: string, pattern: string, el: ReactElement) =>
  render(
    <TooltipProvider>
      <MoodProvider><AmbienceProvider>
        <MemoryRouter initialEntries={[path]}><Routes><Route path={pattern} element={el} /></Routes></MemoryRouter>
      </AmbienceProvider></MoodProvider>
    </TooltipProvider>,
  );

const PAGES: Array<[string, ReactElement]> = [
  ["/aetherix", <Atherix />],
  ["/tacet", <Tacet />],
  ["/lore", <Lore />],
  ["/anima", <Anima />],
  ["/architecture", <Architecture />],
  ["/cv", <Cv />],
  ["/contact", <Contact />],
  ["/sonor", <Sonor />],
  ["/compass", <Compass />],
];

const check = (path: string) => {
  const sections = sectionsFor(path);
  expect(sections.length > 0 || path === "/contact", `${path} has no registered section`).toBe(true);
  for (const s of sections) {
    const el = document.getElementById(s.id);
    expect(el, `${path}#${s.id} is not in the page`).not.toBeNull();
    if (s.heading) expect(headingText(headingOf(el as HTMLElement)), `${path}#${s.id}`).toBe(s.heading);
    if (s.within) {
      const holder = document.getElementById(s.within);
      expect(holder?.contains(el), `${path}#${s.id} is not inside #${s.within}`).toBe(true);
    }
  }
};

describe("Section registry against the rendered pages", () => {
  for (const [path, el] of PAGES) {
    it(`${path}: every registered id exists and its heading matches`, () => {
      mount(path, path, el);
      check(path);
    });
  }

  for (const entry of SECTION_INDEX) {
    it(`${entry.path}: every indexed heading exists in the note`, () => {
      mount(entry.path, "/journal/:slug", <JournalEntry />);
      check(entry.path);
    });
  }

  it("covers every page that has a section list, and every Field Note", () => {
    for (const path of Object.keys(PAGE_SECTIONS)) expect(PAGES.map(([p]) => p), path).toContain(path);
    expect(SECTION_INDEX.map((e) => e.path).sort()).toEqual(JOURNAL_ENTRIES.map((e) => `/journal/${e.slug}`).sort());
  });
});

describe("Compass in the registry", () => {
  const flat = (s: CompassSection[]): Array<{ id: string; heading: string }> =>
    s.flatMap((x) => [{ id: x.id, heading: x.title }, ...flat(x.subsections ?? [])]);

  it("lists the same ids and headings as its content tree, which the dock does not import", () => {
    expect(PAGE_SECTIONS["/compass"].map((s) => ({ id: s.id, heading: s.heading }))).toEqual(flat(COMPASS_SECTIONS));
  });
});

describe("The generated Field Notes index", () => {
  it("has, per note, its path, title and the id and text of each heading, and no body text", () => {
    for (const note of JOURNAL_ENTRIES) {
      const ids = journalHeadingIds(note.body);
      const entry = SECTION_INDEX.find((e) => e.path === `/journal/${note.slug}`);
      expect(entry?.title).toBe(note.title);
      expect(entry?.short).toBe(shortNoteTitle(note.title, note.homeHook?.title));
      note.body.forEach((b, i) => {
        const id = ids[i];
        if (id && (b.kind === "h2" || b.kind === "h3")) expect(entry?.sections).toContainEqual({ id, heading: b.text });
      });
      expect(Object.keys(entry ?? {}).sort()).toEqual(["path", "sections", "short", "title"]);
    }
  });
});

describe("Labels from the registries", () => {
  it("labels a Field Note heading and a collapsible panel", () => {
    expect(internalSourceLabel("/journal/harnesses-graders-closed-loops#6-acceptance-criteria-the-part-everyone-skips", "x").text)
      .toBe("§ 6. Acceptance criteria, the part everyone skips");
    expect(internalSourceLabel("/aetherix#the-numbers", "x").text).toBe("§ The numbers");
    expect(pageTitleFor("/journal/harnesses-graders-closed-loops")).toBeTruthy();
    expect(pageTitleFor("/cv")).toBe("CV");
  });

  it("falls back to Rose's text only for an id that no registry has", () => {
    expect(internalSourceLabel("/lore#honesty", "x").text).toBe("§ Where it stands");
    expect(internalSourceLabel("/anima#scope-gated", "x").text).toBe("§ Scope-gated, and it never decides");
    expect(internalSourceLabel("/aetherix#no-such-id", "Rose's text").text).toBe("Rose's text");
  });
});
