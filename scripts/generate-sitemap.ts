// Generates public/sitemap.xml from SEO_ROUTES.
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { BASE_URL, SEO_ROUTES } from "./seo-routes";
import { buildToday, stableDate, writeIfChanged } from "./content-date";

const render = (lastmod: string) => {
  const urls = SEO_ROUTES.map((e) => {
    const loc = `${BASE_URL}${e.path === "/" ? "/" : e.path}`;
    return [
      "  <url>",
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n");
  });
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
    "",
  ].join("\n");
};

// lastmod is the date of the last change of the route list, not the build date.
const SITEMAP = resolve("public/sitemap.xml");
const existing = existsSync(SITEMAP) ? readFileSync(SITEMAP, "utf8") : null;
const lastmod = stableDate({
  render,
  existing,
  existingDate: existing?.match(/<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>/)?.[1] ?? null,
  today: buildToday(),
});

const changed = writeIfChanged(SITEMAP, render(lastmod));
console.log(`sitemap.xml ${changed ? "written" : "unchanged"} (${SEO_ROUTES.length} entries, lastmod ${lastmod})`);
