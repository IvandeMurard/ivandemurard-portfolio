// Regenerates public/llms-full.txt: the curated preamble
// (scripts/llms-full-preamble.txt) followed by the FULL text of every markdown
// mirror listed in scripts/seo-routes.ts, with one delimiter per document.
// The file name promises the corpus, so it carries the corpus.

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";
import { BASE_URL, SEO_ROUTES } from "./seo-routes";

const PUBLIC = resolve("public");
const preamble = readFileSync(resolve("scripts/llms-full-preamble.txt"), "utf8").trimEnd();

const parts: string[] = [preamble, "", "## Full documents", ""];

let docs = 0;
for (const route of SEO_ROUTES) {
  if (!route.markdown) continue;
  const src = join(PUBLIC, route.markdown);
  if (!existsSync(src)) continue;
  const slug = route.path.replace(/^\//, "");
  parts.push(
    `--- BEGIN DOCUMENT: ${slug} ---`,
    `# ${route.title.replace(/ · Ivan de Murard$/, "")}`,
    `URL: ${BASE_URL}${route.path}`,
    `Markdown: ${BASE_URL}${route.path}.md`,
    "",
    readFileSync(src, "utf8").trim(),
    "",
    `--- END DOCUMENT: ${slug} ---`,
    "",
  );
  docs++;
}

const out = parts.join("\n") + "\n";
writeFileSync(join(PUBLIC, "llms-full.txt"), out);
console.log(`[llms-full] wrote ${docs} full documents, ${Buffer.byteLength(out)} bytes`);
