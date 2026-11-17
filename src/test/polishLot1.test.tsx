import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { readFileSync } from "node:fs";
import type { ReactElement } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import JournalEntry from "@/pages/JournalEntry";
import { RoseDock } from "@/components/rose/RoseDock";
import { resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { ContactBlock } from "@/components/case/ContactBlock";
import { Footer } from "@/components/layout/Footer";
import { AskAiMenu } from "@/components/AskAiMenu";
import { ASSISTANTS } from "@/content/askAi";
import { JournalToc, activeHeadingId } from "@/components/reading/JournalToc";
import { renderBold, stripBold } from "@/lib/inlineBold";
import { JOURNAL_ENTRIES } from "@/content/journal";
import { SECTION_INDEX } from "@/content/sectionIndex.generated";
import { journalHeadingIds } from "@/lib/journalHeadingIds";
import { CONTACT } from "@/content/site";

const track = vi.fn();
vi.mock("@/hooks/useTrackClick", () => ({ useTrackClick: () => track }));

class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  track.mockClear();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); document.documentElement.style.removeProperty("--rose-dock-reserve"); });

const NOTES = ["agent-boundaries-aetherix", "whose-truth-is-the-ground-truth", "harnesses-graders-closed-loops"];
const page = (el: ReactElement, url = "/") =>
  render(
    <TooltipProvider><MoodProvider><AmbienceProvider>
      <MemoryRouter initialEntries={[url]}><Routes><Route path="*" element={el} /></Routes></MemoryRouter>
    </AmbienceProvider></MoodProvider></TooltipProvider>,
  );
const note = (slug: string) => page(<JournalEntry />, `/journal/${slug}`) && null;
const entryRoute = (slug: string) =>
  render(
    <TooltipProvider><MoodProvider><AmbienceProvider>
      <MemoryRouter initialEntries={[`/journal/${slug}`]}><Routes><Route path="/journal/:slug" element={<JournalEntry />} /></Routes></MemoryRouter>
    </AmbienceProvider></MoodProvider></TooltipProvider>,
  );

describe("1. Bold in Field Notes takeaways", () => {
  it("renders **x** as <strong>, and nothing else", () => {
    const { container } = render(<p>{renderBold("**Bold lead.** Then <b>text</b> and *one star*.")}</p>);
    expect(container.querySelector("strong")?.textContent).toBe("Bold lead.");
    expect(container.querySelector("b")).toBeNull();
    expect(container.textContent).toBe("Bold lead. Then <b>text</b> and *one star*.");
    expect(stripBold("**a** b **c**")).toBe("a b c");
  });

  it.each(NOTES)("shows no visible ** on /journal/%s", (slug) => {
    entryRoute(slug);
    expect(document.body.textContent).not.toContain("**");
  });

  it("keeps the raw markdown in the content, and renders every takeaway lead in bold", () => {
    for (const slug of ["agent-boundaries-aetherix", "whose-truth-is-the-ground-truth"]) {
      const entry = JOURNAL_ENTRIES.find((e) => e.slug === slug)!;
      expect(entry.takeaways!.every((t) => t.startsWith("**"))).toBe(true);
      cleanup();
      entryRoute(slug);
      const list = screen.getByRole("region", { name: "What you will decide differently" });
      expect(within(list).getAllByText((_, el) => el?.tagName === "STRONG")).toHaveLength(entry.takeaways!.length);
    }
  });

  it("has no * in any other journal string that is rendered as plain text", () => {
    for (const e of JOURNAL_ENTRIES) {
      for (const [k, v] of Object.entries({ title: e.title, subtitle: e.subtitle, excerpt: e.excerpt, hook: e.homeHook?.text, tldr: e.tldr, punch: e.takeawayPunch, ...(e.glance ?? {}) })) {
        if (v) expect(v, `${e.slug}.${k}`).not.toContain("*");
      }
    }
  });
});

describe("2. Text never starts invisible", () => {
  const css = readFileSync("src/index.css", "utf8").replace(/\r\n/g, "\n");
  it("does not hide [data-reveal], [data-reveal-child], .headline-ink or .case-row-text", () => {
    for (const sel of ["[data-reveal]", "[data-reveal-child]", ".headline-ink", ".case-row-text"]) {
      const block = css.match(new RegExp(`^\\s*${sel.replace(/[[\]]/g, "\\$&")}\\s*\\{[^}]*\\}`, "m"));
      if (block) expect(block[0], sel).not.toMatch(/opacity:\s*0\b|clip-path|translate/);
    }
    expect(css).not.toMatch(/\[data-reveal\]\s*\{[^}]*opacity:\s*0/);
  });
  it("only fades media, with opacity alone, in 300ms, and not under reduced motion", () => {
    expect(css).toContain('[data-reveal]:not([data-revealed="true"]) :is(img, picture, video, canvas) {\n    opacity: 0;');
    expect(css).toContain("transition: opacity 300ms ease-out;");
    expect(css).toMatch(/prefers-reduced-motion: reduce\) \{\n\s*\[data-reveal\]:not\(\[data-revealed="true"\]\) :is\(img, picture, video, canvas\) \{ opacity: 1; \}/);
  });
});

describe("3. The Rose dock reserves its space", () => {
  it("publishes the collapsed dock's measured height plus its offset plus 16 px, and the footer uses it", () => {
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(58);
    setRoseOpen(false);
    resetRoseChat("polish");
    render(<MemoryRouter initialEntries={["/aetherix"]}><RoseDock roseStatus="live" /></MemoryRouter>);
    // jsdom has no stylesheet, so the computed `bottom` is empty: the reserve is the measured 58 + 0 + 16.
    expect(document.documentElement.style.getPropertyValue("--rose-dock-reserve")).toBe("74px");
    const footer = readFileSync("src/components/layout/Footer.tsx", "utf8");
    expect(footer).toContain("pb-[max(2rem,var(--rose-dock-reserve,0px))]");
    expect(readFileSync("src/components/layout/SiteLayout.tsx", "utf8")).toContain('height: "var(--rose-dock-reserve, 0px)"');
    vi.restoreAllMocks();
  });
  it("no longer lifts the dock over the end of the page", () => {
    expect(readFileSync("src/components/rose/RoseDock.tsx", "utf8")).not.toContain("setLift");
  });
});

describe("4. One template for the three Field Notes", () => {
  const BOUNDARIES_IDS = ["the-asymmetry", "why-one-model-collapses", "where-the-line-landed", "what-the-split-buys", "what-it-cost", "what-i-would-have-lost", "apply-this-to-your-project"];
  const entry = JOURNAL_ENTRIES.find((e) => e.slug === "agent-boundaries-aetherix")!;

  it("numbers the headings and keeps every heading id", () => {
    expect(journalHeadingIds(entry.body).filter(Boolean)).toEqual(BOUNDARIES_IDS);
    const texts = entry.body.filter((b) => b.kind === "h2").map((b) => (b as { text: string }).text);
    expect(texts).toEqual(["1. The asymmetry", "2. Why one model collapses", "3. Where the line landed", "4. What the split buys", "5. What it cost", "6. What I would have lost", "Apply this to your project"]);
    const index = SECTION_INDEX.find((e) => e.path === "/journal/agent-boundaries-aetherix")!;
    expect(index.sections.map((s) => s.id)).toEqual(BOUNDARIES_IDS);
    expect(index.sections.slice(0, 6).map((s) => s.heading)).toEqual(texts.slice(0, 6));
  });

  it("shows the min-read label and the same ids in the page", () => {
    expect(entry.readingMinutes).toBeGreaterThan(0);
    entryRoute("agent-boundaries-aetherix");
    expect(screen.getAllByText(`${entry.readingMinutes} min read`).length).toBeGreaterThan(0);
    for (const id of BOUNDARIES_IDS) expect(document.getElementById(id), id).not.toBeNull();
  });

  it("is in the Markdown mirror with its numbers and its label", () => {
    const md = readFileSync("public/agent-boundaries-aetherix.md", "utf8");
    expect(md).toContain("1. The asymmetry");
    expect(md).toContain(`${entry.readingMinutes} min read`);
  });
});

describe("5. Contents rail", () => {
  it("is active at the last heading whose top is above 30% of the viewport", () => {
    const tops = (...t: number[]) => t.map((top, i) => ({ id: `h${i}`, top }));
    expect(activeHeadingId(tops(500, 900, 1400), 1000)).toBe("h0"); // none yet: the first
    expect(activeHeadingId(tops(-900, 250, 700), 1000)).toBe("h1");
    expect(activeHeadingId(tops(-900, -300, 301), 1000)).toBe("h1");
    expect(activeHeadingId(tops(-900, -300, 300), 1000)).toBe("h2");
    expect(activeHeadingId([], 1000)).toBeNull();
  });

  it("follows a scripted scroll, including a jump that skips whole sections", async () => {
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });
    const ids = ["a", "b", "c", "d"];
    ids.forEach((id) => { const h = document.createElement("h2"); h.id = id; document.body.appendChild(h); });
    const place = (scroll: number) =>
      ids.forEach((id, i) => { document.getElementById(id)!.getBoundingClientRect = () => ({ top: i * 1000 - scroll, bottom: 0, left: 0, right: 0, width: 0, height: 0, x: 0, y: 0, toJSON() {} }) as DOMRect; });
    place(0);
    render(<JournalToc items={ids.map((id) => ({ id, text: id.toUpperCase() }))} />);
    const current = () => document.querySelector('a[aria-current="location"]')?.textContent;
    expect(current()).toBe("A");
    place(2900); // a jump: heading c is at -900, d at 100: d is the one being read
    fireEvent.scroll(window);
    await waitFor(() => expect(current()).toBe("D"));
    place(1000); // back up: b at 0
    fireEvent.scroll(window);
    await waitFor(() => expect(current()).toBe("B"));
    place(1750); // c at 250 (< 300): c
    fireEvent.scroll(window);
    await waitFor(() => expect(current()).toBe("C"));
    ids.forEach((id) => document.getElementById(id)!.remove());
  });
});

describe("6. Footer cuts", () => {
  it("drops the courtesy paragraph and 'Verified through open specifications', keeps the rest", () => {
    render(<MemoryRouter initialEntries={["/privacy"]}><Footer /></MemoryRouter>);
    const text = document.body.textContent ?? "";
    expect(text).toContain("Thank you for your time.");
    expect(text).toContain("Conceived and crafted in Paris · Built 0→1");
    expect(text).not.toContain("rarest courtesy");
    expect(text).not.toContain("enlightenment");
    expect(text).not.toContain("Verified through open specifications");
    expect(text).toContain("Curated with Care");
  });
});

describe("7. One 'Ask your AI' entry", () => {
  const PROMPT = CONTACT.aiPrompt;

  it("is one disclosure button that opens a list of three assistants and a copy action", () => {
    render(<AskAiMenu prompt={PROMPT} />);
    const trigger = screen.getByRole("button", { name: /Ask your AI/ });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.getElementById(trigger.getAttribute("aria-controls")!)!.hidden).toBe(true);
    fireEvent.click(trigger); // a click is what Enter, Space and a tap all produce
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.textContent!.split(",")[0])).toEqual(ASSISTANTS.map((a) => a.name));
    links.forEach((l) => expect(l.textContent).toContain(", opens in a new tab"));
    links.forEach((l, i) => {
      expect(l.getAttribute("target")).toBe("_blank");
      expect(l.getAttribute("rel")).toContain("noopener");
      expect(l.getAttribute("href")).toBe(ASSISTANTS[i].href(PROMPT));
    });
    expect(links[0].getAttribute("href")).toBe(`https://www.perplexity.ai/search?q=${encodeURIComponent(PROMPT)}`);
    expect(links[1].getAttribute("href")).toBe(`https://chatgpt.com/?q=${encodeURIComponent(PROMPT)}`);
    expect(links[2].getAttribute("href")).toBe(`https://claude.ai/new?q=${encodeURIComponent(PROMPT)}`);
    expect(screen.getByRole("button", { name: "Copy the prompt" })).toBeTruthy();
  });

  it("closes on Escape and returns the focus to the button", () => {
    render(<AskAiMenu prompt={PROMPT} />);
    const trigger = screen.getByRole("button", { name: /Ask your AI/ });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("tracks each choice", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<AskAiMenu prompt={PROMPT} />);
    for (const a of ASSISTANTS) {
      fireEvent.click(screen.getByRole("button", { name: /Ask your AI/ }));
      const link = screen.getByRole("link", { name: new RegExp(a.name) });
      link.addEventListener("click", (e) => e.preventDefault());
      fireEvent.click(link);
      expect(track).toHaveBeenLastCalledWith({ label: `Ask ${a.name}`, href: a.href(PROMPT), kind: "contact" });
    }
    fireEvent.click(screen.getByRole("button", { name: /Ask your AI/ }));
    fireEvent.click(screen.getByRole("button", { name: "Copy the prompt" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(PROMPT));
    expect(track).toHaveBeenLastCalledWith({ label: "Ask your AI: copy the prompt", href: "clipboard", kind: "contact" });
  });

  it("shows the prompt to copy by hand when the clipboard is unavailable", async () => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error("no")) } });
    render(<AskAiMenu prompt={PROMPT} />);
    fireEvent.click(screen.getByRole("button", { name: /Ask your AI/ }));
    fireEvent.click(screen.getByRole("button", { name: "Copy the prompt" }));
    await waitFor(() => expect((screen.getByLabelText("Copy this prompt") as HTMLTextAreaElement).value).toBe(PROMPT));
  });

  it("replaces both old entries in the Contact block", () => {
    page(<ContactBlock />);
    expect(screen.getAllByRole("button", { name: /Ask your AI/ })).toHaveLength(1);
    expect(screen.queryByText(/Copy prompt for Claude or ChatGPT/)).toBeNull();
    expect(screen.queryByRole("link", { name: /Ask your AI/ })).toBeNull();
  });
});

void note;
