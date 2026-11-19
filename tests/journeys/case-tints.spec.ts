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
