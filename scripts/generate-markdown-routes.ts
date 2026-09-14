// Postbuild: copies each hand-authored markdown mirror in public/ to its
// route-shaped URL inside dist, so /journal/<slug>.md and /<case-study>.md resolve.
// Source of truth for the mapping is scripts/seo-routes.ts (route.markdown).
// A route without a mirror emits nothing, so its .md URL stays a 404.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, join, dirname } from "path";
import { SEO_ROUTES } from "./seo-routes";

const DIST = resolve("dist");
const PUBLIC = resolve("public");

if (!existsSync(DIST)) {
  console.warn("[markdown-routes] dist/ missing, skipping.");
  process.exit(0);
}

let written = 0;
for (const route of SEO_ROUTES) {
  if (!route.markdown) continue;
  const src = join(PUBLIC, route.markdown);
  if (!existsSync(src)) {
    console.warn(`[markdown-routes] missing mirror ${route.markdown} for ${route.path}`);
    continue;
  }
  const target = join(DIST, `${route.path.replace(/^\//, "")}.md`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, readFileSync(src));
  written++;
}

console.log(`[markdown-routes] wrote ${written} .md route files into dist/`);
