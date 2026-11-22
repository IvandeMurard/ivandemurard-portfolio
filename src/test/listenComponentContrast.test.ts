import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

// The Listen component (board R) on the player surface and on the page, Day and Dusk, calculated from the tokens in
// src/index.css. Text needs 4.5:1 (the site's floor), the waveform bars (not text) 3:1.
// Two values differ from the board on purpose and are pinned here: upcoming and ghost words at .30 measured 1.8:1 (Day)
// and 2.7:1 (Dusk), the unplayed bars at .20 measured 1.5:1 and 1.9:1.
const css = readFileSync("src/index.css", "utf8");
const duskAt = css.indexOf('[data-mood="dusk"] {');
const blocks = { Day: css.slice(0, duskAt), Dusk: css.slice(duskAt) };

type Rgb = [number, number, number];
type Rgba = [number, number, number, number];

const color = (block: string, name: string): Rgba => {
  const m = block.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!m) throw new Error(`--${name} not found`);
  const v = m[1].trim();
  const hex = v.match(/^#([0-9a-f]{6})\b/i);
  if (hex) return [parseInt(hex[1].slice(0, 2), 16), parseInt(hex[1].slice(2, 4), 16), parseInt(hex[1].slice(4, 6), 16), 1];
  const rgba = v.match(/^rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
  if (rgba) return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3]), rgba[4] === undefined ? 1 : Number(rgba[4])];
  const hsl = v.match(/^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (hsl) {
    const h = Number(hsl[1]), s = Number(hsl[2]) / 100, l = Number(hsl[3]) / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => { const k = (n + h / 30) % 12; return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))); };
    return [f(0), f(8), f(4), 1];
  }
  throw new Error(`--${name}: cannot read ${v}`);
};
/** `top` painted over an opaque `under`, as the browser does. */
const over = (top: Rgba, under: Rgb): Rgb => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3])) as Rgb;
const lum = ([r, g, b]: Rgb) => {
  const lin = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a: Rgb, b: Rgb) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

for (const [mood, block] of Object.entries(blocks)) {
  describe(`Listen component contrast, ${mood}`, () => {
    const t = (name: string) => color(block, `listen-${name}`);
    const page = [...color(block, "surface")].slice(0, 3) as Rgb;
    const surface = over(t("surface"), page);
    const row = over(t("row"), page);
    const ink = over(t("ink"), surface);

    it("the spoken words, the previous phrase and the words to come read at 4.5:1 on the player", () => {
      expect(ratio(ink, surface)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(over(t("upcoming"), surface), surface)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(over(t("ghost"), surface), surface)).toBeGreaterThanOrEqual(4.5);
    });
    it("the time, the captions and the capitals label read at 4.5:1 on the player", () => {
      expect(ratio(over(t("soft"), surface), surface)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(over(t("kicker"), surface), surface)).toBeGreaterThanOrEqual(4.5);
    });
    it("the row text, the length, the transcript label and the transcript read at 4.5:1 on the row", () => {
      expect(ratio(over(t("ink"), row), row)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(over(t("soft"), row), row)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(over(t("kicker"), row), row)).toBeGreaterThanOrEqual(4.5);
    });
    it("the play button reads at 4.5:1: the glyph in the player colour on the ink disc", () => {
      expect(ratio(surface, ink)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(ink, row)).toBeGreaterThanOrEqual(4.5);
    });
    it("the waveform: played and unplayed bars show at 3:1 against the player and against the row, and differ from each other", () => {
      for (const base of [surface, row]) {
        const played = over(t("played"), base), unplayed = over(t("unplayed"), base);
        expect(ratio(played, base)).toBeGreaterThanOrEqual(3);
        expect(ratio(unplayed, base)).toBeGreaterThanOrEqual(3);
        expect(ratio(played, unplayed)).toBeGreaterThan(1.2);
      }
    });
    it("the edge of the player and of the row is there but is not what carries meaning", () => {
      expect(t("line")[3]).toBeGreaterThan(0.2);
    });
  });
}
