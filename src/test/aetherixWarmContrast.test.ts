import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// The Aetherix page goes from the site surface to --aetherix-warm. Text that sits on the end colour needs 4.5:1, Day and Night.
const css = readFileSync("src/index.css", "utf8");
const duskAt = css.indexOf('[data-mood="dusk"] {');
const blocks = { day: css.slice(0, duskAt), night: css.slice(duskAt) };

const hsl = (block: string, name: string): [number, number, number] => {
  const m = block.match(new RegExp(`--${name}:\\s*(\\d+(?:\\.\\d+)?)\\s+(\\d+(?:\\.\\d+)?)%\\s+(\\d+(?:\\.\\d+)?)%`));
  if (!m) throw new Error(`--${name} not found`);
  return [Number(m[1]), Number(m[2]) / 100, Number(m[3]) / 100];
};
const luminance = ([h, s, l]: [number, number, number]) => {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(f(0)) + 0.7152 * lin(f(8)) + 0.0722 * lin(f(4));
};
const ratio = (a: [number, number, number], b: [number, number, number]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("--aetherix-warm", () => {
  for (const mood of ["day", "night"] as const) {
    for (const token of ["on-surface", "on-surface-variant", "primary", "secondary"]) {
      it(`${token} on the end colour, ${mood}: at least 4.5:1`, () => {
        const block = blocks[mood];
        const fg = (() => { try { return hsl(block, token); } catch { return hsl(blocks.day, token); } })();
        expect(ratio(fg, hsl(block, "aetherix-warm"))).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
