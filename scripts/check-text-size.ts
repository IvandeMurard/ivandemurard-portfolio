// Text size checker: opens every route of the built site (dist/) in a browser and counts the visible text nodes that are too
// small to read. One rule for the whole site (board N, 19 Nov 2026):
//
//   - running text, captions, table cells, figure labels, meta lines (read time, dates, statuses): at least 13 px;
//   - uppercase tracked labels (the "kickers": uppercase and letter-spaced): at least 12 px;
//   - no exception for figures: an SVG label is measured at its rendered size (font size times the figure's scale).
//
//   bunx tsx scripts/check-text-size.ts          per-route counts, and the worst offenders (after `bun run build`)
//   PW_CHANNEL=msedge ...                        on Windows ARM64, use the installed Edge
//
// scripts/check-journeys.ts runs the same check and fails on any count above 0. Nothing here writes a file.

import { spawn, type ChildProcess } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { chromium } from "@playwright/test";
import { SEO_ROUTES } from "./seo-routes";

export const MIN_TEXT_PX = 13;
export const MIN_KICKER_PX = 12;
export const VIEWPORTS = [{ name: "1440", width: 1440, height: 900 }, { name: "768", width: 768, height: 1024 }, { name: "390", width: 390, height: 844 }] as const;

export interface SmallText { text: string; size: number; kicker: boolean; where: string }
export interface RouteCount { path: string; viewport: string; small: SmallText[] }

/** Runs in the page. Opens every <details> (their text is read once opened), scrolls through the page so late content mounts. */
const collect = async ({ minText, minKicker }: { minText: number; minKicker: number }): Promise<SmallText[]> => {
  document.querySelectorAll("details").forEach((d) => { d.open = true; });
  for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.8) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 40));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 300));

  const describe = (el: Element) => {
    const cls = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean).slice(0, 3).join(".");
    return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}`;
  };
  const found: SmallText[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = (node.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!text) continue;
    const el = node.parentElement;
    if (!el || el.closest("script,style,noscript,template")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const rects = el.getClientRects();
    if (rects.length === 0) continue; // an ancestor is display:none
    const r = rects[0];
    if (r.width < 2 || r.height < 2) continue; // visually hidden (sr-only)
    let size = parseFloat(cs.fontSize);
    if (el instanceof SVGElement) {
      const m = (el as SVGGraphicsElement).getScreenCTM?.();
      if (m) size *= Math.hypot(m.a, m.b); // a figure scaled to its box: measure the rendered size
    }
    const kicker = cs.textTransform === "uppercase" && parseFloat(cs.letterSpacing) > 0;
    if (size < (kicker ? minKicker : minText) - 0.01) found.push({ text: text.slice(0, 48), size: Math.round(size * 10) / 10, kicker, where: describe(el) });
  }
  // A placeholder is text too.
  document.querySelectorAll("input[placeholder],textarea[placeholder]").forEach((el) => {
    const size = parseFloat(getComputedStyle(el).fontSize);
    if (size < minText - 0.01 && (el as HTMLElement).getClientRects().length) found.push({ text: `placeholder: ${el.getAttribute("placeholder")}`.slice(0, 48), size, kicker: false, where: describe(el) });
  });
  return found;
};

const serve = async (dist: string, port: number): Promise<ChildProcess> => {
  const child = spawn("node", [join("tests", "journeys", "serve-dist.mjs"), String(port)], { cwd: process.cwd(), env: { ...process.env, PW_PORT: String(port) }, stdio: ["ignore", "pipe", "inherit"] });
  await new Promise<void>((ok, bad) => {
    child.stdout!.on("data", (d) => { if (String(d).includes("dist served")) ok(); });
    child.on("exit", (code) => bad(new Error(`serve-dist exited with ${code}`)));
    setTimeout(() => bad(new Error("serve-dist did not start")), 15000);
  });
  void dist;
  return child;
};

export const measureTextSizes = async (paths = SEO_ROUTES.map((r) => r.path)): Promise<RouteCount[]> => {
  const dist = resolve("dist");
  if (!existsSync(join(dist, "index.html"))) throw new Error("dist/index.html is missing: run `bun run build` first.");
  const port = Number(process.env.TEXT_SIZE_PORT ?? 4191);
  const server = await serve(dist, port);
  let browser;
  try {
    browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
  } catch (e) {
    server.kill();
    throw new Error(`no browser to measure text with (${(e as Error).message.split("\n")[0]}). Locally set PW_CHANNEL=msedge; in CI run \`bunx playwright install chromium\` first.`);
  }
  const results: RouteCount[] = [];
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, reducedMotion: "reduce" });
      for (const path of paths) {
        const page = await ctx.newPage();
        // tsx wraps named functions in __name(); the page has no such helper.
        await page.addInitScript("window.__name = (f) => f;");
        // The journeys never call the backend (see tests/journeys/helpers.ts).
        await page.route(/supabase\.co|\/functions\/v1\//, (route) => route.fulfill({ status: 204, body: "" }));
        await page.goto(`http://127.0.0.1:${port}${path}`, { waitUntil: "load" });
        await page.waitForTimeout(1200);
        const small = await page.evaluate(collect, { minText: MIN_TEXT_PX, minKicker: MIN_KICKER_PX });
        results.push({ path, viewport: vp.name, small });
        await page.close();
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
  return results;
};

/** The per-route table, and the worst offenders. */
export const report = (results: RouteCount[], top = 12): string => {
  const lines: string[] = [];
  const paths = [...new Set(results.map((r) => r.path))];
  lines.push(`${"route".padEnd(46)} ${VIEWPORTS.map((v) => v.name.padStart(6)).join(" ")}`);
  for (const p of paths) lines.push(`${p.padEnd(46)} ${VIEWPORTS.map((v) => String(results.find((r) => r.path === p && r.viewport === v.name)?.small.length ?? "?").padStart(6)).join(" ")}`);
  const total = results.reduce((n, r) => n + r.small.length, 0);
  lines.push(`${"total".padEnd(46)} ${VIEWPORTS.map((v) => String(results.filter((r) => r.viewport === v.name).reduce((n, r) => n + r.small.length, 0)).padStart(6)).join(" ")}`);
  if (total) {
    const by = new Map<string, { n: number; sizes: Set<number>; sample: string }>();
    for (const r of results) for (const s of r.small) {
      const e = by.get(s.where) ?? { n: 0, sizes: new Set<number>(), sample: s.text };
      e.n++; e.sizes.add(s.size); by.set(s.where, e);
    }
    lines.push("", `worst offenders (selector, count over all routes and widths, sizes, sample):`);
    for (const [where, e] of [...by].sort((a, b) => b[1].n - a[1].n).slice(0, top)) lines.push(`  ${String(e.n).padStart(4)}  ${where.slice(0, 70)}  [${[...e.sizes].join(", ")}px]  "${e.sample}"`);
  }
  return lines.join("\n");
};

if (process.argv[1] && /check-text-size\.ts$/.test(process.argv[1])) {
  measureTextSizes()
    .then((results) => {
      console.log(report(results, Number(process.env.TOP ?? 12)));
      process.exit(results.some((r) => r.small.length) ? 1 : 0);
    })
    .catch((e) => { console.error(`[check-text-size] ${(e as Error).message}`); process.exit(1); });
}
