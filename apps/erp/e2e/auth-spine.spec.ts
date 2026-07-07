import { expect, test } from "@playwright/test";

test.describe("auth spine @smoke", () => {
  test("sign-in page loads with accessible auth shell controls", async ({
    page,
  }) => {
    await page.goto("/sign-in");

    const main = page.getByRole("main", { name: "Sign in" });
    await expect(main).toBeVisible();
    await expect(
      main.getByRole("textbox", { name: /email/i }).first()
    ).toBeVisible();
    await expect(
      main.getByRole("button", { name: /sign in/i }).first()
    ).toBeVisible();
    await expect(main.locator("#login-form-v1").first()).toBeVisible();
  });

  test("access-denied shell is visible", async ({ page }) => {
    await page.goto("/access-denied");

    const main = page.getByRole("main", { name: "Access denied" });
    await expect(main).toBeVisible();
    await expect(
      main.getByRole("heading", { name: /access denied/i }).first()
    ).toBeVisible();
  });

  test("session-expired ingress loads", async ({ page }) => {
    await page.goto("/session-expired");

    const main = page.getByRole("main", { name: "Session expired" });
    await expect(main).toBeVisible();
    await expect(
      main.getByRole("heading", { name: /session expired/i }).first()
    ).toBeVisible();
  });
});
