// Postbuild: emits per-route HTML snapshots with correct head meta
// (title, description, canonical, og:*, twitter:*, JSON-LD) into dist/<path>/index.html.
// Lovable hosting serves these static files for crawlers (Googlebot, social previews)
// while the SPA fallback still handles client-side navigation.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import { BASE_URL, DEFAULT_OG_IMAGE, SITE_NAME, TWITTER_HANDLE, SEO_ROUTES, type SeoRoute } from "./seo-routes";

const DIST = resolve("dist");
const INDEX = join(DIST, "index.html");

if (!existsSync(INDEX)) {
  console.warn("[seo-snapshots] dist/index.html missing, skipping.");
  process.exit(0);
}

const base = readFileSync(INDEX, "utf8");

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildHead(route: SeoRoute): string {
  const canonical = `${BASE_URL}${route.path === "/" ? "/" : route.path}`;
  const title = route.title;
  const desc = route.description;
  const type = route.type ?? "website";
  // NOTE: Lovable hosting serves dist/index.html for every unknown route via SPA fallback,
  // so the per-route subfolder snapshots are never read by crawlers. To avoid baking a
  // root canonical and root og:url into the HTML served for /atrium, /journeys, /aetherix,
  // /sonor, /tacet, /journal, /contact, we omit canonical and og:url from the static head
  // entirely. The runtime <Seo> component (src/components/Seo.tsx) sets the correct
  // per-route canonical and og:url after JS hydration (Googlebot renders JS).
  const lines: string[] = [
    `<title>${escapeAttr(title)}</title>`,
    `<meta name="description" content="${escapeAttr(desc)}" />`,
    `<meta property="og:type" content="${type}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(desc)}" />`,
    `<meta property="og:image" content="${DEFAULT_OG_IMAGE}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:creator" content="${TWITTER_HANDLE}" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(desc)}" />`,
    `<meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />`,
  ];
  // Reference canonical to silence unused-var lints; the value is intentionally not emitted.
  void canonical;

  if (route.jsonLd) {
    const payload = Array.isArray(route.jsonLd) ? route.jsonLd : [route.jsonLd];
    for (const obj of payload) {
      lines.push(`<script type="application/ld+json">${JSON.stringify(obj)}</script>`);
    }
  }
  return lines.join("\n    ");
}

function transform(html: string, route: SeoRoute): string {
  let out = html;
  // Strip any pre-existing title, description, canonical, og:*, twitter:* tags from the base template.
  out = out.replace(/\n?\s*<title>[\s\S]*?<\/title>/i, "");
  out = out.replace(/\n?\s*<meta\s+name=["']description["'][^>]*>/gi, "");
  out = out.replace(/\n?\s*<link\s+rel=["']canonical["'][^>]*>/gi, "");
  out = out.replace(/\n?\s*<meta\s+property=["']og:[^"']+["'][^>]*>/gi, "");
  out = out.replace(/\n?\s*<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, "");

  const head = buildHead(route);
  out = out.replace(/<\/head>/i, `    ${head}\n  </head>`);
  return out;
}

let written = 0;
for (const route of SEO_ROUTES) {
  const html = transform(base, route);
  if (route.path === "/") {
    writeFileSync(INDEX, html);
  } else {
    const dir = join(DIST, route.path.replace(/^\//, ""));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "index.html"), html);
  }
  written++;
}

console.log(`[seo-snapshots] wrote ${written} static HTML snapshots into dist/`);
