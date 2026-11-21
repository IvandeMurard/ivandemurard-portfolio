import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// The Listen audiogram sits on --surface-container, in Day and in Dusk. Text needs 4.5:1, the waveform bars (not text) 3:1.
const css = readFileSync("src/index.css", "utf8");
const duskAt = css.indexOf('[data-mood="dusk"] {');
const blocks = { Day: css.slice(0, duskAt), Dusk: css.slice(duskAt) };

type Rgb = [number, number, number];
const token = (block: string, name: string): Rgb => {
  const m = block.match(new RegExp(`--${name}:\\s*(\\d+(?:\\.\\d+)?)\\s+(\\d+(?:\\.\\d+)?)%\\s+(\\d+(?:\\.\\d+)?)%`));
  if (!m) throw new Error(`--${name} not found`);
  const h = Number(m[1]), s = Number(m[2]) / 100, l = Number(m[3]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return [f(0), f(8), f(4)];
};
/** `top` at `alpha` over `under`, as the browser paints bg-x/NN. */
const over = (top: Rgb, alpha: number, under: Rgb): Rgb => top.map((c, i) => c * alpha + under[i] * (1 - alpha)) as Rgb;
const lum = ([r, g, b]: Rgb) => {
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a: Rgb, b: Rgb) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

for (const [mood, block] of Object.entries(blocks)) {
  describe(`Listen audiogram contrast, ${mood}`, () => {
    const card = token(block, "surface-container");
    const ink = token(block, "on-surface");
    const faded = token(block, "on-surface-variant");
    const secondary = token(block, "secondary");
    const onSecondary = token(block, "on-secondary");

    it("spoken and upcoming words read at 4.5:1 or more on the card", () => {
      expect(ratio(ink, card)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(faded, card)).toBeGreaterThanOrEqual(4.5);
    });
    it("the word being read stays at 4.5:1 on its highlight", () => {
      expect(ratio(ink, over(secondary, 0.15, card))).toBeGreaterThanOrEqual(4.5);
    });
    it("the labels and the clock (on-surface-variant) read at 4.5:1", () => {
      expect(ratio(faded, card)).toBeGreaterThanOrEqual(4.5);
    });
    it("the active Read / Listen choice and the play button read at 4.5:1", () => {
      expect(ratio(onSecondary, secondary)).toBeGreaterThanOrEqual(4.5);
    });
    it("the waveform: played and unplayed bars show at 3:1 against the card", () => {
      expect(ratio(secondary, card)).toBeGreaterThanOrEqual(3);
      expect(ratio(over(faded, 0.55, card), card)).toBeGreaterThanOrEqual(3);
    });
    it("the played and unplayed bars differ from each other", () => {
      expect(ratio(secondary, over(faded, 0.55, card))).toBeGreaterThan(1.2);
    });
  });
}
