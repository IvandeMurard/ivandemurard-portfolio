import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { RoseCue } from "@/components/rose/RoseKinetic";
import { CLOSING_ROOMS, ClosingContact } from "@/components/case/ClosingContact";
import { computeAccessibleName } from "dom-accessibility-api";
import { ExternalMark } from "@/components/ui/ExternalMark";
import Footer from "@/components/layout/Footer";
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
    render(<a href="https://example.org/x" target="_blank" rel="noopener noreferrer"><ExternalMark>AUTHORS.md</ExternalMark></a>);
    const link = screen.getByRole("link", { name: "AUTHORS.md, opens in a new tab" });
    expect(computeAccessibleName(link)).toBe("AUTHORS.md, opens in a new tab");
    expect(link.querySelector('[aria-hidden="true"]')?.textContent).toBe("↗");
    // the gap before the arrow is a CSS margin, not a space in the text
    expect(link.querySelector('[aria-hidden="true"]')?.className).toContain("ml-[0.25em]");
    expect(link.textContent).toBe("AUTHORS.md, opens in a new tab↗");
  });

  // The source scan: every link that opens a new tab carries the sign or the words, and the sign is on no other link.
  const sources = () => walk("src").filter((p) => /\.tsx$/.test(p) && !p.includes("/test/") && !p.includes("\\test\\"));
  const OPENERS = /<(?:a|Wrapper)(?=[\s>])/g;
  /** The element around an index: from its opener to its closing tag. */
  const around = (src: string, i: number) => {
    const open = Math.max(...[...src.slice(0, i).matchAll(OPENERS)].map((m) => m.index ?? -1));
    const close = Math.min(...["</a>", "</Wrapper>"].map((t) => { const k = src.indexOf(t, i); return k < 0 ? Infinity : k; }));
    return src.slice(open, close);
  };

  it("fails on a target=\"_blank\" link rendered without ExternalMark (or the same words in its aria-label)", () => {
    const missing: string[] = [];
    for (const file of sources()) {
      const src = read(file);
      for (const m of src.matchAll(/target=(?:"_blank"|\{[^}]*"_blank"[^}]*\})/g)) {
        const el = around(src, m.index ?? 0);
        if (!/ExternalMark|externalName\(|EXTERNAL_SUFFIX/.test(el)) missing.push(`${file}: ${el.slice(0, 90).replace(/\s+/g, " ")}`);
      }
      // the object form (target: "_blank" in spread props): the file must carry as many marks as new-tab links
      const objects = src.match(/target:\s*"_blank"/g)?.length ?? 0;
      if (objects && (src.match(/<ExternalMark/g)?.length ?? 0) < objects) missing.push(`${file}: target: "_blank" without ExternalMark`);
    }
    expect(missing).toEqual([]);
  });

  it("puts the sign on no link that stays on the site", () => {
    const wrong: string[] = [];
    for (const file of sources()) {
      const src = read(file);
      for (const m of src.matchAll(/<ExternalMark/g)) {
        const el = around(src, m.index ?? 0);
        const opensNewTab = /_blank|\.external\b|startsWith\("http"\)|const external|external\b|chip\.booking/.test(el) || file.endsWith("ClosingContact.tsx") || file.endsWith("RoseDock.tsx");
        if (!opensNewTab) wrong.push(`${file}: ${el.slice(0, 90).replace(/\s+/g, " ")}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it("has no arrow_outward icon left: the sign is ExternalMark", () => {
    const ARROW = ["arrow", "outward"].join("_");
    expect(sources().filter((p) => read(p).includes(ARROW))).toEqual([]);
  });

  it("is on the Compass demo link of the closing contact, and on no internal link", () => {
    render(<MemoryRouter><ClosingContact room="compass" /></MemoryRouter>);
    const demo = screen.getByRole("link", { name: "Open the demo, opens in a new tab" });
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

describe("Every rendered link that opens a new tab", () => {
  const NAME = /, opens in a new tab$/;
  const check = (root: HTMLElement) => {
    const links = [...root.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')];
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) {
      const name = computeAccessibleName(a);
      expect(name, a.getAttribute("href") ?? "").toMatch(NAME);
      expect(name, a.getAttribute("href") ?? "").not.toContain(" ,");
      // a link with visible text draws the arrow; an icon-only link carries the same words in its aria-label
      if (!a.getAttribute("aria-label")) expect(a.textContent, a.getAttribute("href") ?? "").toContain("↗");
    }
  };

  it("in each closing contact room", () => {
    for (const room of Object.keys(CLOSING_ROOMS)) {
      const { container } = render(<MemoryRouter><ClosingContact room={room as keyof typeof CLOSING_ROOMS} /></MemoryRouter>);
      check(container);
      cleanup();
    }
  });

  it("in the closing contact, GitHub, LinkedIn and Cal carry the sign", () => {
    const { container } = render(<MemoryRouter><ClosingContact room="cv" /></MemoryRouter>);
    for (const name of [/Book a call/, /LinkedIn/]) expect(screen.getByRole("link", { name })).toBeTruthy();
    expect(container.querySelectorAll('a[target="_blank"]').length).toBe(2);
    cleanup();
    const lore = render(<MemoryRouter><ClosingContact room="lore" /></MemoryRouter>);
    expect(screen.getByRole("link", { name: /GitHub repo/ }).textContent).toContain("↗");
    lore.unmount();
  });
});

describe("The links of the page frame and the dock", () => {
  it("names every icon-only external link of the footer with the same words, no space before the comma", () => {
    const { container } = render(<MemoryRouter><Footer /></MemoryRouter>);
    const links = [...container.querySelectorAll<HTMLAnchorElement>('a[target="_blank"]')];
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) {
      const name = computeAccessibleName(a);
      expect(name).toMatch(/, opens in a new tab$/);
      expect(name).not.toContain(" ,");
    }
  });

  it("labels the booking link \"Book a call\" (lower-case c) wherever it is a label", () => {
    const SOURCES = ["src/components/layout/Footer.tsx", "src/components/layout/AtriumHeader.tsx", "src/pages/Contact.tsx", "src/content/site.ts", "src/pages/Lore.tsx", "src/pages/Compass.tsx"];
    for (const file of SOURCES) expect(read(file), file).not.toMatch(/Book a Call|Schedule a conversation|Book a slot|label: "Schedule"/);
    expect(read("src/components/layout/Footer.tsx")).toContain('label: "Book a call"');
    expect(read("src/components/layout/AtriumHeader.tsx")).toContain('label: "Book a call"');
  });
});
