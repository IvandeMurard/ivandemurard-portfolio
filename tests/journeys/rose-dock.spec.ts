import { dockInput, expect, expectNoHorizontalScroll, openDock, scrollClearOfDock, test } from "./helpers";
import { ROSE_HOME_PREFILL } from "../../src/content/roseWelcome";

// The buttons that open Rose always do something visible, also when the dock is already open.
//
// On a phone (under 768 px) an open dock covers the page with a scrim: a reader cannot reach a page button while it is
// open (the tap closes the dock). So the "dock already open" journeys run at 1440 only, and every journey has a
// "dock closed" variant that runs at both widths.

const isPhone = (page: import("@playwright/test").Page) => (page.viewportSize()?.width ?? 1440) < 768;
const PREFILL = ROSE_HOME_PREFILL;
const COMPASS = "Open Rose, the same compass as the dock below";
const panel = (page: import("@playwright/test").Page) => page.locator("[data-rose-panel]");

test("homepage card, dock open: Ask Rose puts the prefill in the input, selected, and sends nothing", async ({ page, backendCalls }) => {
  test.skip(isPhone(page), "an open dock covers the page on a phone");
  await page.goto("/");
  await openDock(page);
  const calls = backendCalls.length; // the dock may log that it opened; the prefill must add nothing

  const ask = page.getByRole("button", { name: "Ask Rose", exact: true });
  await scrollClearOfDock(ask);
  await ask.click();

  const input = dockInput(page);
  await expect(input).toHaveValue(PREFILL);
  await expect(input).toBeFocused();
  const selection = await input.evaluate((el: HTMLTextAreaElement) => [el.selectionStart, el.selectionEnd, el.value.length]);
  expect(selection).toEqual([0, PREFILL.length, PREFILL.length]);

  // Not submitted: the text is still in the input and nothing went to the backend.
  await page.waitForTimeout(600);
  expect(backendCalls.length).toBe(calls);
  await expect(input).toHaveValue(PREFILL);
  await expectNoHorizontalScroll(page);
});

test("homepage card, dock closed: Ask Rose opens the dock with the prefill selected, and sends nothing", async ({ page, backendCalls }) => {
  await page.goto("/");
  const calls = backendCalls.length;
  const ask = page.getByRole("button", { name: "Ask Rose", exact: true });
  await scrollClearOfDock(ask);
  await ask.click();
  const input = dockInput(page);
  await expect(input).toHaveValue(PREFILL);
  await expect(input).toBeFocused();
  // The opening dock focuses the input one frame before the prefill handler selects the text (two frames): read the
  // selection until it lands, not once, or a fast runner reads the caret at 0 in between. Still bounded to one second.
  await expect
    .poll(() => input.evaluate((el: HTMLTextAreaElement) => [el.selectionStart, el.selectionEnd]), { timeout: 1000 })
    .toEqual([0, PREFILL.length]);
  await page.waitForTimeout(600);
  expect(backendCalls.filter((u) => /rose-chat/.test(u))).toHaveLength(0);
  expect(backendCalls.length - calls).toBeLessThanOrEqual(1); // at most the "opened" event; never a question
  await expectNoHorizontalScroll(page);
});

test("homepage compass, dock open: Open Rose pulses the dock and puts focus in the input", async ({ page }) => {
  test.skip(isPhone(page), "an open dock covers the page on a phone");
  await page.goto("/");
  await openDock(page);
  const compass = page.getByRole("button", { name: COMPASS });
  await scrollClearOfDock(compass);
  await compass.click(); // focus moves to the compass button
  await expect(panel(page)).toHaveAttribute("data-pulse", "true");
  await expect(dockInput(page)).toBeFocused();
  // The pulse is short: gone within about a second.
  await expect(panel(page)).toHaveAttribute("data-pulse", "false", { timeout: 1500 });
  await expect(dockInput(page)).toBeFocused();
});

test("homepage compass, dock closed: Open Rose opens the dock with focus in the input", async ({ page }) => {
  await page.goto("/");
  const compass = page.getByRole("button", { name: COMPASS });
  await scrollClearOfDock(compass);
  await compass.click();
  await expect(dockInput(page)).toBeVisible();
  await expect(dockInput(page)).toBeFocused();
  await expect(dockInput(page)).toHaveValue("");
});

test("under reduced motion the dock does not pulse visibly, but still takes focus", async ({ page }) => {
  test.skip(isPhone(page), "an open dock covers the page on a phone");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await openDock(page);
  const compass = page.getByRole("button", { name: COMPASS });
  await scrollClearOfDock(compass);
  await compass.click();
  await expect(dockInput(page)).toBeFocused();
  // The pulse classes are overridden by their motion-reduce variants: the panel looks the same during and after.
  const look = () => panel(page).evaluate((el) => { const s = getComputedStyle(el); return [s.borderTopColor, s.boxShadow]; });
  const during = await look();
  await page.waitForTimeout(900);
  expect(during).toEqual(await look());
});

// The two rose:open buttons: the demos' "Ask Rose anything" (on /rose) and the closing "Ask Rose your question"
// (RoseLaterChapters, which only the lab at /rose/lab renders).
for (const [route, name] of [["/rose", "Ask Rose anything"], ["/rose/lab?concept=d", "Ask Rose your question"]] as const) {
  test(`${route}, dock open: '${name}' pulses the dock and focuses the input`, async ({ page }) => {
    await page.goto(route);
    await openDock(page);
    const button = page.getByRole("button", { name, exact: true }).first();
    await expect(button).toBeAttached();
    // dispatchEvent: the same click, without the dock covering the button at the bottom of the page
    await button.dispatchEvent("click");
    await expect(panel(page)).toHaveAttribute("data-pulse", "true");
    await expect(dockInput(page)).toBeFocused();
    await expect(panel(page)).toHaveAttribute("data-pulse", "false", { timeout: 1500 });
  });

  test(`${route}, dock closed: '${name}' opens the dock with focus in the input`, async ({ page }) => {
    await page.goto(route);
    const button = page.getByRole("button", { name, exact: true }).first();
    await button.scrollIntoViewIfNeeded();
    await button.click();
    await expect(dockInput(page)).toBeVisible();
    await expect(dockInput(page)).toBeFocused();
  });
}
