import { expect, test } from "@playwright/test";

const AUTH_ROUTES = [
  "/sign-in",
  "/verify-email",
  "/forgot-password",
  "/access-denied",
] as const;

for (const route of AUTH_ROUTES) {
  test(`@smoke ${route} renders developer auth ingress`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('[data-auth-segment="public"]')).toBeVisible();
    await expect(
      page.locator('[data-auth-ingress-state="ready"]')
    ).toBeVisible();
  });
}

test("@smoke /sign-in renders fixture metadata and motion shell", async ({
  page,
}) => {
  await page.goto("/sign-in");

  await expect(
    page.locator('[data-auth-ingress-path="/sign-in"]')
  ).toBeVisible();
  await expect(
    page.locator('[data-auth-ingress-surface="auth.sign-in"]')
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sign in to Afenda ERP" })
  ).toBeVisible();

  const motionScene = page.locator("[data-auth-shell-motion-phase]").first();
  await expect(motionScene).toBeVisible();
  await expect(motionScene).toHaveAttribute(
    "data-auth-shell-motion-source",
    /image|fallback/
  );
  await expect(page.locator("canvas").first()).toBeVisible();
});

test("@smoke /sign-in/missing renders auth not found", async ({ page }) => {
  await page.goto("/sign-in/missing");
  await expect(
    page.getByRole("heading", { name: "Auth surface not found" })
  ).toBeVisible();
});
