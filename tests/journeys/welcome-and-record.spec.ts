import { expect, moodToggle, record, test } from "./helpers";

// Rose's welcome (scripted, once per session) and the header record.

/** The welcome waits for a scroll on a phone, or when it would cover the call to action. */
const showWelcome = async (page: import("@playwright/test").Page) => {
  await page.goto("/");
  await page.mouse.wheel(0, 400);
  await expect(page.locator("[data-rose-welcome]")).toBeVisible();
};

test("Rose's welcome: dim, then record, then stop, all from the welcome, which stays after each", async ({ page }) => {
  await showWelcome(page);
  const w = page.locator("[data-rose-welcome]");
  await w.getByRole("button", { name: "Dim the lights" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mood", "dusk");
  await expect(w).toBeVisible();
  await w.getByRole("button", { name: "Put on a record" }).click();
  await expect(record(page)).toHaveAttribute("aria-checked", "true");
  await expect(w).toContainText("Now playing: Odetta, ATCQ Tribute.");
  await w.getByRole("button", { name: "Stop the record" }).click();
  await expect(record(page)).toHaveAttribute("aria-checked", "false");
  await expect(w).toBeVisible();
  await expect(w.getByRole("button", { name: "Put on a record" })).toBeVisible();
});

test("Rose's welcome: 'No thanks' dismisses it", async ({ page }) => {
  await showWelcome(page);
  await page.getByRole("button", { name: "No thanks" }).click();
  await expect(page.locator("[data-rose-welcome]")).toHaveCount(0);
});

test("Rose's welcome: typing a question dismisses it", async ({ page }) => {
  await showWelcome(page);
  await page.locator("[data-rose-dock] input, [data-rose-dock] textarea").first().pressSequentially("Hi");
  await expect(page.locator("[data-rose-welcome]")).toHaveCount(0);
});

for (const mood of ["day", "dusk"] as const) {
  test(`the header record plays and stops, in ${mood}`, async ({ page }) => {
    await page.goto("/");
    if (mood === "dusk") {
      await moodToggle(page).click();
      await expect(page.locator("html")).toHaveAttribute("data-mood", "dusk");
    } else {
      await expect(page.locator("html")).not.toHaveAttribute("data-mood", "dusk");
    }
    const rec = record(page);
    await expect(rec).toBeVisible();
    await expect(rec).toHaveAttribute("aria-checked", "false");
    await rec.click();
    await expect(rec).toHaveAttribute("aria-checked", "true");
    await expect(rec.locator(".vinyl-spin")).toHaveAttribute("data-playing", "true");
    await rec.click();
    await expect(rec).toHaveAttribute("aria-checked", "false");
    await expect(rec.locator(".vinyl-spin")).toHaveAttribute("data-playing", "false");
    // The header record has no sleeve image, in either mood.
    await expect(rec.locator("image")).toHaveCount(0);
  });
}
