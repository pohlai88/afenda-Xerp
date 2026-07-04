import { expect, test } from "@playwright/test";

test("@smoke / renders developer landing page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-lab-segment="home"]')).toBeVisible();
  await expect(
    page.locator('[data-home-surface="developer-landing"]')
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "LAB",
    })
  ).toBeVisible();
  await expect(page.getByText("Afenda Proof Verification OS")).toBeVisible();
  await expect(
    page.getByAltText("Afenda sealed verification proof chamber")
  ).toBeVisible();
});
