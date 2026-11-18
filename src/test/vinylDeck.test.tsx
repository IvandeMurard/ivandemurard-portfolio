import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { MoodProvider } from "@/components/MoodProvider";
import { AmbienceProvider } from "@/components/AmbienceProvider";
import { AmbienceControl } from "@/components/AmbienceControl";
import { VinylDeck, VinylRecord } from "@/components/VinylDeck";

// Board L, option 1 (18 Nov 2026): the record and the turntable read in dusk, without rims or outlines. A paper label
// replaces the album artwork everywhere; the plinth is walnut by day and brushed aluminium at dusk; the tonearm and the
// faders follow so they stay at 3:1 or more; the popover's text stays at 4.5:1.

const css = readFileSync("src/index.css", "utf8").replace(/\r\n/g, "\n");
const read = (p: string) => readFileSync(p, "utf8");

/** The two blocks of vinyl tokens: day (:root) and dusk, both after the comment that introduces the deck. */
const vinylStart = css.indexOf("/* Vinyl deck (board L, option 1)");
const dayBlock = css.slice(css.indexOf(":root {", vinylStart), css.indexOf('[data-mood="dusk"] {', vinylStart));
const duskBlock = css.slice(css.indexOf('[data-mood="dusk"] {', vinylStart), css.indexOf("@keyframes vinyl-spin"));
/** The site's own surface tokens: the popover is bg-surface-container. */
const siteDay = css.slice(css.indexOf(":root {"), css.indexOf('[data-mood="dusk"] {'));
const siteDusk = css.slice(css.indexOf('[data-mood="dusk"] {'), css.indexOf("@layer base {", css.indexOf('[data-mood="dusk"] {')));

type Rgb = [number, number, number];
const hsl = (h: number, s: number, l: number): Rgb => {
  const S = s / 100, L = l / 100, k = (n: number) => (n + h / 30) % 12, a = S * Math.min(L, 1 - L);
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
};
const tok = (block: string, name: string): Rgb => {
  const m = new RegExp(`${name}: ([\\d.]+) ([\\d.]+)% ([\\d.]+)%`).exec(block);
  expect(m, name).toBeTruthy();
  return hsl(Number(m![1]), Number(m![2]), Number(m![3]));
};
const raw = (block: string, name: string): string => new RegExp(`${name}: ([^;]+);`).exec(block)![1].trim();
const lum = ([r, g, b]: Rgb) => { const f = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: Rgb, b: Rgb) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const hex = ([r, g, b]: Rgb) => "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
/** A colour within a few units per channel of a hex value (the tokens are HSL with one decimal). */
const near = (c: Rgb, h: string, tol = 3) => [1, 3, 5].every((i, j) => Math.abs(c[j] - parseInt(h.slice(i, i + 2), 16)) <= tol);

const MOODS = [["day", dayBlock, siteDay], ["dusk", duskBlock, siteDusk]] as const;

describe("The colours of the record and the deck", () => {
  it("the paper label is warm cream (about #efe2c8) with a warm dark ink (about #3a3128), in both moods", () => {
    expect(near(tok(dayBlock, "--paper-label"), "#efe2c8")).toBe(true);
    expect(near(tok(dayBlock, "--label-ink"), "#3a3128")).toBe(true);
    expect(duskBlock).not.toContain("--paper-label"); // one paper in both moods
  });

  it("the ink on the label reads at 4.5:1, and the label stands out of the black record at 3:1", () => {
    const paper = tok(dayBlock, "--paper-label");
    expect(ratio(tok(dayBlock, "--label-ink"), paper)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(paper, tok(dayBlock, "--vinyl"))).toBeGreaterThanOrEqual(3);
  });

  it.each(MOODS)("%s: the plinth stands out of the popover it sits in at 4.5:1 (both ends of its gradient)", (mood, block, site) => {
    const ground = tok(site, "--surface-container");
    for (const end of ["--plinth-from", "--plinth-to"]) {
      const r = ratio(tok(block, end), ground);
      expect(r, `${mood} ${end} ${hex(tok(block, end))} on ${hex(ground)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("the plinth is walnut by day (about #6b4a32 to #4a3222) and brushed aluminium at dusk (about #8f8c86 to #9a9790)", () => {
    expect(near(tok(dayBlock, "--plinth-from"), "#6b4a32")).toBe(true);
    expect(near(tok(dayBlock, "--plinth-to"), "#4a3222")).toBe(true);
    expect(near(tok(duskBlock, "--plinth-from"), "#8f8c86", 4)).toBe(true);
    expect(near(tok(duskBlock, "--plinth-to"), "#9a9790", 4)).toBe(true);
    // Fine vertical brushing at dusk only.
    expect(raw(dayBlock, "--brush-a")).toBe("0");
    expect(Number(raw(duskBlock, "--brush-a"))).toBeGreaterThan(0);
    expect(read("src/components/VinylDeck.tsx")).toMatch(/repeating-linear-gradient\(90deg/);
  });

  it.each(MOODS)("%s: the tonearm stays at 3:1 or more on the plinth, at both ends of the plinth's gradient", (mood, block) => {
    for (const arm of ["--arm-edge", "--arm-mid"]) {
      for (const end of ["--plinth-from", "--plinth-to"]) {
        const r = ratio(tok(block, arm), tok(block, end));
        expect(r, `${mood} ${arm} on ${end}`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it.each(MOODS)("%s: the fader caps stay at 3:1 or more on the popover, at both ends of their gradient", (mood, block, site) => {
    const ground = tok(site, "--surface-container");
    for (const cap of ["--fader-light", "--fader-dark"]) {
      expect(ratio(tok(block, cap), ground), `${mood} ${cap}`).toBeGreaterThanOrEqual(3);
    }
    // The mark on the cap stands out of the cap.
    expect(ratio(tok(block, "--fader-mark"), tok(block, "--fader-dark"))).toBeGreaterThanOrEqual(3);
    expect(ratio(tok(block, "--fader-mark"), tok(block, "--fader-light"))).toBeGreaterThanOrEqual(1.5);
  });

  it.each(MOODS)("%s: the popover's text reads at 4.5:1 (on-surface, on-surface-variant, and the gold of the zero mark)", (mood, _block, site) => {
    const ground = tok(site, "--surface-container");
    for (const t of ["--on-surface", "--on-surface-variant", "--secondary"]) {
      expect(ratio(tok(site, t), ground), `${mood} ${t}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("the sheen: day unchanged; at dusk two reflections of warm lamplight (about #f6d7a4) at .42 and .30", () => {
    expect(raw(dayBlock, "--vinyl-sheen")).toBe("40 30% 92%");
    expect(raw(dayBlock, "--sheen-a")).toBe("0.16");
    expect(raw(dayBlock, "--sheen-b")).toBe("0.12");
    expect(raw(dayBlock, "--vinyl-groove")).toBe("220 6% 14%");
    expect(near(tok(duskBlock, "--vinyl-sheen"), "#f6d7a4")).toBe(true);
    expect(raw(duskBlock, "--sheen-a")).toBe("0.42");
    expect(raw(duskBlock, "--sheen-b")).toBe("0.3");
    // The grooves are slightly lighter at dusk (about #2c2f35).
    expect(near(tok(duskBlock, "--vinyl-groove"), "#2c2f35")).toBe(true);
    expect(lum(tok(duskBlock, "--vinyl-groove"))).toBeGreaterThan(lum(tok(dayBlock, "--vinyl-groove")));
  });
});

describe("The record", () => {
  const wrapMood = (mood: "day" | "dusk", ui: React.ReactNode) => { window.localStorage.setItem("mood", mood); return <MoodProvider>{ui}</MoodProvider>; };
  beforeEach(() => { window.localStorage.clear(); });
  afterEach(() => cleanup());

  it("the deck's record shows the sleeve image on its label, clipped to the label circle, with no text on it", () => {
    const { container } = render(<VinylRecord size={146} playing={false} sleeve />);
    const img = container.querySelector("image")!;
    expect(img).not.toBeNull();
    expect(img.getAttribute("href")).toContain("atcq-low-end-theory.png");
    expect(img.getAttribute("clip-path")).toMatch(/^url\(#l-/);
    const clip = container.querySelector("clipPath circle")!;
    // About 60 px across on the 146 px disc: a radius of 20.5 of 100, i.e. 59.9 px.
    expect(Math.round(Number(clip.getAttribute("r")) * 2 * 1.46)).toBeGreaterThanOrEqual(58);
    expect(Math.round(Number(clip.getAttribute("r")) * 2 * 1.46)).toBeLessThanOrEqual(62);
    // Under the sleeve: the original red, not the cream paper.
    expect(container.innerHTML).toContain("hsl(var(--sleeve-red))");
    expect(near(tok(dayBlock, "--sleeve-red"), "#ae3129", 6)).toBe(true); // the original red, hsl(4 62% 42%)
    expect(duskBlock).not.toContain("--sleeve-red"); // one red in both moods
    expect(container.innerHTML).not.toContain("--paper-label");
    expect(container.querySelectorAll("text")).toHaveLength(0);
    expect(existsSync("src/assets/atcq-low-end-theory.png.asset.json")).toBe(true);
    const deck = render(<VinylDeck playing={false} pitch={1} />).container;
    expect(deck.querySelector("image")).not.toBeNull();
    expect(deck.querySelectorAll("text")).toHaveLength(0);
  });

  it("the header record (40 px and 36 px) is the plain paper label: no image, no text", () => {
    for (const size of [40, 36]) {
      const { container } = render(<VinylRecord size={size} playing={false} />);
      expect(container.querySelector("image")).toBeNull();
      expect(container.querySelector("[href], [src]")).toBeNull();
      expect(container.querySelectorAll("text")).toHaveLength(0);
      expect(container.innerHTML).toContain("--paper-label");
    }
  });

  it("has no rim and no outline: the only strokes are the grooves", () => {
    const { container } = render(<VinylRecord size={146} playing={false} />);
    const stroked = [...container.querySelectorAll("[stroke]")];
    expect(stroked.length).toBeGreaterThan(0);
    for (const s of stroked) expect(s.getAttribute("stroke")).toBe("hsl(var(--vinyl-groove))");
    const deck = render(<VinylDeck playing={false} pitch={1} />).container;
    expect(deck.innerHTML).not.toMatch(/conic-gradient/);
    expect(read("src/components/VinylDeck.tsx")).not.toMatch(/conic-gradient|stroke="hsl\(var\(--vinyl\)\)"|inset_0_1px_0/);
    // On the deck, the only stroked shapes are the grooves and the arm itself (a path): no ring around the pivot or the label.
    expect([...deck.querySelectorAll("[stroke]")].filter((s) => s.tagName !== "path" && s.getAttribute("stroke") !== "hsl(var(--vinyl-groove))")).toEqual([]);
  });

  it("is lit from the top left by day and from the top right at dusk", () => {
    const day = render(wrapMood("day", <VinylRecord size={40} playing={false} />));
    const g = day.container.querySelector("linearGradient")!;
    expect([g.getAttribute("x1"), g.getAttribute("y1"), g.getAttribute("x2")]).toEqual(["0", "0", "1"]);
    cleanup();
    const dusk = render(wrapMood("dusk", <VinylRecord size={40} playing={false} />));
    const d = dusk.container.querySelector("linearGradient")!;
    expect([d.getAttribute("x1"), d.getAttribute("y1"), d.getAttribute("x2")]).toEqual(["1", "0", "0"]);
  });

  it("the sheen takes its opacities from the tokens, so dusk gets the higher ones", () => {
    const { container } = render(<VinylRecord size={40} playing={false} />);
    const stops = [...container.querySelectorAll("linearGradient stop")].map((s) => (s as SVGElement).style.stopOpacity);
    expect(stops).toEqual(["0", "var(--sheen-a)", "0", "var(--sheen-b)", "0"]);
  });
});

describe("The header record and the popover", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true })));
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(() => Promise.resolve());
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  const mount = async (size?: "sm") => {
    const r = render(<MoodProvider><AmbienceProvider><AmbienceControl size={size} /></AmbienceProvider></MoodProvider>);
    await act(async () => { await Promise.resolve(); });
    return r;
  };

  it("the record is 40 px on a desktop and 36 px on a phone, in a hit area of at least 44 x 44 px", async () => {
    const desktop = await mount();
    const btn = screen.getByRole("switch");
    expect(btn.querySelector("svg")!.getAttribute("width")).toBe("40");
    expect(btn.className).toContain("h-11");
    expect(btn.className).toContain("w-11"); // 44 px
    desktop.unmount();
    await mount("sm");
    const phone = screen.getByRole("switch");
    expect(phone.querySelector("svg")!.getAttribute("width")).toBe("36");
    expect(phone.className).toContain("h-11");
    expect(phone.className).toContain("w-11");
  });

  it("the header button renders no image; the popover names the track and the sleeve as text, and the deck shows the sleeve", async () => {
    await mount();
    expect(screen.getByRole("switch").querySelector("image")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Open turntable controls" }));
    await act(async () => { await Promise.resolve(); });
    const body = document.body.textContent!;
    expect(body).toContain("Odetta · ATCQ Tribute");
    expect(body).toContain("Sleeve: The Low End Theory, 1991");
    const texts = [...document.querySelectorAll("p")].filter((p) => p.textContent === "Odetta · ATCQ Tribute");
    expect(texts).toHaveLength(1);
    expect(document.querySelectorAll("svg text")).toHaveLength(0);
    expect(document.querySelectorAll("svg image")).toHaveLength(1);
    // The popover is on the surface-container ground the contrasts above are measured on.
    expect(read("src/components/AmbienceControl.tsx")).toContain("bg-surface-container");
  });
});
