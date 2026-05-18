// Generates public/sitemap.xml from SEO_ROUTES.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { BASE_URL, SEO_ROUTES } from "./seo-routes";

const today = new Date().toISOString().slice(0, 10);

const urls = SEO_ROUTES.map((e) => {
  const loc = `${BASE_URL}${e.path === "/" ? "/" : e.path}`;
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
    e.priority ? `    <priority>${e.priority}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
});

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...urls,
  `</urlset>`,
  "",
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${SEO_ROUTES.length} entries)`);
