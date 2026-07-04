import { expect, test } from "@playwright/test";

test("@smoke /missing renders root not found", async ({ page }) => {
  await page.goto("/missing");
  await expect(
    page.getByRole("heading", { name: "Surface not found" })
  ).toBeVisible();
});
