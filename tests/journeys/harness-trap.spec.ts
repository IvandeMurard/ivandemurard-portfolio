import { expect, expectNoHorizontalScroll, scrollClearOfDock, test } from "./helpers";

// Harness note, phase 2. Section 7 asks before it shows the figures; section 1 opens on the driving-test story;
// section 13 folds what the literature adds. Each journey asserts what a reader sees.

const NOTE = "/journal/harnesses-graders-closed-loops";
const QUESTION = "Two runs of the same 53 cases scored 38, then 36. Is the gate ready to block a release?";
const NOT_YET = "Not yet is correct. Only 12 of the 17 failures were the same, and eight cases flipped between two identical runs: the score depended on the draw.";
const YES = "That is the trap. Eight cases flipped between two identical runs: the gate would have blocked or passed on luck.";

test("section 7: the trap asks first, with the figures visible below in every case", async ({ page }) => {
  await page.goto(NOTE);
  const trap = page.locator("[data-trap]");
  await trap.waitFor({ state: "attached" });
  await scrollClearOfDock(trap);
  await expect(trap).toContainText(QUESTION);
  await expect(trap.getByRole("button")).toHaveText(["Yes", "Not yet"]);
  const status = trap.getByRole("status");
  await expect(status).toHaveText("");
  // The figures are not behind the answer.
  const figures = page.getByText("Two runs, same 53 cases");
  await expect(figures).toBeVisible();

  await trap.getByRole("button", { name: "Not yet" }).click();
  await expect(status).toHaveText(NOT_YET);
  await expect(trap.getByRole("button", { name: "Not yet" })).toHaveAttribute("aria-pressed", "true");
  await expect(figures).toBeVisible();

  await trap.getByRole("button", { name: "Yes" }).click();
  await expect(status).toHaveText(YES);
  await expect(figures).toBeVisible();
  await expectNoHorizontalScroll(page);
});

test("section 7: the trap is answered from the keyboard", async ({ page }) => {
  await page.goto(NOTE);
  const trap = page.locator("[data-trap]");
  await trap.waitFor({ state: "attached" });
  await scrollClearOfDock(trap);
  await trap.getByRole("button", { name: "Not yet" }).focus();
  await page.keyboard.press("Enter");
  await expect(trap.getByRole("status")).toHaveText(NOT_YET);
});

test("section 1: the driving-test story comes first and Section 6 leads to section 6", async ({ page }) => {
  await page.goto(NOTE);
  const story = page.getByText("A candidate drives the whole route without a fault.");
  await story.scrollIntoViewIfNeeded();
  await expect(story).toContainText("they roll through a stop sign on an empty street");
  await expect(page.getByText("Every part of an evaluation harness is already in that scene.")).toBeVisible();
  const link = story.getByRole("link", { name: "Section 6" });
  await link.click();
  await expect(page).toHaveURL(/#6-acceptance-criteria-the-part-everyone-skips$/);
  await expect(page.locator("[id='6-acceptance-criteria-the-part-everyone-skips']")).toBeInViewport({ timeout: 8000 });
});

test("section 13: what the literature adds is closed, and opens from its summary", async ({ page }) => {
  await page.goto(NOTE);
  const summary = page.getByText("Read what that literature adds to this one", { exact: true });
  await summary.scrollIntoViewIfNeeded();
  const fold = page.locator("details", { has: summary });
  await expect(fold).not.toHaveAttribute("open", /.*/);
  // What stays visible above the fold.
  await expect(page.getByText("An agent harness proves the system can act. An evaluation harness proves it still should.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Where the two meet: the verify step" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What that literature adds to this one" })).toBeHidden();

  await summary.click();
  await expect(fold).toHaveAttribute("open", "");
  await expect(page.getByRole("heading", { name: "What that literature adds to this one" })).toBeVisible();
  await expectNoHorizontalScroll(page);
});

