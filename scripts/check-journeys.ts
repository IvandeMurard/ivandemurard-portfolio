// Journey checker: crawls the built site (dist/) and fails on the defects a reader meets by following links.
//
//   bunx tsx scripts/check-journeys.ts          (after `bun run build`)
//
// a. every route of SEO_ROUTES and every internal link found (in the built HTML, in the Markdown mirrors and in the
//    source files that carry links): a 404 route, a missing #anchor on the target page, a missing .md/.txt/.pdf file,
//    a link to a route that only redirects (/journeys, /atherix, /rose-design-lab);
// b. every URL in llms.txt and llms-full.txt resolves to a route or a file in dist;
// c. every Rose source label (pageSections.ts) and every section index entry (sectionIndex.generated.ts) points to an
//    existing id on its page.
//
// Exit 1 on any failure. Nothing here touches supabase/ and nothing is written.

import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, relative, resolve } from "path";
import { BASE_URL, SEO_ROUTES } from "./seo-routes";
import { PAGE_SECTIONS } from "../src/content/pageSections";
import { SECTION_INDEX } from "../src/content/sectionIndex.generated";

const DIST = resolve("dist");
const SRC = resolve("src");

if (!existsSync(join(DIST, "index.html"))) {
  console.error("[check-journeys] dist/index.html is missing: run `bun run build` first.");
  process.exit(1);
}

type Finding = { rule: string; where: string; link: string; detail: string };
const findings: Finding[] = [];
const fail = (rule: string, where: string, link: string, detail: string) => findings.push({ rule, where, link, detail });

// ---------- the route table ----------------------------------------------------------------------------------------

const app = readFileSync("src/App.tsx", "utf8");
/** Routes that only redirect: <Route path="/x" element={<Navigate .../>} /> and the Rose design lab redirect. */
const REDIRECTS = new Set<string>();
const APP_ROUTES = new Set<string>();
for (const m of app.matchAll(/<Route\s+path="([^"]+)"\s+element=\{\s*<(\w+)/g)) {
  const [, path, el] = m;
  if (path === "*" || path.includes(":")) continue;
  if (el === "Navigate" || /Redirect$/.test(el)) REDIRECTS.add(path);
  else APP_ROUTES.add(path);
}
const SEO_PATHS = new Set(SEO_ROUTES.map((r) => r.path));
const isRoute = (p: string) => SEO_PATHS.has(p) || APP_ROUTES.has(p);

// ---------- the built files ----------------------------------------------------------------------------------------

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const DIST_FILES = new Set(walk(DIST).map((f) => "/" + relative(DIST, f).replace(/\\/g, "/")));

/** The built page of a route: dist/<path>/index.html (a prerendered body), or the SPA shell. */
const pageHtml = (path: string): string | null => {
  const f = path === "/" ? "/index.html" : `${path}/index.html`;
  return DIST_FILES.has(f) ? readFileSync(join(DIST, f), "utf8") : null;
};
const idsOf = (html: string): Set<string> => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const idCache = new Map<string, Set<string> | null>();
const idsFor = (path: string): Set<string> | null => {
  if (!idCache.has(path)) {
    const html = pageHtml(path);
    idCache.set(path, html ? idsOf(html) : null);
  }
  return idCache.get(path)!;
};
/** A page whose body is in the build (prerendered): its ids are checkable. The SPA shell has only #root. */
const prerendered = (path: string): boolean => {
  const ids = idsFor(path);
  return !!ids && ids.size > 3;
};

// ---------- link resolution ----------------------------------------------------------------------------------------

type Link = { where: string; href: string };
const ASSET_EXT = /\.(md|txt|pdf|xml|html|json|png|svg|webp|jpg|ico|mp3|wav|ogg)$/i;

/** A link to this site, as a path plus hash; null for anything else (external, mailto, a bare #hash). */
const internal = (href: string): { path: string; hash: string } | null => {
  let h = href.trim();
  if (h.startsWith(BASE_URL)) h = h.slice(BASE_URL.length) || "/";
  if (!h.startsWith("/") || h.startsWith("//")) return null;
  const m = h.match(/^([^?#]*)(?:\?[^#]*)?(?:#(.*))?$/);
  if (!m) return null;
  let hash = m[2] ?? "";
  try { hash = decodeURIComponent(hash); } catch { /* keep raw */ }
  return { path: m[1].replace(/\/$/, "") || "/", hash };
};

let checked = 0;
const seen = new Set<string>();
const checkLink = ({ where, href }: Link) => {
  const t = internal(href);
  if (!t) return;
  const key = `${where}|${href}`;
  if (seen.has(key)) return;
  seen.add(key);
  checked++;
  const { path, hash } = t;
  if (ASSET_EXT.test(path)) {
    if (!DIST_FILES.has(path)) fail("missing-file", where, href, `${path} is not in dist`);
    return;
  }
  if (REDIRECTS.has(path)) {
    fail("redirected-route", where, href, `${path} only redirects: link to its destination`);
    return;
  }
  const isJournal = /^\/journal\/[^/]+$/.test(path);
  if (!isRoute(path) && !isJournal && !DIST_FILES.has(`${path}/index.html`)) {
    fail("404-route", where, href, `${path} is not a route of the site`);
    return;
  }
  if (isJournal && !SEO_PATHS.has(path) && !SECTION_INDEX.some((e) => e.path === path)) {
    fail("404-route", where, href, `${path} is not a Field Note`);
    return;
  }
  if (hash) {
    const ids = idsFor(path);
    if (prerendered(path)) {
      if (!ids!.has(hash)) fail("missing-anchor", where, href, `#${hash} is not an id on ${path}`);
    } else {
      unverifiable.add(`${path}#${hash}`);
    }
  }
};
const unverifiable = new Set<string>();

// ---------- a. routes and links -------------------------------------------------------------------------------------

for (const r of SEO_ROUTES) {
  const f = r.path === "/" ? "/index.html" : `${r.path}/index.html`;
  if (!DIST_FILES.has(f)) fail("404-route", "SEO_ROUTES", r.path, `${f} is not in dist`);
  if (r.markdown && !DIST_FILES.has(`${r.path}.md`)) fail("missing-file", "SEO_ROUTES", r.path, `${r.path}.md is not in dist`);
}

// Links in the built HTML of every route.
for (const r of SEO_ROUTES) {
  const html = pageHtml(r.path);
  if (!html) continue;
  for (const m of html.matchAll(/<a\s[^>]*?href="([^"]+)"/g)) checkLink({ where: `dist${r.path === "/" ? "" : r.path}`, href: m[1].replace(/&amp;/g, "&") });
}
// Links in the Markdown mirrors.
for (const f of DIST_FILES) {
  if (!f.endsWith(".md")) continue;
  const md = readFileSync(join(DIST, f), "utf8");
  for (const m of md.matchAll(/\]\(([^)\s]+)\)/g)) checkLink({ where: `dist${f}`, href: m[1] });
}
// Links in the sources that render client-side (popovers, dialogs, Rose's own text, the content files).
const srcFiles = walk(SRC).filter((f) => /\.(ts|tsx)$/.test(f) && !/[\\/](test|integrations)[\\/]/.test(f) && !/\.generated\.ts$/.test(f));
const SRC_LINK_PATTERNS = [
  /\bto=(?:"|\{"|\{')(\/[^"'`\s{}$]*)/g,
  /\bhref=(?:"|\{"|\{')(\/[^"'`\s{}$]*)/g,
  /\bhref:\s*["'](\/[^"'`\s{}$]*)["']/g,
  /\]\((\/[^)\s{}$]*)\)/g,
  /\bnavigate\(\s*["'](\/[^"'`\s{}$]*)["']/g,
];
for (const f of srcFiles) {
  const text = readFileSync(f, "utf8");
  for (const re of SRC_LINK_PATTERNS) {
    for (const m of text.matchAll(re)) checkLink({ where: relative(process.cwd(), f).replace(/\\/g, "/"), href: m[1] });
  }
}

// ---------- b. llms.txt and llms-full.txt ---------------------------------------------------------------------------

for (const name of ["llms.txt", "llms-full.txt"]) {
  const f = join(DIST, name);
  if (!existsSync(f)) { fail("missing-file", name, name, `${name} is not in dist`); continue; }
  const text = readFileSync(f, "utf8");
  const urls = new Set([...text.matchAll(/https:\/\/ivandemurard\.com[^\s)>\]"'`,;]*/g)].map((m) => m[0].replace(/[.:]+$/, "")));
  for (const u of urls) checkLink({ where: name, href: u });
}

// ---------- c. Rose's source labels and the section index -----------------------------------------------------------

let labelled = 0;
const checkSection = (where: string, path: string, id: string) => {
  labelled++;
  if (REDIRECTS.has(path)) { fail("redirected-route", where, `${path}#${id}`, `${path} only redirects`); return; }
  if (!isRoute(path) && !SEO_PATHS.has(path)) { fail("404-route", where, `${path}#${id}`, `${path} is not a route of the site`); return; }
  if (prerendered(path)) {
    if (!idsFor(path)!.has(id)) fail("missing-anchor", where, `${path}#${id}`, `section id not on the built page`);
  } else unverifiable.add(`${path}#${id}`);
};
for (const [path, sections] of Object.entries(PAGE_SECTIONS)) {
  for (const s of sections) checkSection("pageSections.ts", path, s.id);
}
for (const e of SECTION_INDEX) {
  for (const s of e.sections) checkSection("sectionIndex.generated.ts", e.path, s.id);
}

// ---------- report --------------------------------------------------------------------------------------------------

console.log(`[check-journeys] ${SEO_ROUTES.length} routes, ${checked} internal links, ${labelled} source-label and section-index entries.`);
if (unverifiable.size) {
  console.log(`[check-journeys] ${unverifiable.size} anchor(s) on pages whose body is not in the build (not checkable here):`);
  for (const u of [...unverifiable].sort()) console.log(`  ? ${u}`);
}
if (findings.length) {
  console.log(`\n[check-journeys] FAIL: ${findings.length} defect(s)`);
  for (const f of findings) console.log(`  x [${f.rule}] ${f.where}: ${f.link} (${f.detail})`);
  process.exit(1);
}
console.log("[check-journeys] OK: no defect found.");
