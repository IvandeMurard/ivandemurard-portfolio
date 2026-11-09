import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import Index from "@/pages/Index";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import { STATUSES } from "@/content/statuses";
import { PROJECTS } from "@/content/site";
import { scanSource } from "../../scripts/style-check";

// Homepage v2 (5 Nov): the new hero, and Rose as the first of the selected projects.
const HEADLINE = "SaaS product manager and co-founder. Now I build AI services that work across operations, tech and the business.";
const SUBLINE = "Every project on this site states what runs today, what was tested and what is not proven yet.";
const FRAGMENT = "Contextual assistant · knows the page you are reading · answers from the site's own text · text only today";
const LINE = "Rose answers questions about the page you are reading, from the site's own text. Next, she will locate passages, rephrase them and connect pages across the site. The case study shows how I built her and the decisions I made.";

class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const page = () => render(<MoodProvider><AmbienceProvider><MemoryRouter><Index /></MemoryRouter></AmbienceProvider></MoodProvider>);
const text = (el: Element | null) => el?.textContent?.replace(/\s+/g, " ").trim();

describe("Homepage hero", () => {
  it("says the new headline, with no italic", () => {
    page();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(text(h1)).toBe(HEADLINE);
    expect(h1.querySelectorAll("em, i, .italic, .accent-ink")).toHaveLength(0);
  });

  it("has no italic anywhere on the page", () => {
    page();
    // The page's content, not the site header (its wordmark and menu are shared chrome, outside this page's copy).
    const main = document.querySelector("main") as HTMLElement;
    expect(main).not.toBeNull();
    expect([...main.querySelectorAll("em, .italic, .accent-ink")]).toHaveLength(0);
    // And the source of the page has no italic at all.
    expect(scanSource("src/pages/Index.tsx", readFileSync("src/pages/Index.tsx", "utf8")).filter((h) => h.pattern === "italic")).toEqual([]);
  });

  it("says the new subline and keeps the kicker and the buttons", () => {
    page();
    expect(screen.getByText(SUBLINE)).toBeTruthy();
    expect(screen.queryByText(/Since 2025, I design, build and evaluate/)).toBeNull();
    expect(screen.getByText("AI Product Manager & Builder · Paris")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Explore the projects" }).getAttribute("href")).toBe("#work");
    expect(screen.getAllByRole("link", { name: "Book a call" }).length).toBeGreaterThan(0);
  });
});

describe("Aetherix call to action", () => {
  it("reads 'Read the Aetherix case →' and opens the page at the top, with no hash", () => {
    page();
    const cta = screen.getByRole("link", { name: "Read the Aetherix case →" });
    expect(cta.getAttribute("href")).toBe("/aetherix");
    expect(screen.queryByText(/How it decides, and when it refuses/)).toBeNull();
  });

  it("is quoted by public/index.md", () => {
    expect(readFileSync("public/index.md", "utf8")).toContain("[Read the Aetherix case](https://ivandemurard.com/aetherix)");
  });
});

describe("02 · Selected projects", () => {
  const cards = () => within(screen.getByText("02 · Selected projects").parentElement as HTMLElement).getAllByRole("article");

  it("lists Rose first, then Lore, Anima, Compass and Sonor", () => {
    page();
    expect(cards().map((c) => text(within(c).getByRole("heading", { level: 3 })))).toEqual(["Rose", "Lore", "Anima", "Compass", "Sonor"]);
  });

  it("marks the Rose title with the compass svg, not an image", () => {
    page();
    const h3 = within(cards()[0]).getByRole("heading", { level: 3 });
    expect(h3.querySelector("svg")).toBeTruthy();
    expect(h3.querySelector("img")).toBeNull();
  });

  it("shows Rose with her status, her fragment, her line and a link to the case", () => {
    page();
    const rose = within(cards()[0]);
    expect(rose.getByText("Live, text only")).toBeTruthy();
    expect(rose.getByText(FRAGMENT)).toBeTruthy();
    expect(rose.getByText(LINE)).toBeTruthy();
    expect(rose.getByRole("link", { name: "Read the case" }).getAttribute("href")).toBe("/rose-design-lab");
  });
});

describe("Status and project entries", () => {
  it("adds a rose status: signal go, word 'Live, text only'", () => {
    expect(STATUSES.rose.signal).toBe("go");
    expect(STATUSES.rose.word).toBe("Live, text only");
    expect(STATUSES.rose.note).toContain("Rose is live and text only");
  });

  it("adds PROJECTS.rose with the slug of the case study and the same status", () => {
    expect(PROJECTS.rose.slug).toBe("rose-design-lab");
    expect(PROJECTS.rose.name).toBe("Rose");
    expect(PROJECTS.rose.status).toBe(STATUSES.rose);
    expect(PROJECTS.rose.tagline).toBe(LINE);
  });
});

describe("The mirrors quote the same words", () => {
  const index = readFileSync("public/index.md", "utf8").replace(/\r\n/g, "\n");
  const roseContext = readFileSync("supabase/functions/_shared/rose-context.ts", "utf8");

  it("public/index.md has the new hero and lists Rose before Lore", () => {
    expect(index).toContain(`## ${HEADLINE}`);
    expect(index).toContain(SUBLINE);
    expect(index).not.toContain("Now I build AI solutions");
    const rose = index.indexOf("### Rose (GO · Live, text only)");
    expect(rose).toBeGreaterThan(index.indexOf("## 02 · Selected projects"));
    expect(rose).toBeLessThan(index.indexOf("### Lore"));
    expect(index).toContain(FRAGMENT);
    expect(index).toContain(LINE);
  });

  it("Rose's homepage description quotes the hero and lists Rose among the selected projects", () => {
    expect(roseContext).toContain(`"${HEADLINE}"`);
    expect(roseContext).toContain(`"${SUBLINE}"`);
    expect(roseContext).toContain("02 Selected projects (Rose, Lore, Anima, Compass, Sonor");
    expect(roseContext).not.toContain("Now I build AI solutions");
  });
});
