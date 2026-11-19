import { expect, moodToggle, record, test } from "./helpers";

// Rose's welcome (scripted, once per session) and the header record.

/** The welcome waits for a scroll on a phone, or when it would cover the call to action. */
const showWelcome = async (page: import("@playwright/test").Page) => {
  await page.goto("/");
  await page.mouse.wheel(0, 400);
  await expect(page.locator("[data-rose-welcome]")).toBeVisible();
};

test("Rose's welcome: 'Dim the lights' switches the mood to dusk", async ({ page }) => {
  await showWelcome(page);
  await expect(page.locator("html")).not.toHaveAttribute("data-mood", "dusk");
  await page.getByRole("button", { name: "Dim the lights" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mood", "dusk");
  await expect(page.locator("[data-rose-welcome]")).toHaveCount(0);
});

test("Rose's welcome: 'Put on a record' shows the playing confirmation, and Stop mutes", async ({ page }) => {
  await showWelcome(page);
  await expect(record(page)).toHaveAttribute("aria-checked", "false");
  await page.getByRole("button", { name: "Put on a record" }).click();
  // The confirmation: the header record is playing (switch on, labelled "Stop the record", disc spinning).
  await expect(record(page)).toHaveAttribute("aria-checked", "true");
  await expect(record(page)).toHaveAccessibleName("Stop the record");
  await expect(record(page).locator(".vinyl-spin")).toHaveAttribute("data-playing", "true");
  // Stop: muted again.
  await record(page).click();
  await expect(record(page)).toHaveAttribute("aria-checked", "false");
  await expect(record(page)).toHaveAccessibleName("Play the record");
  await expect(record(page).locator(".vinyl-spin")).toHaveAttribute("data-playing", "false");
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
