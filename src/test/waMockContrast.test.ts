import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// The WhatsApp mock (AetherixHomepageLoop, .wa-* in index.css) paints its own surfaces, so each text in it is measured
// against the exact surface behind it, from the tokens, in Day and Dusk. Every pair needs 4.5:1 (board N, 19 Nov 2026).
const css = readFileSync("src/index.css", "utf8");
const duskAt = css.indexOf('[data-mood="dusk"] {');
const page = { day: css.slice(0, duskAt), dusk: css.slice(duskAt) };

type Hsl = [number, number, number];
const parse = (src: string, name: string): Hsl => {
  const m = src.match(new RegExp(`--${name}:\\s*(\\d+(?:\\.\\d+)?)\\s+(\\d+(?:\\.\\d+)?)%\\s+(\\d+(?:\\.\\d+)?)%`));
  if (!m) throw new Error(`--${name} not found`);
  return [Number(m[1]), Number(m[2]) / 100, Number(m[3]) / 100];
};
// The token line of a rule: the line that starts with the selector and an opening brace.
const rule = (selector: string) => {
  const line = css.split("\n").find((l) => l.startsWith(`${selector} {`));
  if (!line) throw new Error(`${selector} not found`);
  return line;
};
const waTokens = { day: rule(".wa"), dusk: rule('[data-mood="dusk"] .wa') };

const rgb = ([h, s, l]: Hsl): [number, number, number] => {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return [f(0), f(8), f(4)];
};
const lum = ([r, g, b]: number[]) => {
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const mix = (fg: Hsl, bg: Hsl, alpha: number) => rgb(fg).map((c, i) => c * alpha + rgb(bg)[i] * (1 - alpha));
const ratio = (a: number[], b: number[]) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

// [label, text token, surface token, opacity of the text over its surface]
export const PAIRS: [string, string, string, number?][] = [
  ["bubble text", "wa-fg", "wa-in"],
  ["reply bubble text", "wa-fg", "wa-out"],
  ["sender name", "wa-name", "wa-in"],
  ["date chip", "wa-muted", "wa-in"],
  ["bubble time (in)", "wa-muted", "wa-in"],
  ["reply label / time", "wa-muted", "wa-out"],
  ["read tick", "wa-tick", "wa-out"],
  ["bubble note (in)", "wa-note", "wa-in"],
  ["bubble note (reply)", "wa-note", "wa-out"],
  ["input placeholder", "wa-muted", "wa-field"],
  ["header name", "wa-head-fg", "wa-head"],
  ["header status", "wa-head-fg", "wa-head", 0.8],
  ["outlier guard link", "wa-stop", "wa-in"],
];
export const measure = (mood: "day" | "dusk") =>
  PAIRS.map(([label, fg, bg, alpha = 1]) => {
    const tok = (n: string) => parse(waTokens[mood], n);
    return { label, mood, ratio: ratio(mix(tok(fg), tok(bg), alpha), rgb(tok(bg))) };
  });

describe("WhatsApp mock: every text reaches 4.5:1 against its own surface", () => {
  for (const mood of ["day", "dusk"] as const) {
    for (const r of measure(mood)) it(`${mood}: ${r.label}`, () => expect(r.ratio).toBeGreaterThanOrEqual(4.5));
  }
  it("the lamp word and the 'Why' table use the page ink, which also holds on both bubbles", () => {
    for (const mood of ["day", "dusk"] as const) {
      const ink = rgb(parse(page[mood], "on-surface"));
      for (const bg of ["wa-in", "wa-out"]) expect(ratio(ink, rgb(parse(waTokens[mood], bg)))).toBeGreaterThanOrEqual(4.5);
    }
  });
});
