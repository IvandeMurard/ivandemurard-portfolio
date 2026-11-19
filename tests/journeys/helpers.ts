import { test as base, expect, type Locator, type Page } from "@playwright/test";

/** Requests to the backend (Rose's chat and event log): the journeys never call a model or log an event. */
const BACKEND = /supabase\.co|\/functions\/v1\//;

export const test = base.extend<{ backendCalls: string[] }>({
  backendCalls: async ({}, use) => {
    await use([]);
  },
  // Every test starts on a page with the backend blocked; the calls that were attempted are listed in backendCalls.
  page: async ({ page, backendCalls }, use) => {
    await page.route(BACKEND, (route) => {
      backendCalls.push(route.request().url());
      return route.fulfill({ status: 204, body: "" });
    });
    await use(page);
  },
});
export { expect };

/** The dock's message field, once the dock is open. */
export const dockInput = (page: Page): Locator => page.getByRole("textbox", { name: "Message Rose" });

/** Opens the dock with Ctrl+K (works from anywhere except a text field). */
export const openDock = async (page: Page) => {
  await page.keyboard.press("Control+k");
  await expect(dockInput(page)).toBeVisible();
};

/** The header's record (a switch named "Play the record" / "Stop the record"); only the visible one of the two is matched. */
export const record = (page: Page): Locator => page.getByRole("switch", { name: /the record$/ });

/** The header's Day/Dusk button (the Paris clock). */
export const moodToggle = (page: Page): Locator => page.getByRole("button", { name: /Switch to (Dusk|Day) mode/ });

/** Scrolls an element to the upper third of the viewport, clear of the dock that overlays the bottom. */
export const scrollClearOfDock = (el: Locator) =>
  el.evaluate((node) => {
    const top = node.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, top - window.innerHeight * 0.25));
  });

/** No horizontal scroll: the page is never wider than the viewport. */
export const expectNoHorizontalScroll = async (page: Page) => {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "horizontal overflow in px").toBeLessThanOrEqual(0);
};
