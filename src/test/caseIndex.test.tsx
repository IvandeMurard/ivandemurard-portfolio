import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import CaseStudies from "@/pages/CaseStudies";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import { CASE_INDEX, GROUP_ARCH, GROUP_SOLO, LEGEND, START_WITH } from "@/content/caseIndex";
import { PROJECTS, PRIMARY_NAV } from "@/content/site";
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

const page = () => render(<MoodProvider><AmbienceProvider><MemoryRouter><CaseStudies /></MemoryRouter></AmbienceProvider></MoodProvider>);
const ref = (n: "day" | "night") => readFileSync(`docs/case-index-prototype/case-index-${n}.html`, "utf8");
const md = readFileSync("public/case-studies.md", "utf8");
/** The inline script of a static stub, to run it with a stand-in `location`. */
const scriptOf = (html: string) => html.slice(html.indexOf("<script>") + 8, html.indexOf("</script>"));
const CARDS = [...GROUP_ARCH.cards, ...GROUP_SOLO.cards];

describe("Case studies: the copy is the reference's", () => {
  it.each(["day", "night"] as const)("every sentence of the page is in case-index-%s.html", (n) => {
    const html = ref(n);
    const strings = [
      CASE_INDEX.kicker, CASE_INDEX.title, CASE_INDEX.line, CASE_INDEX.startWith, CASE_INDEX.readCase, CASE_INDEX.shows,
      ...LEGEND.map((l) => l.label),
      ...START_WITH.flatMap((s) => [s.need, s.to]),
      GROUP_ARCH.kicker, GROUP_ARCH.heading, GROUP_ARCH.line, GROUP_ARCH.link,
      GROUP_SOLO.kicker, GROUP_SOLO.heading, GROUP_SOLO.line,
      GROUP_ARCH.noPage.kicker, GROUP_ARCH.noPage.note, ...GROUP_ARCH.noPage.items.flatMap((i) => [i.name, i.role, i.status]),
      ...CARDS.flatMap((c) => [c.kicker, c.line, c.shows, PROJECTS[c.project].name]),
    ];
    for (const s of strings) expect(html, s).toContain(s);
  });

  it("uses the reference's order, and its status words are the words of statuses.ts", () => {
    const html = ref("day");
    const order = CARDS.map((c) => html.indexOf(`id="${c.id}" href`));
    expect(order.every((i) => i > 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    for (const c of CARDS) expect(html, c.id).toContain(`</i>${STATUSES[c.status].word}</span>`);
  });

  it("has no em-dash in the page copy or the Markdown mirror", () => {
    expect(readFileSync("src/content/caseIndex.ts", "utf8")).not.toContain("—");
    expect(md).not.toContain("—");
  });
});

describe("Case studies: the page", () => {
  it("shows every card with its name and its status word read from the data", () => {
    page();
    for (const c of CARDS) {
      const card = document.getElementById(c.id)!;
      expect(card.tagName).toBe("ARTICLE");
      expect(within(card).getByRole("heading", { level: 3 }).textContent).toBe(PROJECTS[c.project].name);
      expect(card.textContent).toContain(STATUSES[c.status].word);
    }
    expect(CARDS.map((c) => c.id)).toEqual(["aetherix", "tacet", "anima", "rose", "lore", "compass", "sonor"]);
  });

  it("maps each signal to one lamp colour of the legend", () => {
    expect(LEGEND.map((l) => l.signal)).toEqual(["go", "warn", "stop", "dark"]);
    page();
    const lamp = (id: string) => document.getElementById(id)!.querySelector("span[aria-hidden='true']")!.className;
    expect(lamp("rose")).toContain("bg-lamp-go-on-card");
    expect(lamp("lore")).toContain("bg-lamp-go-on-card");
    for (const id of ["aetherix", "tacet", "compass"]) expect(lamp(id)).toContain("bg-lamp-warn-on-card");
    expect(lamp("anima")).toContain("bg-lamp-stop-on-card");
    expect(lamp("sonor")).toContain("bg-lamp-dark-on-card");
    expect(STATUSES.anima.signal).toBe("stop");
    expect(STATUSES.sonor.signal).toBe("dark");
  });

  it("has one link per card, to the case, and no second competing link", () => {
    page();
    for (const c of CARDS) {
      const links = within(document.getElementById(c.id)!).getAllByRole("link");
      expect(links).toHaveLength(1);
      expect(links[0].getAttribute("href")).toBe(`/${PROJECTS[c.project].slug}`);
      expect(links[0].textContent).toBe(`${CASE_INDEX.readCase}: ${PROJECTS[c.project].name}`);
    }
  });

  it("has the architecture link, the 'No page yet' box and pills that reach a card", () => {
    page();
    expect(screen.getByRole("link", { name: GROUP_ARCH.link }).getAttribute("href")).toBe("/architecture");
    expect(screen.getByText("Orchestrator")).toBeTruthy();
    expect(screen.getByText("Peritia")).toBeTruthy();
    for (const s of START_WITH) {
      expect(document.getElementById(s.id), s.id).toBeTruthy();
      expect(screen.getByRole("link", { name: new RegExp(`${s.need}.*${s.to}`) }).getAttribute("href")).toBe(`#${s.id}`);
    }
  });

  it("keeps the photos of Compass and Sonor only, and ends with the shared Contact block", () => {
    page();
    const imgs = [...document.querySelectorAll("main img, #main-content img")].filter((i) => document.getElementById("contact") ? !document.getElementById("contact")!.contains(i) : true);
    const owners = imgs.map((i) => i.closest("article")?.id).filter(Boolean);
    expect(owners.sort()).toEqual(["compass", "sonor"]);
    expect(document.getElementById("contact")).toBeTruthy();
    expect(document.querySelector("footer")).toBeTruthy();
  });

  it("does not scroll sideways: the grid shrinks below 520px and no card has a fixed width", () => {
    const src = readFileSync("src/pages/CaseStudies.tsx", "utf8");
    expect(src).toContain("minmax(min(520px,100%),1fr)");
    expect(src).not.toMatch(/(?:^|[\s"'])(?:min-)?w-\[\d+px\]/);
  });
});

describe("Case studies: review fixes", () => {
  it("reads 'What it shows:' with the colon and one space, as in the reference", () => {
    expect(ref("day")).toContain("What it shows: </span>");
    page();
    for (const c of CARDS) expect(document.getElementById(c.id)!.textContent).toContain(`${CASE_INDEX.shows} ${c.shows}`);
    expect(CASE_INDEX.shows).toBe("What it shows:");
  });

  it("gives a photo card a veil over the whole text block and a full-ink kicker", () => {
    const src = readFileSync("src/pages/CaseStudies.tsx", "utf8");
    expect(src).toContain("from-case-card/95 via-case-card/85 to-case-card/70");
    expect(src).toContain('photo ? "text-case-ink" : "text-case-ink/80"');
  });

  it("names /case-studies in the Rose demo and as a reference route", async () => {
    const { HERO_EXCHANGES } = await import("@/components/rose/roseDemoData");
    const { referencePath } = await import("@/components/rose/roseMeasurement");
    expect(HERO_EXCHANGES.some((e) => e.where === "Reading: /case-studies" && e.src === "Source: case studies, /case-studies")).toBe(true);
    expect(referencePath("/case-studies?x=1")).toBe("/case-studies");
    expect(referencePath("/journeys")).toBeNull();
  });
});

describe("Case studies: tokens", () => {
  it("defines a tint per project for Day and Night, and no colour is written in the page", () => {
    const css = readFileSync("src/index.css", "utf8");
    const dusk = css.slice(css.indexOf('[data-mood="dusk"] {'));
    for (const t of ["aetherix", "tacet", "anima", "rose", "lore"]) {
      for (const part of ["hi", "lo"]) {
        expect(css, `--tint-${t}-${part} day`).toContain(`--tint-${t}-${part}:`);
        expect(dusk, `--tint-${t}-${part} night`).toContain(`--tint-${t}-${part}:`);
      }
    }
    expect(readFileSync("src/pages/CaseStudies.tsx", "utf8")).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });
});

describe("Case studies: route, redirect and mirrors", () => {
  it("is the route /case-studies; /journeys redirects to it and is gone from the indexed routes", () => {
    const app = readFileSync("src/App.tsx", "utf8");
    expect(app).toContain('<Route path="/case-studies" element={<CaseStudies />} />');
    expect(app).toContain('<Route path="/journeys" element={<Navigate to="/case-studies" replace />} />');
    expect(SEO_ROUTES.some((r) => r.path === "/journeys")).toBe(false);
    expect(SEO_ROUTES.find((r) => r.path === "/case-studies")?.markdown).toBe("case-studies.md");
    expect(PRIMARY_NAV.find((n) => n.label === "Case Studies")?.to).toBe("/case-studies");
  });

  it("leaves no /journeys in the snapshots, the public files or the source", () => {
    // The old route has no snapshot of its own: a static stub in public/ answers a client without JavaScript.
    expect(existsSync("prerendered/journeys.html")).toBe(false);
    expect(existsSync("prerendered/case-studies.html")).toBe(true);
    for (const f of readdirSync("prerendered")) expect(readFileSync(`prerendered/${f}`, "utf8"), f).not.toContain("/journeys");
    for (const f of ["public/sitemap.xml", "public/llms.txt", "public/llms-full.txt", "public/case-studies.md"]) expect(readFileSync(f, "utf8"), f).not.toContain("/journeys");
    expect(readFileSync("public/sitemap.xml", "utf8")).toContain("https://ivandemurard.com/case-studies");
    expect(readFileSync("public/llms.txt", "utf8")).toContain("https://ivandemurard.com/case-studies");
  });

  it.each([["journeys", "/case-studies"], ["atherix", "/aetherix"]])("has a static stub for /%s that a client without JavaScript follows to %s", (old, target) => {
    const html = readFileSync(`public/${old}/index.html`, "utf8");
    const route = SEO_ROUTES.find((r) => r.path === target)!;
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain(`<title>${route.title.replace(/&/g, "&amp;")}</title>`);
    expect(html).toContain(`<link rel="canonical" href="https://ivandemurard.com${target}" />`);
    expect(html).toContain('<meta name="robots" content="noindex" />');
    expect(html).toContain(`<meta http-equiv="refresh" content="0; url=${target}" />`);
    expect(html).toContain(`<a href="${target}">`);
    // The host serves the stub to every client, so it handles first loads: a script first, keeping the hash; the meta refresh is the no-JS fallback.
    expect(html).toContain("location.replace");
    expect(html).toContain("location.hash");
    expect(html.indexOf("<script>")).toBeLessThan(html.indexOf('http-equiv="refresh"'));
    const seen: string[] = [];
    new Function("location", scriptOf(html))({ search: "", hash: "#section", replace: (u: string) => seen.push(u) });
    expect(seen).toEqual([`${target}#section`]);
    // Not an indexed route, so no postbuild script writes over the stub.
    expect(SEO_ROUTES.some((r) => r.path === `/${old}`)).toBe(false);
    // The React redirects stay.
    expect(readFileSync("src/App.tsx", "utf8")).toContain(`<Route path="/${old}" element={<Navigate to="${target}" replace />} />`);
  });

  it("moves the Rose case study to /rose: a static stub and a React redirect for /rose-design-lab, the lab at /rose/lab", () => {
    const html = readFileSync("public/rose-design-lab/index.html", "utf8");
    const route = SEO_ROUTES.find((r) => r.path === "/rose")!;
    expect(route.markdown).toBe("rose.md");
    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain(`<title>${route.title}</title>`);
    expect(html).toContain('<link rel="canonical" href="https://ivandemurard.com/rose" />');
    expect(html).toContain('<meta name="robots" content="noindex" />');
    expect(html).toContain('<meta http-equiv="refresh" content="0; url=/rose" />');
    expect(html).toContain('<a href="/rose">');
    // Same mapping as RoseDesignLabRedirect, run by the stub on a first load, hash kept.
    expect(html).toContain("location.replace");
    expect(html).toContain("location.hash");
    expect(html.indexOf("<script>")).toBeLessThan(html.indexOf('http-equiv="refresh"'));
    const go = (search: string, hash: string) => {
      const seen: string[] = [];
      new Function("location", scriptOf(html))({ search, hash, replace: (u: string) => seen.push(u) });
      return seen;
    };
    expect(go("?concept=d", "")).toEqual(["/rose/lab?concept=d"]);
    expect(go("?concept=narrative", "#ch-trust")).toEqual(["/rose/lab?concept=narrative#ch-trust"]);
    expect(go("?concept=", "")).toEqual(["/rose/lab?concept="]);
    expect(go("", "")).toEqual(["/rose"]);
    expect(go("", "#ch-learn")).toEqual(["/rose#ch-learn"]);
    expect(go("?x=1", "#a")).toEqual(["/rose#a"]);
    expect(SEO_ROUTES.some((r) => r.path === "/rose-design-lab" || r.path === "/rose/lab")).toBe(false);
    const app = readFileSync("src/App.tsx", "utf8");
    expect(app).toContain('<Route path="/rose" element={<RoseCasePage />} />');
    expect(app).toContain('<Route path="/rose/lab" element={<RoseDesignLab />} />');
    expect(app).toContain('<Route path="/rose-design-lab" element={<RoseDesignLabRedirect />} />');
    expect(app).toContain("`/rose/lab?concept=${encodeURIComponent(concept)}${hash}`");
    expect(existsSync("prerendered/rose-design-lab.html")).toBe(false);
    expect(existsSync("prerendered/rose.html")).toBe(true);
    expect(existsSync("public/rose-design-lab.md")).toBe(false);
  });

  it("is in the Markdown mirror, status words included, and in llms-full.txt", () => {
    for (const s of [CASE_INDEX.line, GROUP_ARCH.line, GROUP_SOLO.line, GROUP_ARCH.noPage.note]) expect(md, s).toContain(s);
    for (const c of CARDS) {
      for (const s of [c.kicker, c.line, c.shows, `Status: ${STATUSES[c.status].word}`]) expect(md, s).toContain(s);
      expect(md).toContain(`[${CASE_INDEX.readCase}](https://ivandemurard.com/${PROJECTS[c.project].slug})`);
    }
    for (const i of GROUP_ARCH.noPage.items) expect(md).toContain(`${i.name} · ${i.role} · Status: ${i.status}`);
    expect(readFileSync("public/llms-full.txt", "utf8")).toContain("--- BEGIN DOCUMENT: case-studies ---");
  });
});
