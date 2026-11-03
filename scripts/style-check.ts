// Checker for docs/style.md §5. Scans site copy for the banned patterns it can detect and for italic
// outside page heroes, and lists every hit with its file and line.
//   bunx tsx scripts/style-check.ts            prints the report and the baseline gap (exit 1 if a count moved)
//   bunx tsx scripts/style-check.ts --lower    rewrites docs/style-baseline.json, only if no count went up
// src/test/styleRules.test.ts runs the same scan as a ratchet against docs/style-baseline.json: a count
// may go down, never up, and a new file with a hit fails. A hit is fixed in the copy, or recorded in
// docs/style-allowlist.json with a one-line reason, reviewed by Ivan.
//
// Scope: src/content, src/pages, src/components (not src/components/ui or ai-elements, which are
// library primitives, and not generated files) and public/*.md. Comments are ignored.
// Heuristics, so a hit is a place to look, not a verdict. Not detectable, so not checked: maxim-like
// closing lines, and whether a mono label or pill is decorative.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { STATUSES } from "../src/content/statuses";

export type Hit = { file: string; line: number; pattern: PatternId; text: string };
export type AllowEntry = { file: string; pattern: PatternId; text: string; reason: string };

export const PATTERNS = {
  "em-dash": "Em-dash",
  "theatrical-fragment": "Theatrical fragment (a sentence of two words or fewer, next to another sentence)",
  "rhythm-triad": "Rhythm triad (three or more consecutive sentences of four words or fewer)",
  "contrast-reflex": "\"Not X, but Y\" / \"X, not Y\"",
  "colon-reveal": "Colon reveal (\"What I changed: ...\")",
  "mood-word": "Mood word standing in for a fact",
  "self-aware-aside": "Self-aware aside",
  "dot-chain": "Chain of middle dots (two or more, outside metadata and source lines)",
  italic: "Italic outside a page hero headline",
} as const;
export type PatternId = keyof typeof PATTERNS;

/** Blanks comments but keeps every newline, so line numbers stay true. */
export const stripComments = (source: string): string =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`\w\\])\/\/[^\n]*/g, (m, lead: string) => lead + " ".repeat(m.length - lead.length));

const words = (sentence: string) => sentence.match(/[A-Za-z0-9’'-]+/g) ?? [];
const lastToken = (s: string) => s.split(/\s+/).pop() ?? "";

/** Labels, not prose: a project status (src/content/statuses.ts), an evidence marker, or the Anima status opener. */
const STATUS_LABELS = new Set(
  [...Object.values(STATUSES).map((s) => s.word), "Built", "Validation", "Design", "Synthetic PoC"].map((w) => w.toLowerCase()),
);
const isStatusLabel = (sentence: string) => STATUS_LABELS.has(sentence.replace(/\.$/, "").trim().toLowerCase());

/** A short control label: a UI verb, plus at most one word ("Show details."). */
const CONTROL_LABEL = /^(?:Show|Hide|Open|Close|Expand|Collapse|Copy|Download|Skip|Replay|Reset|Search|Filter|Sort|Back|Next|Previous|Submit|Cancel|Save|Share|Print|Retry|Try|Learn|See|View|Read|Listen|Play|Pause)(?:\s+[A-Za-z]+)?\.$/;

/** A metadata line carries a date stamp ("Public. Read-only. No key. Last updated 2026-10-29."). */
const METADATA_LINE = /\b(?:Last updated|Updated on)\b/i;

const ABBREVIATION = /^(?:e\.g|i\.e|vs|etc|no|dr|mr|mrs|st|approx|fig|cf|inc|ltd|[a-z])\.?$/i;

/** Sentences of a line, with code and quote debris trimmed from the ends. */
const sentencesOf = (line: string): string[] =>
  line
    .split(/(?<=[.!?])\s+(?=[A-Z"'`“(<{])/)
    // Only the first sentence of a line can start behind code, up to its opening quote or tag end.
    .map((s, i) => (i === 0 ? s.replace(/^[^"`>]*["`>]\s*/, "") : s).replace(/["'`<}\]),;]+$/, "").trim())
    .filter(Boolean);

function proseHits(line: string): Array<{ pattern: PatternId; text: string }> {
  const out: Array<{ pattern: PatternId; text: string }> = [];
  const sentences = sentencesOf(line);

  if (sentences.length >= 2 && !METADATA_LINE.test(line)) {
    for (const s of sentences) {
      const w = words(s);
      if (s.endsWith(".") && w.length >= 1 && w.length <= 2 && /^[A-Z]/.test(s) && !ABBREVIATION.test(lastToken(s)) && !isStatusLabel(s) && !CONTROL_LABEL.test(s)) {
        out.push({ pattern: "theatrical-fragment", text: s });
      }
    }
    let run: string[] = [];
    const flush = () => { if (run.length >= 3) out.push({ pattern: "rhythm-triad", text: run.join(" ") }); run = []; };
    for (const s of sentences) {
      const w = words(s);
      if (s.endsWith(".") && w.length >= 1 && w.length <= 4 && /^[A-Z]/.test(s) && !ABBREVIATION.test(lastToken(s))) run.push(s);
      else flush();
    }
    flush();
  }

  for (const m of line.matchAll(/\bnot\s+(?:just\s+|only\s+|merely\s+)?[^.;:!?"`]{1,50}?,?\s+but\b/gi)) out.push({ pattern: "contrast-reflex", text: m[0] });
  for (const m of line.matchAll(/[A-Za-z’'-]+,\s+not\s+[A-Za-z’'-]+(?:\s+[A-Za-z’'-]+){0,3}/g)) out.push({ pattern: "contrast-reflex", text: m[0] });
  for (const m of line.matchAll(/\b(?:What|Why|How) (?:I|we|it|he|she|Rose|Ivan|this|that)\b[^.:;!?"`]{0,30}:\s+\S/g)) out.push({ pattern: "colon-reveal", text: m[0] });
  for (const m of line.matchAll(/\b(?:quiet|quietly|honest|honestly|on purpose|everyone skips)\b/gi)) out.push({ pattern: "mood-word", text: m[0] });
  for (const m of line.matchAll(/\bI(?:'d| would) rather\b|\brather than (?:calling|saying|claiming|promising)\b/gi)) out.push({ pattern: "self-aware-aside", text: m[0] });
  if (/—/.test(line)) out.push({ pattern: "em-dash", text: line.trim().slice(Math.max(0, line.indexOf("—") - 30), line.indexOf("—") + 30) });
  const dots = (line.match(/·|&middot;/g) ?? []).length;
  // Metadata and source lines may chain dots: a year, a reading time, a source, a licence, a status,
  // an address or a path marks one.
  const metadata = /\b(?:19|20)\d\d\b|min read|Source|Status|Licen[cs]e|https?:|@|(?:^|[\s("'`])\/[a-z]/i;
  if (dots >= 2 && !metadata.test(line)) out.push({ pattern: "dot-chain", text: line.trim() });
  return out;
}

const ITALIC_CLASS = /(?<![-\w])italic\b/;

/** Lines inside <h1> ... </h1>: the page hero headline, the one place italic is allowed. */
function h1Lines(lines: string[]): Set<number> {
  const inside = new Set<number>();
  let open = false;
  lines.forEach((line, i) => {
    if (/<h1[\s>]/.test(line)) open = true;
    if (open) inside.add(i);
    if (/<\/h1>/.test(line)) open = false;
  });
  return inside;
}

function italicHits(line: string, index: number, heroLines: Set<number>, markdown: boolean): Array<{ pattern: PatternId; text: string }> {
  if (markdown) {
    const bare = line.replace(/`[^`]*`/g, "");
    const m = bare.match(/(?<![\w*])\*(?![\s*])[^*\n]+?(?<!\s)\*(?![\w*])|(?<![\w_])_(?![\s_])[^_\n]+?(?<!\s)_(?![\w_])/);
    return m ? [{ pattern: "italic", text: m[0] }] : [];
  }
  const hit = ITALIC_CLASS.test(line) || /<(?:em|i)[\s>]/.test(line);
  if (!hit || heroLines.has(index) || /hero|h1/i.test(line.match(/(?:const|let)\s+(\w+)/)?.[1] ?? "")) return [];
  return [{ pattern: "italic", text: line.trim() }];
}

export function scanSource(file: string, rawSource: string): Hit[] {
  // Windows checkouts have CRLF endings; a stray "\r" hides any hit at the end of a line.
  const source = rawSource.replace(/\r\n/g, "\n");
  const markdown = file.endsWith(".md");
  let text = markdown ? source.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, " ")) : stripComments(source);
  if (markdown) text = text.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "));
  const lines = text.split("\n");
  const heroLines = markdown ? new Set<number>() : h1Lines(lines);
  const hits: Hit[] = [];
  lines.forEach((line, i) => {
    const found = [...proseHits(line), ...italicHits(line, i, heroLines, markdown)];
    for (const { pattern, text: t } of found) hits.push({ file, line: i + 1, pattern, text: t.replace(/\s+/g, " ").slice(0, 140) });
  });
  return hits;
}

const walk = (dir: string, accept: (path: string) => boolean, skip: (path: string) => boolean): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (skip(path)) return [];
    return statSync(path).isDirectory() ? walk(path, accept, skip) : accept(path) ? [path] : [];
  });

const posix = (p: string) => p.split("\\").join("/");

export function scanSite(root = process.cwd()): Hit[] {
  const skip = (p: string) => /node_modules/.test(p) || /components[\\/](?:ui|ai-elements)$/.test(p);
  const sources = [
    ...walk(join(root, "src/content"), (p) => /\.tsx?$/.test(p) && !/\.generated\./.test(p), skip),
    ...walk(join(root, "src/pages"), (p) => /\.tsx$/.test(p), skip),
    ...walk(join(root, "src/components"), (p) => /\.tsx$/.test(p), skip),
    ...readdirSync(join(root, "public")).filter((n) => n.endsWith(".md")).map((n) => join(root, "public", n)),
  ];
  return sources
    .map((p) => posix(relative(root, p)))
    .sort()
    .flatMap((file) => scanSource(file, readFileSync(join(root, file), "utf8")));
}

export function applyAllowlist(hits: Hit[], allow: AllowEntry[]): { remaining: Hit[]; unused: AllowEntry[] } {
  const used = new Set<AllowEntry>();
  const remaining = hits.filter((h) => {
    const entry = allow.find((a) => a.file === h.file && a.pattern === h.pattern && a.text && h.text.includes(a.text));
    if (entry) used.add(entry);
    return !entry;
  });
  return { remaining, unused: allow.filter((a) => !used.has(a)) };
}

const countBy = <K extends string>(hits: Hit[], key: (h: Hit) => K): Array<[K, number]> => {
  const counts = new Map<K, number>();
  for (const h of hits) counts.set(key(h), (counts.get(key(h)) ?? 0) + 1);
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
};

export function report(hits: Hit[]): string {
  const lines = [`${hits.length} style hit(s) (docs/style.md §5)`, "", "Per pattern:"];
  for (const [id, n] of countBy(hits, (h) => h.pattern)) lines.push(`  ${String(n).padStart(4)}  ${id}: ${PATTERNS[id]}`);
  lines.push("", "Per file:");
  for (const [file, n] of countBy(hits, (h) => h.file)) lines.push(`  ${String(n).padStart(4)}  ${file}`);
  lines.push("", "Every hit:");
  for (const h of hits) lines.push(`  ${h.file}:${h.line}  [${h.pattern}]  ${h.text}`);
  return lines.join("\n");
}

export const loadAllowlist = (root = process.cwd()): AllowEntry[] =>
  JSON.parse(readFileSync(join(root, "docs/style-allowlist.json"), "utf8"));

// Ratchet: docs/style-baseline.json records the hits per file and per pattern. A count may only go down.
export type Baseline = Record<string, Partial<Record<PatternId, number>>>;
export type Change = { file: string; pattern: PatternId; was: number; now: number };

export const countHits = (hits: Hit[]): Baseline => {
  const out: Baseline = {};
  for (const h of hits) {
    const row = (out[h.file] ??= {});
    row[h.pattern] = (row[h.pattern] ?? 0) + 1;
  }
  return out;
};

export const totalOf = (baseline: Baseline): number =>
  Object.values(baseline).reduce((sum, row) => sum + Object.values(row).reduce((a, n) => a + (n ?? 0), 0), 0);

/** `raised` includes a new file or a new pattern in a file (was 0); `lowered` includes a count that reached 0. */
export function compareToBaseline(current: Baseline, baseline: Baseline): { raised: Change[]; lowered: Change[] } {
  const raised: Change[] = [];
  const lowered: Change[] = [];
  const files = new Set([...Object.keys(current), ...Object.keys(baseline)]);
  for (const file of [...files].sort()) {
    for (const pattern of Object.keys(PATTERNS) as PatternId[]) {
      const was = baseline[file]?.[pattern] ?? 0;
      const now = current[file]?.[pattern] ?? 0;
      if (now > was) raised.push({ file, pattern, was, now });
      else if (now < was) lowered.push({ file, pattern, was, now });
    }
  }
  return { raised, lowered };
}

export const describeChanges = (changes: Change[]): string =>
  changes.map((c) => `  ${c.file}  [${c.pattern}]  ${c.was} -> ${c.now}`).join("\n");

export const loadBaseline = (root = process.cwd()): Baseline =>
  JSON.parse(readFileSync(join(root, "docs/style-baseline.json"), "utf8"));

/** Sorted, so a diff of the baseline shows only the counts that moved. */
export const formatBaseline = (baseline: Baseline): string => {
  const sorted: Baseline = {};
  for (const file of Object.keys(baseline).sort()) {
    sorted[file] = {};
    for (const pattern of Object.keys(PATTERNS).sort() as PatternId[]) if (baseline[file][pattern]) sorted[file][pattern] = baseline[file][pattern];
  }
  return JSON.stringify(sorted, null, 2) + "\n";
};

if (process.argv[1] && /style-check\.ts$/.test(process.argv[1])) {
  const { remaining } = applyAllowlist(scanSite(), loadAllowlist());
  const current = countHits(remaining);
  const baseline = loadBaseline();
  const { raised, lowered } = compareToBaseline(current, baseline);
  if (process.argv.includes("--lower")) {
    // Writes the new counts only when none went up. It cannot raise a baseline.
    if (raised.length) {
      console.log(`Refusing to write: ${raised.length} count(s) went up. Fix the copy.\n${describeChanges(raised)}`);
      process.exit(1);
    }
    writeFileSync(join(process.cwd(), "docs/style-baseline.json"), formatBaseline(current));
    console.log(`Baseline lowered: ${totalOf(baseline)} -> ${totalOf(current)} hit(s).`);
    process.exit(0);
  }
  console.log(report(remaining));
  console.log(`\nBaseline ${totalOf(baseline)}, now ${remaining.length}.`);
  if (raised.length) console.log(`\nAbove the baseline:\n${describeChanges(raised)}`);
  if (lowered.length) console.log(`\nBelow the baseline (run with --lower and commit):\n${describeChanges(lowered)}`);
  process.exit(raised.length || lowered.length ? 1 : 0);
}
