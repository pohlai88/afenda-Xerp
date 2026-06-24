import { expect, test } from "@playwright/test";

import {
  E2E_DEV_FIXTURE_ANNOTATION,
  hasE2EDevLoginCredentials,
  resolveE2EDevLoginCredentials,
  signInWithEmailPassword,
} from "./fixtures/dev-auth";

const DASHBOARD_LAYOUT_API_PATH = "/api/internal/v1/workspace/dashboard-layout";
const APPSHELL_CANVAS_URL_PATTERN = /\/appshell-canvas(?:\?.*)?$/;

function waitForDashboardLayoutGet(page: import("@playwright/test").Page) {
  return page.waitForResponse(
    (response) =>
      response.request().method() === "GET" &&
      response.url().includes(DASHBOARD_LAYOUT_API_PATH),
    { timeout: 30_000 }
  );
}

test.describe("protected home dashboard", () => {
  test.beforeEach((_context, testInfo) => {
    // biome-ignore lint/suspicious/noSkippedTests: gated on local dev credentials
    test.skip(
      !hasE2EDevLoginCredentials(),
      "Set AFENDA_DEV_LOGIN_PASSWORD (min 8 chars) and run pnpm auth:bootstrap:dev"
    );
    testInfo.annotations.push(E2E_DEV_FIXTURE_ANNOTATION);
  });

  test("signs in and renders the protected dashboard", async ({ page }) => {
    await signInWithEmailPassword(page, resolveE2EDevLoginCredentials());

    const layoutResponsePromise = waitForDashboardLayoutGet(page);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const layoutResponse = await layoutResponsePromise;

    expect(layoutResponse.ok()).toBeTruthy();

    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      page.getByRole("heading", { name: "Workspace home" })
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Workspace dashboard" })
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "ERP overview dashboard" })
    ).toBeVisible({ timeout: 30_000 });
  });
});

test.describe("public dev harness", () => {
  test("appshell demo redirects to the canvas harness", async ({ page }) => {
    await page.goto("/appshell-demo");
    await expect(page).toHaveURL(APPSHELL_CANVAS_URL_PATTERN);
    await expect(
      page.getByRole("heading", { name: "Dashboard canvas" })
    ).toBeVisible({
      timeout: 30_000,
    });
  });

  test("unsigned appshell canvas falls back to default layout", async ({
    page,
  }) => {
    const layoutResponsePromise = waitForDashboardLayoutGet(page);
    await page.goto("/appshell-canvas", { waitUntil: "domcontentloaded" });
    const layoutResponse = await layoutResponsePromise;

    expect(layoutResponse.status()).toBe(401);

    await expect(
      page.getByRole("heading", { name: "Dashboard canvas" })
    ).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      page.getByText(
        "Using default layout (sign in to load or save workspace layout)."
      )
    ).toBeVisible({ timeout: 30_000 });
    await expect(
      page.getByRole("region", { name: "ERP overview dashboard" })
    ).toBeVisible({ timeout: 30_000 });
  });
});
