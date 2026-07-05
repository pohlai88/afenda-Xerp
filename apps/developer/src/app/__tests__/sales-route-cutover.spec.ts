import { mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const evidenceDir = path.resolve(
  process.cwd(),
  "..",
  "..",
  "packages",
  "shadcn-studio",
  "docs",
  "bridging-r",
  "evidence"
);
const screenshotPath = path.join(evidenceDir, "sales-route-cutover.png");

test("Sales route cutover proof @smoke @cutover", async ({ page }) => {
  await page.goto("/dashboard/sales");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Sales command surface",
    })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Afenda Route Lab",
    })
  ).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" })
  ).toBeVisible();
  await expect(
    page.getByText("Canonical Route Pattern", { exact: true })
  ).toBeVisible();
  await expect(page.getByText("Promotion note", { exact: true })).toBeVisible();

  const cssVariables = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);

    return {
      background: styles.getPropertyValue("--background").trim(),
      card: styles.getPropertyValue("--card").trim(),
      sidebar: styles.getPropertyValue("--sidebar").trim(),
    };
  });

  expect(cssVariables.background).not.toBe("");
  expect(cssVariables.card).not.toBe("");
  expect(cssVariables.sidebar).not.toBe("");

  mkdirSync(evidenceDir, { recursive: true });
  rmSync(screenshotPath, { force: true });
  await page.screenshot({
    fullPage: true,
    path: screenshotPath,
  });
});
