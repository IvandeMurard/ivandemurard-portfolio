import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { existsSync, readFileSync } from "node:fs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import JournalEntry from "@/pages/JournalEntry";
import { RoseCaseStudy } from "@/components/rose/RoseCaseStudy";
import { RoseDock } from "@/components/rose/RoseDock";
import { getRoseChat, resetRoseChat, setRoseOpen } from "@/components/rose/roseSession";
import { JOURNAL_ENTRIES } from "@/content/journal";
import {
  LISTEN_SECTION_HEADING, LISTEN_SUMMARIES, formatRecordedLength, formatValidatedOn, listenSummaryBySlug, listenSummaryFor, listenSummaryNotice, listenSummarySection,
} from "@/content/listenSummaries";
import getJournalEntry from "../lib/mcp/tools/get-journal-entry";
import listJournal from "../lib/mcp/tools/list-journal";
import getCaseStudy from "../lib/mcp/tools/get-case-study";
import { ROSE_CAPABILITIES, ROSE_HISTORY } from "@/content/roseHistory";

// One source, listenSummaries.ts. Every entry must be said word for word on its page, in its Markdown mirror, in
// llms-full.txt and in what MCP returns; the dock reads the same entry; Rose knows the three pages. Nothing else may
// carry its own copy of the text, and the expression tags of `script` never show anywhere.

class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const slugs = Object.keys(LISTEN_SUMMARIES);
const norm = (t: string) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
const paragraphs = (text: string) => text.split(/\n{2,}/).map(norm);
const mirrorFile = (slug: string) => (slug === "rose" ? "public/rose.md" : `public/${slug}.md`);
const readLf = (f: string) => readFileSync(f, "utf8").replace(/\r\n/g, "\n");

const wrap = (el: JSX.Element, url: string) => (
  <TooltipProvider><MoodProvider><AmbienceProvider><MemoryRouter initialEntries={[url]}>{el}</MemoryRouter></AmbienceProvider></MoodProvider></TooltipProvider>
);
const renderPage = (slug: string) =>
  slug === "rose"
    ? render(wrap(<RoseCaseStudy reduced />, "/rose"))
    : render(wrap(<Routes><Route path="/journal/:slug" element={<JournalEntry />} /></Routes>, `/journal/${slug}`));

type McpResult = { content: { text: string }[]; isError?: boolean };
const tool = (t: unknown) => t as { handler: (a: Record<string, unknown>) => McpResult | Promise<McpResult> };

describe("The summaries: the three pages and their recordings", () => {
  it("are Harness, AX and Rose, each on a page of the site", () => {
    expect(slugs).toEqual(["harnesses-graders-closed-loops", "one-text-three-readers", "rose"]);
    expect(LISTEN_SUMMARIES.rose.path).toBe("/rose");
    for (const slug of slugs.filter((s) => s !== "rose")) expect(JOURNAL_ENTRIES.some((e) => `/journal/${e.slug}` === LISTEN_SUMMARIES[slug].path), slug).toBe(true);
    for (const slug of slugs) expect(listenSummaryFor(LISTEN_SUMMARIES[slug].path)?.slug).toBe(slug);
  });

  it("have the recording and its timings on disk, and the length in the source is the recorded length", () => {
    for (const slug of slugs) {
      const s = LISTEN_SUMMARIES[slug];
      expect(existsSync(`public/listen/${slug}.mp3`), `${slug}.mp3`).toBe(true);
      const json = JSON.parse(readFileSync(`public/listen/${slug}.json`, "utf8")) as { durationMs: number; words: { w: string }[] };
      expect(s.durationMs, slug).toBe(json.durationMs);
      expect(json.words.map((w) => w.w), slug).toEqual(s.text.split(/\s+/).filter(Boolean));
    }
  });

  it("print the notice as 'Recorded summary, written by Ivan, validated 21 Nov 2026 · 1 min 04', and Rose's adds her voice", () => {
    expect(formatValidatedOn("2026-11-21")).toBe("21 Nov 2026");
    expect(formatRecordedLength(63556)).toBe("1 min 04");
    expect(formatRecordedLength(64993)).toBe("1 min 05");
    expect(formatRecordedLength(73796)).toBe("1 min 14");
    expect(formatRecordedLength(45000)).toBe("45 sec");
    expect(listenSummaryNotice(LISTEN_SUMMARIES["harnesses-graders-closed-loops"])).toBe("Recorded summary, written by Ivan, validated 21 Nov 2026 · 1 min 04");
    expect(listenSummaryNotice(LISTEN_SUMMARIES["one-text-three-readers"])).toBe("Recorded summary, written by Ivan, validated 21 Nov 2026 · 1 min 05");
    expect(listenSummaryNotice(LISTEN_SUMMARIES.rose)).toBe("Recorded summary, written by Ivan in Rose's voice, validated 21 Nov 2026 · 1 min 14");
  });

  it("keep the expression tags of the Rose script out of the text, and the script says the same words", () => {
    const rose = LISTEN_SUMMARIES.rose;
    const tags = [...(rose.script ?? "").matchAll(/\[([a-z ]+)\]/g)].map((m) => m[1]);
    expect(tags).toEqual(["thoughtful", "short pause", "happy", "short pause", "thoughtful", "confident", "excited", "thoughtful", "excited", "thoughtful", "serious", "happy", "whisper"]);
    expect(norm((rose.script ?? "").replace(/\[[a-z ]+\]\s*/g, ""))).toBe(norm(rose.text));
    for (const s of Object.values(LISTEN_SUMMARIES)) expect(s.text, "no tag in the displayed text").not.toMatch(/\[[a-z ]+\]/);
    // Each tag sits just before the sentence the brief names.
    for (const [tag, next] of [["thoughtful", "Most"], ["short pause", "This one"], ["happy", "Hi"], ["short pause", "I started"], ["thoughtful", "Then Ivan"], ["confident", "I went"], ["excited", "Oh"], ["thoughtful", "What comes next"], ["excited", "Ivan is designing"], ["thoughtful", "The same idea"], ["serious", "One more thing"], ["happy", "So the question"], ["whisper", "I am right below"]]) {
      expect(rose.script, `[${tag}] ${next}`).toContain(`[${tag}] ${next}`);
    }
  });
});

describe("Every summary is said word for word on its page", () => {
  for (const slug of slugs) {
    it(`${slug}: the block, its notice, every paragraph, open without JavaScript`, () => {
      const s = LISTEN_SUMMARIES[slug];
      const { container } = renderPage(slug);
      const block = container.querySelector(`[data-listen-summary="${slug}"]`);
      expect(block, "block").not.toBeNull();
      expect(block!.getAttribute("aria-label")).toBe(LISTEN_SECTION_HEADING);
      expect(block!.querySelector("h2")?.textContent).toBe("Listen summary");
      expect(block!.querySelector("[data-listen-notice]")?.textContent).toBe(listenSummaryNotice(s));
      const shown = [...block!.querySelectorAll("[data-listen-text] p")].map((p) => norm(p.textContent ?? ""));
      expect(shown).toEqual(paragraphs(s.text));
      // The text is folded with <details>, and the markup says open: it reads without JavaScript.
      const details = block!.querySelector("details");
      expect(details?.hasAttribute("open")).toBe(true);
      expect(block!.textContent).not.toMatch(/\[[a-z ]+\]/);
    });

    it(`${slug}: the Listen button asks the dock to open on this summary`, () => {
      const heard = vi.fn();
      window.addEventListener("rose:listen", heard);
      const { container } = renderPage(slug);
      fireEvent.click(container.querySelector(`[data-listen-summary="${slug}"] button`) as HTMLElement);
      window.removeEventListener("rose:listen", heard);
      expect(heard).toHaveBeenCalledTimes(1);
      expect((heard.mock.calls[0][0] as CustomEvent).detail).toEqual({ slug });
    });
  }

  it("a page without a summary has no block", () => {
    const other = JOURNAL_ENTRIES.find((e) => !listenSummaryFor(`/journal/${e.slug}`))!;
    const { container } = renderPage(other.slug);
    expect(container.querySelector("[data-listen-summary]")).toBeNull();
  });
});

describe("Every summary is said word for word in the mirror and in llms-full.txt", () => {
  const llms = readLf("public/llms-full.txt");
  for (const slug of slugs) {
    it(`${slug}: the section is in ${mirrorFile(slug)} and in llms-full.txt`, () => {
      const s = LISTEN_SUMMARIES[slug];
      const section = listenSummarySection(s).trimEnd();
      expect(section.startsWith("## Listen summary\n\nRecorded summary, written by Ivan")).toBe(true);
      expect(readLf(mirrorFile(slug))).toContain(section);
      expect(llms).toContain(section);
      expect(readLf(mirrorFile(slug))).not.toMatch(/\[(thoughtful|short pause|happy|confident|excited|serious|whisper)\]/);
      expect(llms).not.toMatch(/\[(thoughtful|short pause|happy|confident|excited|serious|whisper)\]/);
    });
  }
});

describe("Every summary is said word for word in what MCP returns", () => {
  for (const slug of slugs.filter((s) => s !== "rose")) {
    it(`get_journal_entry ${slug}: in the full note, and alone by section`, async () => {
      const s = LISTEN_SUMMARIES[slug];
      const full = await tool(getJournalEntry).handler({ slug });
      expect(full.content[0].text).toContain(listenSummarySection(s).trimEnd());
      const part = await tool(getJournalEntry).handler({ slug, section: "Listen summary" });
      expect(part.isError).toBeFalsy();
      expect(part.content[0].text).toContain(listenSummaryNotice(s));
      expect(part.content[0].text).toContain(s.text);
      const outline = await tool(getJournalEntry).handler({ slug, outline_only: true });
      expect(outline.content[0].text).toContain("- Listen summary");
    });
  }

  it("get_case_study rose: in the full Markdown and alone by section (the tool reads the published mirror)", async () => {
    const s = LISTEN_SUMMARIES.rose;
    vi.stubGlobal("fetch", vi.fn(async () => new Response(readLf("public/rose.md"), { status: 200 })));
    const full = await tool(getCaseStudy).handler({ slug: "rose" });
    expect(full.content[0].text).toContain(listenSummarySection(s).trimEnd());
    const part = await tool(getCaseStudy).handler({ slug: "rose", section: "Listen summary" });
    expect(part.isError).toBeFalsy();
    expect(part.content[0].text).toContain(listenSummaryNotice(s));
    expect(part.content[0].text).toContain(s.text);
    const outline = await tool(getCaseStudy).handler({ slug: "rose", outline_only: true });
    expect(outline.content[0].text).toContain("- Listen summary");
  });

  it("list_journal_entries flags listen_summary: true on the notes that have one, false on the others", async () => {
    const r = await tool(listJournal).handler({});
    const entries = JSON.parse(r.content[0].text.slice(r.content[0].text.indexOf("[\n"))) as { slug: string; listen_summary: boolean }[];
    expect(entries.length).toBe(JOURNAL_ENTRIES.length);
    for (const e of entries) expect(e.listen_summary, e.slug).toBe(!!listenSummaryFor(`/journal/${e.slug}`));
    expect(entries.filter((e) => e.listen_summary).map((e) => e.slug).sort()).toEqual(["harnesses-graders-closed-loops", "one-text-three-readers"]);
  });
});

describe("Rose knows the three pages, and the dock reads the same entry", () => {
  it("her context and her capabilities name every page that has a summary, and no other", () => {
    const context = readFileSync("supabase/functions/_shared/rose-context.ts", "utf8");
    const line = context.split("\n").find((l) => l.startsWith("Recorded summaries:")) ?? "";
    const capability = ROSE_CAPABILITIES.find((c) => c.includes("recorded summary")) ?? "";
    for (const s of Object.values(LISTEN_SUMMARIES)) {
      expect(line, s.path).toContain(s.path);
      expect(capability, s.path).toContain(s.path);
    }
    expect([...line.matchAll(/\/(?:journal\/[a-z-]+|rose)\b/g)].map((m) => m[0]).sort()).toEqual(Object.values(LISTEN_SUMMARIES).map((s) => s.path).sort());
    expect(line).toContain("never says one exists on any other page");
    expect(ROSE_HISTORY.some((e) => e.id === "listen")).toBe(true);
  });

  it("the dock opens on the audiogram of the page's summary when a block asks for it", async () => {
    window.sessionStorage.clear();
    setRoseOpen(false);
    resetRoseChat("test");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("not found", { status: 404 })));
    render(<MemoryRouter initialEntries={["/rose"]}><RoseDock roseStatus="live" /></MemoryRouter>);
    expect(document.querySelector("[data-listen-player]")).toBeNull();
    window.dispatchEvent(new CustomEvent("rose:listen", { detail: { slug: "rose" } }));
    const player = await screen.findByLabelText("Rose reads aloud");
    expect(player.textContent).toContain("Rose · summary of this page");
    expect(player.textContent?.replace(/\s+/g, " ")).toContain(norm(LISTEN_SUMMARIES.rose.text.slice(0, 60)));
    cleanup();
    void getRoseChat("test");
  });

  it("the dock's starter question shows the recorded length, from the same entry", () => {
    window.sessionStorage.clear();
    setRoseOpen(true);
    resetRoseChat("test");
    render(<MemoryRouter initialEntries={["/rose"]}><RoseDock roseStatus="live" /></MemoryRouter>);
    expect(screen.getByRole("button", { name: /^Listen to a summary of this page · 1 min$/ })).toBeTruthy();
    expect(listenSummaryBySlug("rose")?.durationMs).toBe(73796);
  });
});
