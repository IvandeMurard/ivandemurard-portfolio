// Postbuild: injects the pre-rendered body captured by scripts/prerender-capture.py
// into each route's built HTML file, so a crawler that does not run JavaScript
// sees the real page instead of an empty <div id="root"></div>.
//
// Runs AFTER generate-seo-snapshots.ts, so the head tags stay generated and the
// stored bodies never carry stale meta. A route with no stored body is left
// exactly as it was (empty shell) rather than written with something broken.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import { SEO_ROUTES } from "./seo-routes";

const DIST = resolve("dist");
const STORE = resolve("prerendered");

if (!existsSync(DIST)) {
  console.warn("[apply-prerender] dist/ missing, skipping.");
  process.exit(0);
}

const slugFor = (path: string) =>
  path === "/" ? "index" : path.replace(/^\/|\/$/g, "").replace(/\//g, "__");

const fileFor = (path: string) =>
  path === "/" ? join(DIST, "index.html") : join(DIST, path.replace(/^\//, ""), "index.html");

let applied = 0;
let skipped = 0;

for (const route of SEO_ROUTES) {
  const body = join(STORE, `${slugFor(route.path)}.html`);
  const target = fileFor(route.path);
  if (!existsSync(body) || !existsSync(target)) {
    skipped++;
    continue;
  }
  const markup = readFileSync(body, "utf8");
  const html = readFileSync(target, "utf8");
  const next = html.replace(
    /<div id="root">\s*<\/div>/i,
    () => `<div id="root">${markup}</div>`,
  );
  if (next === html) {
    console.warn(`[apply-prerender] no #root container found in ${target}`);
    skipped++;
    continue;
  }
  writeFileSync(target, next);
  applied++;
}

console.log(`[apply-prerender] filled ${applied} route(s), skipped ${skipped}`);
