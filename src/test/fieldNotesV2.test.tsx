import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { readFileSync } from "node:fs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import Journal from "@/pages/Journal";
import JournalEntry from "@/pages/JournalEntry";
import { JOURNAL_ENTRIES, type JournalBlock, type PeakBlock } from "@/content/journal";
import { CARDS, INDEX_COPY, INDEX_HERO, LEAD, REFERENCE_ZONE, heroMeta, metaLine, revisedLabel, testedOn, joinNames } from "@/content/journalIndex";
import { visibleMinutes } from "@/content/readingTime";
import { SECTION_INDEX } from "@/content/sectionIndex.generated";
import { journalHeadingIds } from "@/lib/journalHeadingIds";
import { STATUSES } from "@/content/statuses";
import { SEO_ROUTES } from "../../scripts/seo-routes";

class NoopObserver { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopObserver);
  vi.stubGlobal("ResizeObserver", NoopObserver);
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const BOUNDARIES = "agent-boundaries-aetherix";
const HARNESS = "harnesses-graders-closed-loops";
const TRUTH = "whose-truth-is-the-ground-truth";
const SLUGS = [HARNESS, BOUNDARIES, TRUTH];
const OLD_TITLE = "A wrong forecast is absorbed. A wrong action reaches a guest.";
const NEW_TITLE = "Where should an agent's responsibility end?";

const wrap = (el: JSX.Element, url: string) => (
  <TooltipProvider><MoodProvider><AmbienceProvider><MemoryRouter initialEntries={[url]}>{el}</MemoryRouter></AmbienceProvider></MoodProvider></TooltipProvider>
);
const index = () => render(wrap(<Routes><Route path="/journal" element={<Journal />} /></Routes>, "/journal"));
const note = (slug: string) => render(wrap(<Routes><Route path="/journal/:slug" element={<JournalEntry />} /></Routes>, `/journal/${slug}`));
const entry = (slug: string) => JOURNAL_ENTRIES.find((e) => e.slug === slug)!;
const ref = readFileSync("docs/field-notes-prototype/field-index-day.html", "utf8");
const refN = readFileSync("docs/field-notes-prototype/field-index-night.html", "utf8");
const board = readFileSync("docs/field-notes-prototype/field-note-pattern-day.html", "utf8");
const text = (el: Element | null) => el?.textContent?.replace(/\s+/g, " ").trim() ?? "";

// Heading ids of the three notes as they were on main, before this branch (src/content/sectionIndex.generated.ts at 4bc0c87).
const IDS_BEFORE: Record<string, string[]> = {
  "/journal/agent-boundaries-aetherix": ["the-asymmetry", "why-one-model-collapses", "where-the-line-landed", "what-the-split-buys", "what-it-cost", "what-i-would-have-lost", "apply-this-to-your-project"],
  "/journal/harnesses-graders-closed-loops": ["1-the-vocabulary-through-the-driving-test", "2-three-arms-and-what-each-product-can-afford", "what-each-product-covers-and-what-each-gap-costs", "3-working-against-reliable-five-dimensions", "4-the-reliability-pyramid", "5-evaluation-as-a-contract", "6-acceptance-criteria-the-part-everyone-skips", "the-two-rules-that-make-the-difference", "7-the-canary-and-why-it-was-invalidated", "8-adversarial-review-who-grades-the-grader", "9-confidence-three-things-people-conflate", "10-human-in-the-loop-by-design-or-by-default", "11-signals-ontology-priors", "12-what-a-harness-finds-that-no-unit-test-sees", "13-two-harnesses-and-which-one-this-is", "where-the-two-meet-the-verify-step", "what-it-does-not-add", "14-frequently-asked-questions", "13-frequently-asked-questions", "apply-this-to-your-project", "15-closing-note", "closing-note"],
  "/journal/whose-truth-is-the-ground-truth": ["1-what-truth-means-here", "2-a-tuesday-station-by-station", "3-a-yes-is-not-a-right", "4-the-truth-that-never-comes-back", "5-what-truth-is-worth-to-a-business", "6-write-the-verdict-before-the-data", "7-checklist", "apply-this-to-your-project", "8-faq", "isn-t-the-user-always-right", "what-if-the-truth-never-comes-back", "can-a-company-sell-its-verified-know-how", "9-sources"],
};

describe("Every heading id is unchanged", () => {
  it.each(Object.keys(IDS_BEFORE))("%s: the generated section index has the same ids, in the same order", (path) => {
    expect(SECTION_INDEX.find((e) => e.path === path)!.sections.map((s) => s.id)).toEqual(IDS_BEFORE[path]);
  });

  it.each(SLUGS)("%s: every id of before is in the rendered page", (slug) => {
    note(slug);
    for (const id of IDS_BEFORE[`/journal/${slug}`]) expect(document.getElementById(id), id).not.toBeNull();
  });

  it("derives the ids of the body from the headings, as before", () => {
    for (const slug of SLUGS) {
      const ids = journalHeadingIds(entry(slug).body).filter(Boolean) as string[];
      for (const id of ids) expect(IDS_BEFORE[`/journal/${slug}`], `${slug}#${id}`).toContain(id);
    }
  });
});

describe("The retitled note", () => {
  it("has the new title, the same slug, and the old title as its hook", () => {
    expect(entry(BOUNDARIES).title).toBe(NEW_TITLE);
    expect(entry(BOUNDARIES).hook).toBe(OLD_TITLE);
    expect(entry(BOUNDARIES).slug).toBe("agent-boundaries-aetherix");
  });

  it("says the new title everywhere the title appears", () => {
    const route = SEO_ROUTES.find((r) => r.path === `/journal/${BOUNDARIES}`)!;
    expect(route.title).toBe(`${NEW_TITLE} · Ivan de Murard`);
    expect(JSON.stringify(route.jsonLd)).toContain(NEW_TITLE);
    expect(JSON.stringify(route.jsonLd)).not.toContain(OLD_TITLE);
    expect(readFileSync(`public/${BOUNDARIES}.md`, "utf8").split("\n")[0]).toBe(`# ${NEW_TITLE}`);
    expect(SECTION_INDEX.find((e) => e.path === `/journal/${BOUNDARIES}`)!.title).toBe(NEW_TITLE);
    for (const f of ["public/llms.txt", "public/llms-full.txt", "scripts/llms-full-preamble.txt"]) {
      const t = readFileSync(f, "utf8");
      expect(t, f).toContain(NEW_TITLE);
      expect(t, f).not.toContain(`[${OLD_TITLE}]`);
    }
    // Cross-links in the other two notes.
    for (const slug of [HARNESS, TRUTH]) {
      const r = entry(slug).related!.find((x) => x.to === `/journal/${BOUNDARIES}`)!;
      expect(r.label).toBe(NEW_TITLE);
    }
  });

  it("is the title of the page", () => {
    note(BOUNDARIES);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(NEW_TITLE);
    expect(document.title).toContain(NEW_TITLE);
  });
});

describe("Computed meta lines", () => {
  it("counts the read time the same way for all three notes", () => {
    for (const slug of SLUGS) expect(entry(slug).readingMinutes, slug).toBe(visibleMinutes(entry(slug).body));
  });

  it("builds the hero line, and each note's line, from the content", () => {
    expect(revisedLabel(1)).toBe("revised once");
    expect(revisedLabel(2)).toBe("revised twice");
    expect(revisedLabel(7)).toBe("revised 7 times");
    expect(joinNames(["Aetherix", "Lore"])).toBe("Aetherix and Lore");
    const revisions = JOURNAL_ENTRIES.reduce((n, e) => n + (e.updates?.length ?? 0), 0);
    expect(heroMeta()).toBe(`3 notes · revised ${revisions} times · tested on Aetherix and Lore`);
    expect(revisions).toBe(13);
    expect(metaLine(entry(TRUTH))).toBe(`${entry(TRUTH).readingMinutes} min · tested on ${joinNames(testedOn(TRUTH))} · revised once`);
  });
});

describe("The index", () => {
  it("has the copy of the reference, in Day and Night", () => {
    const strings = [
      INDEX_HERO.kicker, INDEX_HERO.title, INDEX_HERO.line, INDEX_COPY.startHere, INDEX_COPY.readNote, INDEX_COPY.systems, INDEX_COPY.allCases,
      INDEX_COPY.compare.lead, INDEX_COPY.compare.link, LEAD.pitch, LEAD.why, LEAD.proof.kicker, LEAD.proof.lead, LEAD.proof.steps[2].text, // step 2 and the first step were reworded on the PR 53 review
      ...Object.values(CARDS).flatMap((c) => [c.pitch.replace(/"/g, "&quot;").length ? c.pitch : "", c.moment.label, c.moment.text]),
      ...JOURNAL_ENTRIES.map((e) => e.decision),
      ...JOURNAL_ENTRIES.filter((e) => e.slug !== HARNESS).map((e) => e.title),
      "What is an LLM evaluation harness?",
    ];
    // The reference marks some words up (<b>): compare its text, with the tags and the entities removed.
    const plain = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
    for (const html of [ref, refN]) for (const s of strings) if (s) expect(plain(html), s).toContain(s);
  });

  it("lists each note once, with one focus stop per card, and no dates", () => {
    index();
    expect(screen.queryByText("All entries")).toBeNull();
    expect(screen.queryByText(/Explore by question/)).toBeNull();
    const links = screen.getAllByRole("link").filter((l) => l.getAttribute("href")?.startsWith("/journal/"));
    expect(links.map((l) => l.getAttribute("href")).sort()).toEqual(SLUGS.map((s) => `/journal/${s}`).sort());
    for (const l of links) expect(l.textContent).toContain(INDEX_COPY.readNote);
    for (const e of JOURNAL_ENTRIES) expect(document.body.textContent).not.toContain(e.date);
    expect(document.body.textContent).not.toMatch(/\b(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, 20\d\d/);
  });

  it("says the computed meta of each note, and the hero line", () => {
    index();
    expect(document.body.textContent).toContain(heroMeta());
    for (const e of JOURNAL_ENTRIES) expect(document.body.textContent).toContain(metaLine(e));
  });

  it("quotes Lore only in verbatim fragments of the recorded answer in section 12", () => {
    const answer = (entry(HARNESS).body.find((b) => b.kind === "stepper") as Extract<JournalBlock, { kind: "stepper" }>).answer;
    const quoted = (s: string) => [...s.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
    const peak = entry(HARNESS).body.find((b): b is PeakBlock => b.kind === "peak")!;
    const all = [...LEAD.proof.steps.map((s) => s.text), ...peak.boxes.map((b) => b.text)];
    const fragments = all.flatMap(quoted);
    expect(fragments).toEqual(expect.arrayContaining(["considered NORMAL", "no further action is required"]));
    for (const f of fragments) expect(answer, f).toContain(f);
  });

  it("names the systems with their lamp and status word from statuses.ts, and ends with the shared contact block", () => {
    index();
    const row = screen.getByRole("region", { name: INDEX_COPY.systems });
    expect(within(row).getByRole("link", { name: /Aetherix/ }).getAttribute("href")).toBe("/aetherix");
    expect(text(row)).toContain(STATUSES.aetherix.word);
    expect(text(row)).toContain(STATUSES.lore.word);
    expect(within(row).getByRole("link", { name: INDEX_COPY.allCases }).getAttribute("href")).toBe("/case-studies");
    expect(document.getElementById("contact")).not.toBeNull();
    const compare = screen.getByRole("link", { name: INDEX_COPY.compare.link });
    expect(compare.getAttribute("href")).toMatch(/^mailto:/);
    expect(text(compare.parentElement)).toBe(`${INDEX_COPY.compare.lead} ${INDEX_COPY.compare.link}.`);
  });

  it("has one strong contrast: the lead's proof panel is the only navy panel before the contact block", () => {
    const { container } = index();
    const navy = [...container.querySelectorAll(".section-inverse")].filter((e) => e.id !== "contact");
    expect(navy).toHaveLength(1);
  });
});

describe("The note pattern", () => {
  it.each(SLUGS)("%s: the hook, the intro, and one peak moment", (slug) => {
    const { container } = note(slug);
    const e = entry(slug);
    expect(text(container)).toContain(e.hook);
    expect(text(container)).toContain(e.intro);
    expect(container.querySelectorAll("[data-peak]")).toHaveLength(1);
    expect(container.querySelectorAll("section[data-reference]")).toHaveLength(1);
    // The meta line: the decision, the read time, "revised N times" linked to #updates (which exists).
    expect(text(container)).toContain(e.decision);
    const revised = screen.getByRole("link", { name: revisedLabel(e.updates!.length) });
    expect(revised.getAttribute("href")).toBe("#updates");
    expect(document.getElementById("updates")).not.toBeNull();
  });

  it("puts each peak where the brief says", () => {
    const order = (slug: string, a: string, b: string) => {
      const { container } = note(slug);
      const A = container.querySelector(a)!, B = container.querySelector(b)!;
      expect(A, a).toBeTruthy();
      expect(B, b).toBeTruthy();
      const pos = A.compareDocumentPosition(B);
      cleanup();
      return pos & Node.DOCUMENT_POSITION_FOLLOWING ? "before" : "after";
    };
    // Harness: right after the "Read this if" card, before "Check your own system". Boundaries: just before the service blueprint. Truth: in section 3.
    expect(order(HARNESS, "[data-peak]", "[id='1-the-vocabulary-through-the-driving-test']")).toBe("before");
    expect(order(HARNESS, "[data-peak]", "[data-self-diagnostic], section[aria-label='Check your own system'], #check-your-own-system")).toBe("before");
    expect(order(HARNESS, "[data-peak]", "#apply-this-to-your-project")).toBe("before");
    expect(order(BOUNDARIES, "[data-peak]", "#what-the-split-buys")).toBe("before");
    expect(order(BOUNDARIES, "#where-the-line-landed", "[data-peak]")).toBe("before");
    expect(order(TRUTH, "[id='3-a-yes-is-not-a-right']", "[data-peak]")).toBe("before");
    expect(order(TRUTH, "[data-peak]", "[id='4-the-truth-that-never-comes-back']")).toBe("before");
    const bodies = [entry(BOUNDARIES).body, entry(HARNESS).body, entry(TRUTH).body];
    expect(bodies.map((b) => b.filter((x) => x.kind === "peak").length)).toEqual([1, 1, 1]);
    const bb = entry(BOUNDARIES).body;
    expect(bb[bb.findIndex((x) => x.kind === "peak") + 1].kind).toBe("blueprint");
  });

  it("copies the peak moments of board J", () => {
    const html = board.replace(/&amp;/g, "&");
    for (const slug of [BOUNDARIES, TRUTH]) {
      const p = entry(slug).body.find((b): b is PeakBlock => b.kind === "peak")!;
      // Reviewed on PR 53: the board's "Peak · " annotation is not copy, and one box says "guests" instead of "covers".
      const reviewed = ["The real number of guests arrives."];
      const lower = (x: string) => x.charAt(0).toLowerCase() + x.slice(1);
      for (const s of [p.kicker, p.lead, ...p.boxes.flatMap((b) => [b.label, b.text, b.note ?? ""])]) {
        if (!s || reviewed.includes(s)) continue;
        const h = html.replace(/&quot;/g, '"');
        const t = s.replace(/,\s+illustrative/, " · illustrative");
        expect(h.includes(t) || h.includes(lower(t)), s).toBe(true);
      }
      expect(p.kicker).not.toMatch(/^Peak/);
    }
    for (const e of JOURNAL_ENTRIES) expect(html, e.hook).toContain(e.hook);
  });

  it("the harness peak tells the section 12 story, without the 61/64 console, and the console stays in section 6", () => {
    const p = entry(HARNESS).body.find((b): b is PeakBlock => b.kind === "peak")!;
    expect(p.kicker).toBe("The proof in ten seconds \u00b7 recorded run, Lore");
    expect(p.boxes[0].text).not.toMatch(/0\.30/);
    expect(p.boxes[1].text).toBe("The first harness passed it. Reading the answers caught it; the graders now fail it and block the release.");
    expect(entry(HARNESS).body.some((x) => x.kind === "console")).toBe(true);
    const { container } = note(HARNESS);
    expect(container.querySelector("[data-peak]")!.querySelector("button")).toBeNull();
  });

  it("links the peak to the replay in section 12", () => {
    const { container } = note(HARNESS);
    const peak = container.querySelector("[data-peak]")!;
    const link = within(peak as HTMLElement).getByRole("link", { name: "Replay it in section 12" });
    expect(link.getAttribute("href")).toBe("#12-what-a-harness-finds-that-no-unit-test-sees");
    expect(document.getElementById("12-what-a-harness-finds-that-no-unit-test-sees")).not.toBeNull();
  });

  it.each(SLUGS)("%s: Continue exploring comes after the argument and before the reference zone, as the two other notes", (slug) => {
    const { container } = note(slug);
    const nav = container.querySelector("nav[aria-labelledby='continue-exploring']")!;
    const zone = container.querySelector("section[data-reference]")!;
    expect(nav.compareDocumentPosition(zone) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const cards = within(nav as HTMLElement).getAllByRole("link").filter((l) => l.getAttribute("href")!.startsWith("/journal/"));
    expect(cards.map((l) => l.getAttribute("href")).sort()).toEqual(SLUGS.filter((s) => s !== slug).map((s) => `/journal/${s}`).sort());
    for (const n of JOURNAL_ENTRIES.filter((e) => e.slug !== slug)) expect(text(nav)).toContain(n.decision);
  });

  it.each(SLUGS)("%s: the reference zone holds the end matter, and every chip reaches an id in the page", (slug) => {
    const { container } = note(slug);
    const zone = container.querySelector("section[data-reference]") as HTMLElement;
    const cfg = REFERENCE_ZONE[slug];
    expect(within(zone).getAllByRole("link").length).toBeGreaterThanOrEqual(cfg.chips.length);
    for (const c of cfg.chips) expect(document.getElementById(c.id), c.id).not.toBeNull();
    expect(zone.contains(document.getElementById(cfg.from))).toBe(true);
    expect(zone.contains(document.getElementById("apply-this-to-your-project"))).toBe(true);
    expect(zone.contains(document.getElementById("updates"))).toBe(true);
    // An argument section is never moved into the zone.
    const nums = [...container.querySelectorAll("h2[id]")].filter((h) => /^\d+\./.test(text(h)) && zone.contains(h)).map((h) => h.id);
    const refNums = slug === HARNESS ? ["14-frequently-asked-questions", "15-closing-note"] : slug === TRUTH ? ["7-checklist", "8-faq", "9-sources"] : [];
    expect(nums).toEqual(refNums);
  });

  it("puts 'All Field Notes · 3' at the top of the contents rail", () => {
    const { container } = note(HARNESS);
    const links = [...container.querySelectorAll("a")].filter((a) => text(a) === `All Field Notes · ${JOURNAL_ENTRIES.length}`);
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0].getAttribute("href")).toBe("/journal");
  });
});

describe("Contrast and size on the navy sections", () => {
  // Tokens: src/index.css (.section-inverse re-scopes them). HSL triples as written there.
  type HSL = [number, number, number];
  const rgb = ([h, s, l]: HSL) => {
    const S = s / 100, L = l / 100, k = (n: number) => (n + h / 30) % 12, a = S * Math.min(L, 1 - L);
    return [0, 8, 4].map((n) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))));
  };
  const lum = (c: HSL) => { const [r, g, b] = rgb(c).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (a: HSL, b: HSL) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const DAY = { ground: [215, 100, 11] as HSL, primary: [42, 41, 97] as HSL, onSurface: [42, 30, 92] as HSL, variant: [42, 15, 78] as HSL, secondary: [39, 96, 82] as HSL, stop: [8, 66, 68] as HSL, onPrimary: [215, 100, 11] as HSL };
  const NIGHT = { ...DAY, ground: [32, 14, 7] as HSL, secondary: [39, 80, 70] as HSL };

  it.each([["Day", DAY], ["Night", NIGHT]] as const)("%s: every text token reaches 4.5:1 on the navy ground", (_name, t) => {
    const r = { primary: ratio(t.primary, t.ground), onSurface: ratio(t.onSurface, t.ground), variant: ratio(t.variant, t.ground), secondary: ratio(t.secondary, t.ground), stop: ratio(t.stop, t.ground), bubble: ratio(t.onPrimary, t.primary) };
    for (const [k, v] of Object.entries(r)) expect(v, `${_name} ${k}: ${v.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    console.log(`contrast ${_name}:`, Object.entries(r).map(([k, v]) => `${k} ${v.toFixed(2)}`).join(", "));
  });

  it("sets no text under 13px on a navy section", () => {
    const pattern = readFileSync("src/components/journal/NotePattern.tsx", "utf8");
    const peak = pattern.slice(pattern.indexOf("export const NotePeak"), pattern.indexOf("export type ReferenceChip"));
    const console_ = readFileSync("src/components/console/EvalConsole.tsx", "utf8");
    const inverse = console_.slice(console_.indexOf("inverse: {"), console_.indexOf("} as const;"));
    const page = readFileSync("src/pages/Journal.tsx", "utf8");
    const panel = page.slice(page.indexOf('<div className="section-inverse'), page.indexOf("</ol>"));
    for (const [name, src] of [["peak", peak], ["console", inverse], ["lead panel", panel]] as const) {
      const sizes = [...src.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)].map((m) => Number(m[1]));
      expect(sizes.length, name).toBeGreaterThan(0);
      for (const px of sizes) expect(px, `${name}: text-[${px}px]`).toBeGreaterThanOrEqual(13);
      expect(src, name).not.toMatch(/\btext-(xs|\[1[0-2](?:\.\d+)?px\])/);
    }
  });

  it("animates nothing in the peak or its ramps", () => {
    const pattern = readFileSync("src/components/journal/NotePattern.tsx", "utf8");
    expect(pattern).not.toMatch(/animate-|@keyframes|transition|requestAnimationFrame|setInterval|setTimeout/);
  });

  it("clips a 100vw band on its page wrapper, so the page never scrolls sideways", () => {
    expect(readFileSync("src/pages/JournalEntry.tsx", "utf8")).toContain("overflow-x-clip");
    expect(readFileSync("src/components/journal/NotePattern.tsx", "utf8")).toContain("ml-[calc(50%-50vw)] w-screen");
  });
});
