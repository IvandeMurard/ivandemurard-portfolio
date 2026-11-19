import { expect, test } from "./helpers";
import type { Page } from "@playwright/test";

// The host serves each page with its HTML already in #root, and the app renders over it. Pages load on demand, so the
// first route's chunk must be fetched before that first render: no frame between the prerendered HTML and the hydrated
// page may be blank or show a loading state. Network throttled (slow 4G), so the gap between the two is long enough to see.
// Chromium only (CDP throttling): both local (msedge) and CI run it.

const ROUTES = [
  { path: "/", chunk: null },
  { path: "/aetherix", chunk: /\/assets\/Atherix-[\w-]+\.js/ },
  { path: "/rose", chunk: /\/assets\/RoseDesignLab-[\w-]+\.js/ },
  { path: "/journal/harnesses-graders-closed-loops", chunk: /\/assets\/JournalEntry-[\w-]+\.js/ },
];

/** How many distinct colours a screenshot holds: a blank page has one or two, a page with text has hundreds. */
const distinctColours = async (page: Page, png: Buffer): Promise<number> => {
  const scratch = await page.context().newPage();
  try {
    await scratch.goto("about:blank");
    return await scratch.evaluate(async (b64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const seen = new Set<number>();
      for (let i = 0; i < d.length; i += 4 * 7) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
      return seen.size;
    }, png.toString("base64"));
  } finally {
    await scratch.close();
  }
};

for (const { path, chunk } of ROUTES) {
  test(`${path}: no blank frame between the prerendered HTML and the hydrated page`, async ({ page, browserName }, info) => {
    test.skip(browserName !== "chromium", "CDP network throttling");
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });

    // Every animation frame: once the prerendered heading has been on screen, a frame without a heading is a blank or a loading state.
    await page.addInitScript(() => {
      const w = window as unknown as { __gone: number; __seen: boolean; __first: Element | null };
      w.__gone = 0; w.__seen = false; w.__first = null;
      const tick = () => {
        const root = document.getElementById("root");
        if (root?.querySelector("h1")) { if (!w.__seen) w.__first = root.firstElementChild; w.__seen = true; }
        else if (w.__seen) w.__gone++;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    await page.goto(path, { waitUntil: "domcontentloaded" });
    // The prerendered HTML is on screen while the scripts are still arriving: look at it at 0, 100 and 300 ms.
    for (const ms of [0, 100, 300]) {
      if (ms) await page.waitForTimeout(ms === 100 ? 100 : 200);
      const shot = await page.screenshot({ type: "png" });
      await info.attach(`${path.replace(/\W+/g, "_")}-${ms}ms.png`, { body: shot, contentType: "image/png" });
      expect(await distinctColours(page, shot), `${path} at ${ms} ms looks blank`).toBeGreaterThan(50);
    }

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500);

    const state = await page.evaluate(() => {
      const w = window as unknown as { __gone: number; __seen: boolean; __first: Element | null };
      const root = document.getElementById("root")!;
      return {
        seen: w.__seen,
        gone: w.__gone,
        rendered: !!root.firstElementChild && root.firstElementChild !== w.__first, // React replaced the prerendered nodes
        chunks: performance.getEntriesByType("resource").map((r) => r.name),
      };
    });
    expect(state.seen, "the prerendered heading was on screen").toBe(true);
    expect(state.rendered, "the app rendered over the prerendered HTML").toBe(true);
    expect(state.gone, "frames with no heading after the first one").toBe(0);
    if (chunk) expect(state.chunks.some((u) => chunk.test(u)), "the route's chunk was fetched").toBe(true);
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  });
}
