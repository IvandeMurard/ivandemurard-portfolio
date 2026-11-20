import { act, cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import Index from "@/pages/Index";
import { HeroGlow, resetHeroArrival } from "@/components/home/HeroGlow";
import { MoodProvider, useMood } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import { INDEX_HERO, INDEX_COPY, notesInOrder } from "@/content/journalIndex";
import { JOURNAL_ENTRIES } from "@/content/journal";
import { resetParisClock } from "@/lib/parisClock";
import { shortNoteTitle } from "@/lib/shortTitle";

// Homepage v2 (18 Nov 2026), part A: warm rooms, a hero lit by the hour in Paris, the Field Notes block read from /journal.

class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  try { window.localStorage.clear(); window.sessionStorage.clear(); } catch { /* ignore */ }
  document.documentElement.removeAttribute("data-mood");
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); resetParisClock(); });

const css = readFileSync("src/index.css", "utf8").replace(/\r\n/g, "\n");

/** Paris is UTC+1 on 18 Nov 2026. */
const at = (utc: string) => { vi.useFakeTimers({ toFake: ["Date", "setInterval", "clearInterval"] }); vi.setSystemTime(new Date(`2026-11-18T${utc}:00Z`)); resetParisClock(); };

const glow = (c: HTMLElement) => c.querySelector("[data-hero-glow]") as HTMLElement;
const activeLayers = (c: HTMLElement) => [...c.querySelectorAll("[data-light][data-active]")].map((l) => l.getAttribute("data-light"));
const wrap = (ui: React.ReactNode) => <MoodProvider><AmbienceProvider><MemoryRouter>{ui}</MemoryRouter></AmbienceProvider></MoodProvider>;

// The pure periods and the sun times are tested in parisSun.test.ts. Here: the glow on the page, on 18 Nov 2026
// (sunrise 08:04, sunset 17:07 in Paris).
describe("The hero light follows the sun over Paris", () => {
  it.each([["08:10", "morning"], ["12:30", "midday"], ["15:40", "late"], ["22:30", "midday"]])("at %s UTC (Paris +1) the day glow is %s", (utc, expected) => {
    at(utc);
    const { container } = render(wrap(<HeroGlow />));
    expect(glow(container).getAttribute("data-hero-glow")).toBe(expected);
    expect(activeLayers(container)).toEqual([expected]);
  });

  it("keeps all four layers mounted, so a change is a crossfade and not a swap", () => {
    at("15:40");
    const { container } = render(wrap(<HeroGlow />));
    expect([...container.querySelectorAll("[data-light]")].map((l) => l.getAttribute("data-light"))).toEqual(["morning", "midday", "late", "dusk"]);
  });

  it("is the lamp glow in dusk, whatever the hour, and the hour never switches the mood", () => {
    at("08:10");
    window.localStorage.setItem("mood", "dusk");
    const { container } = render(wrap(<HeroGlow />));
    expect(activeLayers(container)).toEqual(["dusk"]);
    expect(document.documentElement.dataset.mood).toBe("dusk");
  });

  it("crossfades when the period changes while the page is open, and never touches the mood", () => {
    at("09:55"); // 10:55 in Paris: the morning lasts until sunrise + 3 h, 11:04
    window.localStorage.setItem("mood", "day");
    const { container } = render(wrap(<HeroGlow />));
    expect(activeLayers(container)).toEqual(["morning"]);
    act(() => { vi.setSystemTime(new Date("2026-11-18T10:10:00Z")); vi.advanceTimersByTime(15000); }); // 11:10 in Paris
    expect(activeLayers(container)).toEqual(["midday"]);
    expect(document.documentElement.dataset.mood).toBe("day");
    // The 2400 ms crossfade is a CSS transition on the layers' opacity; nothing else is added.
    expect(css).toMatch(/\.hero-glow-layer \{[^}]*transition: opacity 2400ms/);
  });

  it("follows the visitor's mood toggle, in both directions", () => {
    at("15:40");
    const Toggle = () => { const { toggle } = useMood(); return <button onClick={toggle}>toggle</button>; };
    const { container } = render(wrap(<><HeroGlow /><Toggle /></>));
    expect(activeLayers(container)).toEqual(["late"]);
    act(() => { screen.getByText("toggle").click(); });
    expect(activeLayers(container)).toEqual(["dusk"]);
    act(() => { screen.getByText("toggle").click(); });
    expect(activeLayers(container)).toEqual(["late"]);
  });

  it("shares the nav clock's timer: one interval for the nav clock and the glow together", () => {
    at("15:40");
    const spy = vi.spyOn(window, "setInterval");
    render(wrap(<Index />));
    expect(spy.mock.calls.filter(([, ms]) => ms === 15000)).toHaveLength(1);
  });

  it("warms in once per page load, not at all under prefers-reduced-motion, and never replays on a later visit", () => {
    resetHeroArrival();
    const first = render(wrap(<HeroGlow />));
    expect(glow(first.container).hasAttribute("data-arrive")).toBe(true);
    first.unmount();
    const second = render(wrap(<HeroGlow />));
    expect(glow(second.container).hasAttribute("data-arrive")).toBe(false);
    expect(css).toMatch(/\.hero-glow\[data-arrive\] \{ animation: hero-glow-arrive 1200ms ease-out both; \}/);
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{\s*\.hero-glow\[data-arrive\] \{ animation: none; \}\s*\.hero-glow-layer \{ transition: none; \}/);
  });

  it("is decoration: hidden from assistive tech, behind the text, out of the layout", () => {
    const { container } = render(wrap(<HeroGlow />));
    expect(glow(container).getAttribute("aria-hidden")).toBe("true");
    expect(css).toMatch(/\.hero-glow \{ position: absolute; inset: 0; pointer-events: none; \}/);
  });
});

describe("The rooms of the homepage", () => {
  it("defines stone and peach in both moods, and no cool hue in either", () => {
    expect(css).toMatch(/--surface-stone: 35 33% 93%;/);
    expect(css).toMatch(/--surface-peach: 31 74% 94%;/);
    expect(css).toMatch(/--surface-stone: 32 13% 14%;/); // the dusk surface-container
    expect(css).toMatch(/--surface-peach: 28 25% 13%;/);
    for (const m of css.matchAll(/--(?:surface-stone|surface-peach|glow-[a-z-]+): (\d+) /g)) {
      const hue = Number(m[1]);
      expect(hue, m[0]).toBeGreaterThanOrEqual(28);
      expect(hue, m[0]).toBeLessThanOrEqual(42);
    }
  });

  it("puts each room on its ground, with a soft blend between them and the navy of the contact at the end", () => {
    const { container } = render(wrap(<Index />));
    const main = container.querySelector("main") ?? container;
    const kids = [...main.children].filter((el) => el.tagName !== "SCRIPT");
    const sig = kids.map((el) => (el.hasAttribute("data-blend") ? "blend" : el.hasAttribute("data-hero") ? "hero:surface" : el.id === "work" ? "flagship:stone" : el.hasAttribute("data-field-notes") ? "notes:peach" : el.id === "contact" ? "contact" : el.className.includes("bg-surface") ? "selected:surface" : "?"));
    expect(sig).toEqual(["hero:surface", "blend", "flagship:stone", "blend", "selected:surface", "blend", "notes:peach", "blend", "contact"]);
    expect(container.querySelector("[data-hero]")!.className).toContain("bg-surface");
    expect(container.querySelector("#work")!.className).toContain("bg-surface-stone");
    expect(container.querySelector("[data-field-notes]")!.className).toContain("bg-surface-peach");
    const blends = [...container.querySelectorAll("[data-blend]")].map((b) => b.getAttribute("data-blend"));
    expect(blends).toEqual(["surface>surface-stone", "surface-stone>surface", "surface>surface-peach", "surface-peach>inverse-ground"]);
  });

  it("keeps the hero kicker as it was, without a clock in it", () => {
    render(wrap(<Index />));
    expect(screen.getByText("AI Product Manager & Builder · Paris")).toBeTruthy();
  });
});

describe("03 · Field Notes on the homepage", () => {
  const block = () => document.querySelector("[data-field-notes]") as HTMLElement;

  it("says the heading of the /journal index, once, from the same data", () => {
    render(wrap(<Index />));
    expect(INDEX_HERO.title).toBe("Methods, tested on systems I built.");
    expect(within(block()).getByRole("heading", { level: 2 }).textContent).toBe(INDEX_HERO.title);
    expect(screen.queryByText(/The decisions behind the products/)).toBeNull();
  });

  it("shows four cards in the index order: harness, boundaries, ground truth, one text three readers", () => {
    render(wrap(<Index />));
    const cards = within(block()).getAllByRole("listitem");
    expect(cards).toHaveLength(4);
    const links = cards.map((c) => within(c).getByRole("link").getAttribute("href"));
    expect(links).toEqual([
      "/journal/harnesses-graders-closed-loops",
      "/journal/agent-boundaries-aetherix",
      "/journal/whose-truth-is-the-ground-truth",
      "/journal/one-text-three-readers",
    ]);
    expect(links).toEqual(notesInOrder().map((e) => `/journal/${e.slug}`));
  });

  it("each card is its decision kicker, its current title and 'Read the note'", () => {
    render(wrap(<Index />));
    const cards = within(block()).getAllByRole("listitem");
    notesInOrder().forEach((e, i) => {
      const t = cards[i].textContent!;
      // The title is the one /journal shows for its lead: up to the first "?" (the harness note's title has a subtitle).
      expect(t).toBe(`${e.decision}${shortNoteTitle(e.title)}${INDEX_COPY.readNote}`);
      expect(e.decision).toMatch(/^For deciding /);
    });
    expect(INDEX_COPY.readNote).toBe("Read the note");
    expect(cards.map((c) => c.querySelector(".font-headline")!.textContent)).toEqual([
      "What is an LLM evaluation harness?", "Where should an agent's responsibility end?", "Whose truth is the ground truth?", "One text, three readers",
    ]);
  });

  it("has no dates, no old tags, no old excerpts and not the old title; the 'All notes' link stays", () => {
    render(wrap(<Index />));
    const t = block().textContent!;
    expect(t).not.toMatch(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) 20\d\d\b/);
    expect(t).not.toContain("Keep the forecaster and the actor apart.");
    // The full entries: the old excerpts and hooks live only in the note bodies, not in the index data.
    for (const e of JOURNAL_ENTRIES) {
      expect(t).not.toContain(e.excerpt);
      if (e.homeHook) expect(t).not.toContain(e.homeHook.text);
      expect(t).not.toContain(`${e.category} ·`);
    }
    expect(within(block()).getByRole("link", { name: "All notes" }).getAttribute("href")).toBe("/journal");
  });
});
