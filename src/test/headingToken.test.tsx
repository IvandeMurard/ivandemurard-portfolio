import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

// Homepage v2, part C (18 Nov 2026): headings read --heading (navy by day, warm cream at dusk). Links, buttons and every
// interactive element keep --primary, so blue still marks what is clickable at dusk.

const css = readFileSync("src/index.css", "utf8").replace(/\r\n/g, "\n");
const tailwind = readFileSync("tailwind.config.ts", "utf8");

const hsl = (h: number, s: number, l: number): [number, number, number] => {
  const S = s / 100, L = l / 100, k = (n: number) => (n + h / 30) % 12, a = S * Math.min(L, 1 - L);
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
};
const lum = ([r, g, b]: number[]) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: number[], b: number[]) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

/** The first value of a custom property inside the block that starts at `selector`. */
const token = (selector: string, name: string): number[] => {
  const start = css.indexOf(selector);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  const m = new RegExp(`${name}: (\\d+) (\\d+)% (\\d+)%`).exec(css.slice(start, start + 9000));
  expect(m, `${name} after ${selector}`).toBeTruthy();
  return [Number(m![1]), Number(m![2]), Number(m![3])];
};

describe("The --heading token", () => {
  it("is the navy of --primary by day and a warm cream at dusk", () => {
    expect(token(":root {", "--heading")).toEqual(token(":root {", "--primary"));
    expect(token('[data-mood="dusk"] {', "--heading")).toEqual([39, 39, 93]); // #f4efe6
    expect(tailwind).toContain('heading: "hsl(var(--heading))"');
  });

  it("reads 14.8:1 or better on the dusk surface, and passes AA on every ground of the homepage, day and dusk", () => {
    const dusk = (name: string) => hsl(...(token('[data-mood="dusk"] {', name) as [number, number, number]));
    const day = (name: string) => hsl(...(token(":root {", name) as [number, number, number]));
    const heading = dusk("--heading");
    expect(ratio(heading, dusk("--surface"))).toBeGreaterThanOrEqual(14.7);
    for (const g of ["--surface", "--surface-stone", "--surface-peach"]) expect(ratio(heading, dusk(g)), `dusk ${g}`).toBeGreaterThanOrEqual(4.5);
    for (const g of ["--surface", "--surface-stone", "--surface-peach"]) expect(ratio(day("--heading"), day(g)), `day ${g}`).toBeGreaterThanOrEqual(4.5);
  });

  it("is re-scoped in the dark rooms that re-scope --primary, so a heading there stays light", () => {
    const inverse = css.slice(css.indexOf(".section-inverse {"));
    expect(inverse.slice(0, 600)).toMatch(/--primary: 42 41% 97%;\s*--heading: 42 41% 97%;/);
    const aetherix = css.slice(css.indexOf(".aetherix-dark {"));
    expect(aetherix.slice(0, 600)).toMatch(/--primary: 50 33% 97%;\s*--heading: 50 33% 97%;/);
  });
});

// Every h1, h2 and h3 in the source reads text-heading. A link or a button never does.
const files: string[] = [];
const walk = (d: string) => {
  for (const n of readdirSync(d)) {
    const p = join(d, n);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx$/.test(n) && !/\.test\.|\.generated\./.test(n)) files.push(p);
  }
};
walk("src");

const classTokens = (attr: ts.JsxAttribute): string[] => {
  const out: string[] = [];
  const visit = (n: ts.Node) => { if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) out.push(...n.text.split(/\s+/)); ts.forEachChild(n, visit); };
  if (attr.initializer) visit(attr.initializer);
  return out;
};

describe("Headings and links in the source", () => {
  const found: { heading: string[]; interactive: string[] } = { heading: [], interactive: [] };
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    if (!/text-(primary|heading)/.test(text)) continue;
    const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = (n: ts.Node) => {
      if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
        const tag = n.tagName.getText();
        const cls = n.attributes.properties.find((a): a is ts.JsxAttribute => ts.isJsxAttribute(a) && a.name.getText() === "className");
        if (cls) {
          const toks = classTokens(cls);
          const where = `${file}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1} <${tag}>`;
          if (/^h[123]$/.test(tag) && toks.some((t) => /^((sm|md|lg|xl|2xl):)*text-primary(\/[\d.]+)?$/.test(t))) found.heading.push(where);
          if (/^(a|button|Link|TransitionLink|NavLink)$/.test(tag) && toks.some((t) => /^text-heading/.test(t))) found.interactive.push(where);
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(sf);
  }

  it("no h1, h2 or h3 is still text-primary", () => expect(found.heading).toEqual([]));
  it("no link or button was moved to text-heading", () => expect(found.interactive).toEqual([]));
});

describe("The homepage headings and links", () => {
  const index = readFileSync("src/pages/Index.tsx", "utf8");
  it("headings and titles read text-heading, the links keep text-secondary or text-primary", () => {
    expect(index).toMatch(/<h1 className="[^"]*text-heading/);
    expect(index).toMatch(/<h2 className="[^"]*text-heading/);
    expect(index).toMatch(/<h3 className="[^"]*text-heading/);
    expect(index).not.toMatch(/<Link[^>]*text-heading/);
  });
});
