import { expect, expectNoHorizontalScroll, test } from "./helpers";

// Each case-study page sits on one gradient from the site surface to its project's tint (board N, 19 Nov 2026):
// the wrapper names its project, the gradient ends on that project's tint in Day and in Dusk, and nothing scrolls sideways.

const PAGES = ["aetherix", "tacet", "anima", "rose", "lore", "compass", "sonor"] as const;

for (const name of PAGES) {
  test(`/${name}: the page ends on its own tint, in Day and in Dusk, with no sideways scroll`, async ({ page }) => {
    await page.goto(`/${name}`);
    const wrap = page.locator(`.case-bg[data-case="${name}"]`);
    await expect(wrap).toHaveCount(1);
    for (const mood of ["day", "dusk"]) {
      await page.evaluate((m) => document.documentElement.setAttribute("data-mood", m), mood);
      const { gradient, tint, surface } = await wrap.evaluate((el) => {
        const colour = (token: string) => {
          const probe = document.createElement("div");
          probe.style.cssText = `position:absolute;width:1px;height:1px;background:hsl(var(${token}))`;
          el.appendChild(probe);
          const c = getComputedStyle(probe).backgroundColor;
          probe.remove();
          return c;
        };
        return { gradient: getComputedStyle(el).backgroundImage, tint: colour(`--case-tint-${el.getAttribute("data-case")}`), surface: colour("--surface") };
      });
      // The gradient: the surface to 10%, then the tint at 100%.
      expect(gradient, `${name}, ${mood}`).toContain(`${surface} 10%, ${tint})`);
      expect(tint, `${name}, ${mood}: the tint is not the surface`).not.toBe(surface);
    }
    await expectNoHorizontalScroll(page);
  });
}

// Every link on a case page, in Day and in Dusk: its text, and its underline when it has one, against what it sits on
// (the card it is in, else the page's end colour, which is the darkest point of the gradient in Day and the lightest in Dusk).
// Links on a dark band or over an image are not measured here.
for (const name of PAGES) {
  test(`/${name}: every link reaches 4.5:1, text and underline, in Day and in Dusk`, async ({ page }) => {
    await page.goto(`/${name}`);
    // Scroll through the page once so every revealed block is in its final state.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    });
    for (const mood of ["day", "dusk"]) {
      await page.evaluate((m) => document.documentElement.setAttribute("data-mood", m), mood);
      await page.waitForTimeout(700); // the colours transition between moods: measure them settled
      const measure = () => page.locator(".case-bg").evaluate((wrap) => {
        type Rgba = { r: number; g: number; b: number; a: number };
        const parse = (c: string): Rgba => { const m = (c.match(/[\d.]+/g) ?? []).map(Number); return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }; };
        const lin = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        const lum = (c: Rgba) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
        const over = (t: Rgba, b: Rgba): Rgba => ({ r: t.r * t.a + b.r * (1 - t.a), g: t.g * t.a + b.g * (1 - t.a), b: t.b * t.a + b.b * (1 - t.a), a: 1 });
        const ratio = (a: Rgba, b: Rgba) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
        const stops = getComputedStyle(wrap).backgroundImage.match(/rgb\([^)]*\)/g)!;
        const tint = parse(stops[stops.length - 1]);
        const found: string[] = [];
        for (const a of wrap.querySelectorAll("a[href]")) {
          if (!a.getBoundingClientRect().width) continue;
          let bg = tint, skip = false;
          for (let n: Element | null = a; n && n !== wrap; n = n.parentElement) {
            const s = getComputedStyle(n);
            if (/section-inverse|aetherix-dark/.test(String(n.className)) || s.backgroundImage !== "none") { skip = true; break; }
            const b = parse(s.backgroundColor);
            if (b.a > 0) { bg = over(b, tint); break; }
          }
          let op = 1;
          for (let n: Element | null = a; n; n = n.parentElement) op *= Number(getComputedStyle(n).opacity);
          if (skip || op < 0.05) continue; // on a dark band or an image, or hidden until hover (the heading anchor icon)
          const cs = getComputedStyle(a);
          const fg = parse(cs.color); fg.a *= op;
          const label = (a.textContent ?? "").trim().replace(/, opens in a new tab.*$/, "").slice(0, 40);
          const text = ratio(over(fg, bg), bg);
          if (text < 4.5) found.push(`text ${text.toFixed(2)}: ${label}`);
          if (cs.textDecorationLine.includes("underline")) {
            const d = parse(cs.textDecorationColor); d.a *= op;
            const u = ratio(over(d, bg), bg);
            if (u < 4.5) found.push(`underline ${u.toFixed(2)}: ${label}`);
          }
        }
        return found;
      });
      // Measured again for a few seconds if needed: on a loaded machine a colour can still be mid-transition.
      await expect.poll(measure, { message: `${name}, ${mood}`, timeout: 8000 }).toEqual([]);
    }
  });
}
