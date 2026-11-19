import { expect, expectNoHorizontalScroll, test } from "./helpers";

// Old URLs land on the right page and section; cards open what they name; the harness note's trap reveals its boxes.

test("/journeys lands on /case-studies", async ({ page }) => {
  await page.goto("/journeys");
  await expect(page).toHaveURL(/\/case-studies$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("/atherix lands on /aetherix", async ({ page }) => {
  await page.goto("/atherix");
  await expect(page).toHaveURL(/\/aetherix$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page).toHaveTitle(/Aetherix/);
});

test("/atherix#where-it-stands keeps the section", async ({ page }) => {
  await page.goto("/atherix#where-it-stands");
  await expect(page).toHaveURL(/\/aetherix#where-it-stands$/);
  await expect(page.locator("#where-it-stands")).toBeInViewport({ timeout: 8000 });
});

test("/rose-design-lab#ch-03 lands on /rose at chapter 3", async ({ page }) => {
  await page.goto("/rose-design-lab#ch-03");
  await expect(page).toHaveURL(/\/rose#ch-03$/);
  await expect(page.locator("#ch-03")).toBeAttached();
  await expect(page.locator("#ch-03")).toBeInViewport({ timeout: 8000 });
});

test("/case-studies: 'Read the case' opens the case", async ({ page }) => {
  await page.goto("/case-studies");
  const link = page.getByRole("link", { name: /^Read the case\s*:\s*Aetherix/ });
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page).toHaveURL(/\/aetherix$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page).toHaveTitle(/Aetherix/);
  await expectNoHorizontalScroll(page);
});

test("/journal: 'Read the note' opens the note", async ({ page }) => {
  await page.goto("/journal");
  const link = page.getByRole("link", { name: /^Read the note/ }).first();
  await link.scrollIntoViewIfNeeded();
  const name = (await link.textContent()) ?? "";
  await link.click();
  await expect(page).toHaveURL(/\/journal\/[a-z0-9-]+$/);
  const title = name.replace(/^Read the note:\s*/, "").trim();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(title.slice(0, 20));
  await expectNoHorizontalScroll(page);
});

test("harness note: answering the trap reveals the three boxes", async ({ page }) => {
  await page.goto("/journal/harnesses-graders-closed-loops");
  const peak = page.locator("[data-peak]");
  await peak.scrollIntoViewIfNeeded();
  await expect(peak.getByText("1 · The answer")).toHaveCount(0);
  await peak.getByRole("button", { name: "Too high" }).click();
  for (const label of ["1 · The answer", "2 · The graders", "3 · The code"]) {
    await expect(peak.getByText(label)).toBeVisible();
  }
  await expect(peak.getByRole("status")).toContainText("Right. Lore said normal");
  await expectNoHorizontalScroll(page);
});

test("/anima links to a section of the evaluation note that exists", async ({ page }) => {
  await page.goto("/anima");
  const link = page.locator('a[href*="harnesses-graders-closed-loops#"]').first();
  const href = await link.getAttribute("href");
  const id = href!.split("#")[1];
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await expect(page).toHaveURL(new RegExp(`/journal/harnesses-graders-closed-loops#${id}$`));
  await expect(page.locator(`[id="${id}"]`)).toBeAttached();
});
