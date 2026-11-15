import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { RoseCue } from "@/components/rose/RoseKinetic";
import { ClosingContact } from "@/components/case/ClosingContact";
import { ExternalMark } from "@/components/ui/ExternalMark";
import { ROSE_NOTES_KEY, resetRoseNotesCache } from "@/lib/roseNotes";

// Polish batch 1: the flagship paragraph size, one sign for leaving the site, the hairline above the first note's footer.

const read = (p: string) => readFileSync(p, "utf8");

describe("Homepage, the Aetherix flagship paragraph", () => {
  const index = read("src/pages/Index.tsx");
  const line = index.split("\n").find((l) => l.includes("PROJECTS.atherix.tagline")) ?? "";

  it("is 18px below md and 21px from md", () => {
    expect(line).toContain("text-[18px]");
    expect(line).toContain("md:text-[21px]");
    expect(line).not.toMatch(/(?<!md:)text-\[21px\]/);
  });

  it("keeps its copy: still the tagline, read from the one source", () => {
    expect(line).toContain("{PROJECTS.atherix.tagline}");
  });
});

describe("One sign for leaving the site", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((f) => {
      const p = join(dir, f);
      return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css|html)$/.test(f) ? [p] : [];
    });
  const OLD_ICON = ["open", "in", "new"].join("_");

  it("has no open_in_new icon left in the source", () => {
    const hits = walk("src").filter((p) => !p.endsWith("polishBatch1.test.tsx") && read(p).includes(OLD_ICON));
    expect(hits).toEqual([]);
  });

  it("draws the arrow ↗ aria-hidden and speaks ', opens in a new tab' in the link's name", () => {
    render(<a href="https://example.org/x" target="_blank" rel="noopener noreferrer">AUTHORS.md<ExternalMark /></a>);
    const link = screen.getByRole("link", { name: /^AUTHORS.md ?, opens in a new tab$/ });
    expect(link.textContent).toBe("AUTHORS.md↗, opens in a new tab");
    expect(link.querySelector('[aria-hidden="true"]')?.textContent).toBe("↗");
  });

  it("is on the external links of Lore, Sonor and Tacet that carried the old icon, and only on _blank links", () => {
    for (const [file, n] of [["src/pages/Lore.tsx", 2], ["src/pages/Sonor.tsx", 1], ["src/pages/Tacet.tsx", 3]] as const) {
      const src = read(file);
      expect(src.match(/<ExternalMark/g)?.length, file).toBe(n);
      // every <ExternalMark sits inside an <a ... target="_blank"> opened before it, with no </a> in between
      for (const m of src.matchAll(/<ExternalMark/g)) {
        const before = src.slice(0, m.index);
        const open = before.lastIndexOf("<a");
        expect(open, file).toBeGreaterThan(-1);
        expect(before.slice(open), file).toContain('target="_blank"');
        expect(before.slice(open), file).not.toContain("</a>");
      }
    }
  });

  it("is on the Compass demo link of the closing contact, and on no internal link", () => {
    render(<MemoryRouter><ClosingContact room="compass" /></MemoryRouter>);
    const demo = screen.getByRole("link", { name: /^Open the demo ?, opens in a new tab$/ });
    expect(demo.getAttribute("target")).toBe("_blank");
    expect(demo.textContent).toContain("↗");
    expect(demo.querySelector(".material-symbols-outlined")).toBeNull();
    cleanup();
    render(<MemoryRouter><ClosingContact room="anima" /></MemoryRouter>);
    for (const link of screen.getAllByRole("link")) {
      if (link.getAttribute("target") !== "_blank") expect(link.textContent, link.getAttribute("href") ?? "").not.toContain("↗");
    }
    expect(screen.getByRole("link", { name: /The architecture note/ }).textContent).not.toContain("↗");
  });
});

describe("The first note's footer", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
    Object.defineProperty(window, "matchMedia", {
      writable: true, configurable: true,
      value: (query: string) => ({ matches: false, media: query, onchange: null, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } }),
    });
    window.localStorage.removeItem(ROSE_NOTES_KEY);
    resetRoseNotesCache();
  });
  afterEach(() => { cleanup(); vi.unstubAllGlobals(); resetRoseNotesCache(); });

  it("has its hairline at border-outline-variant/50", () => {
    render(<><RoseCue id="a" note="Note A." /><RoseCue id="b" note="Note B." /></>);
    const footer = screen.getByRole("button", { name: "Hide notes" }).parentElement as HTMLElement;
    expect(footer.className).toContain("border-t");
    expect(footer.className).toContain("border-outline-variant/50");
    expect(footer.className).not.toMatch(/border-outline-variant(?!\/50)/);
  });
});
