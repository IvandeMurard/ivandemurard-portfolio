import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// A case-study page goes from the site surface to its tint (.case-bg). Text that sits on the end colour, the darkest
// point of the page in Day and the lightest in Dusk, needs 4.5:1. One tint per project (board N, 19 Nov 2026).
const css = readFileSync("src/index.css", "utf8");
const duskAt = css.indexOf('[data-mood="dusk"] {');
const blocks = { day: css.slice(0, duskAt), night: css.slice(duskAt) };

type Hsl = [number, number, number];
const hsl = (block: string, name: string): Hsl => {
  const m = block.match(new RegExp(`--${name}:\\s*(?:(\\d+(?:\\.\\d+)?)\\s+(\\d+(?:\\.\\d+)?)%\\s+(\\d+(?:\\.\\d+)?)%|var\\(--([\\w-]+)\\))`));
  if (!m) throw new Error(`--${name} not found`);
  if (m[4]) return hsl(block, m[4]); // an alias, as --aetherix-warm is for --case-tint-aetherix
  return [Number(m[1]), Number(m[2]) / 100, Number(m[3]) / 100];
};
const luminance = ([h, s, l]: Hsl) => {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(f(0)) + 0.7152 * lin(f(8)) + 0.0722 * lin(f(4));
};
const ratio = (a: Hsl, b: Hsl) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const TINTS = ["aetherix", "tacet", "anima", "rose", "lore", "compass", "sonor"];

describe("--aetherix-warm", () => {
  it("is an alias of --case-tint-aetherix, declared once on :root: both moods follow the tint", () => {
    // The mood attribute sits on <html>, the same element as :root, so the alias resolves to the Night value there.
    expect(hsl(blocks.day, "aetherix-warm")).toEqual(hsl(blocks.day, "case-tint-aetherix"));
    expect(blocks.day).toContain("--aetherix-warm: var(--case-tint-aetherix);");
    expect(blocks.night).not.toMatch(/--aetherix-warm:/);
  });
});

describe("case-study tints: text on the end colour, at least 4.5:1", () => {
  for (const tint of TINTS) {
    for (const mood of ["day", "night"] as const) {
      for (const token of ["on-surface", "on-surface-variant", "primary", "secondary"]) {
        it(`${tint}, ${mood}: ${token}`, () => {
          const block = blocks[mood];
          const fg = (() => { try { return hsl(block, token); } catch { return hsl(blocks.day, token); } })();
          expect(ratio(fg, hsl(block, `case-tint-${tint}`))).toBeGreaterThanOrEqual(4.5);
        });
      }
    }
  }
});

describe(".case-bg", () => {
  it("is one class: the per-page classes are gone, and each project names its tint once", () => {
    expect(css).not.toContain(".rose-case-bg");
    expect(css).not.toContain(".aetherix-case-bg");
    for (const tint of TINTS) expect(css).toContain(`.case-bg[data-case="${tint}"] { --case-tint: var(--case-tint-${tint}); }`);
    expect(css).toContain("linear-gradient(180deg, hsl(var(--surface)) 0%, hsl(var(--surface)) 10%, hsl(var(--case-tint)) 100%)");
  });
});

// Links and small text at the bottom of a case page sit on the end colour. Their text colours are the four tokens above
// (links inherit the colour of the line they are in or use --primary; small labels use --on-surface-variant or --secondary).
// What the tokens alone do not say is the underline of a link that has no colour of its own: it is
// --on-surface-variant at the alpha written in RoseCaseStudy.tsx (QUIET_LINK), and it is the only thing that sets such a link apart.
const blend = (fg: Hsl, bg: Hsl, alpha: number): Hsl => {
  const rgb = ([h, s, l]: Hsl) => { const a = s * Math.min(l, 1 - l); const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return [f(0), f(8), f(4)]; };
  const [r, g, b] = rgb(fg).map((v, i) => v * alpha + rgb(bg)[i] * (1 - alpha));
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
};

describe("links and small text on the end colour of each case page", () => {
  const quiet = readFileSync("src/components/rose/RoseCaseStudy.tsx", "utf8").match(/const QUIET_LINK = "[^"]*decoration-on-surface-variant\/(\d+)/);
  it("the quiet link's underline alpha is written in the source", () => {
    expect(quiet, "QUIET_LINK with decoration-on-surface-variant/NN").not.toBeNull();
  });
  for (const tint of TINTS) {
    for (const mood of ["day", "night"] as const) {
      const block = blocks[mood];
      const fgOf = (token: string) => { try { return hsl(block, token); } catch { return hsl(blocks.day, token); } };
      for (const token of ["on-surface", "on-surface-variant", "primary", "secondary"]) {
        it(`${tint}, ${mood}: link and small text in --${token}`, () => {
          expect(ratio(fgOf(token), hsl(block, `case-tint-${tint}`))).toBeGreaterThanOrEqual(4.5);
        });
      }
      it(`${tint}, ${mood}: the quiet link's underline`, () => {
        const alpha = Number(quiet![1]) / 100;
        const bg = hsl(block, `case-tint-${tint}`);
        expect(ratio(blend(fgOf("on-surface-variant"), bg, alpha), bg)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
