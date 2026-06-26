import {
  E2E_DEV_FIXTURE_ANNOTATION,
  hasE2EDevLoginCredentials,
} from "@afenda/testing/e2e/erp-credentials";
import { expect, test } from "@afenda/testing/e2e/playwright-base";

const DASHBOARD_LAYOUT_API_PATH = "/api/internal/v1/workspace/dashboard-layout";
const APPSHELL_CANVAS_URL_PATTERN = /\/appshell-canvas(?:\?.*)?$/;

test.describe("protected home dashboard", () => {
  test.beforeEach((_fixtures, testInfo) => {
    test.skip(
      !hasE2EDevLoginCredentials(),
      "Set AFENDA_DEV_LOGIN_PASSWORD (min 8 chars) and run pnpm auth:bootstrap:dev"
    );
    testInfo.annotations.push(E2E_DEV_FIXTURE_ANNOTATION);
  });

  test("@smoke @auth signs in and renders the protected dashboard", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      page.getByRole("heading", { name: "Workspace home" })
    ).toBeVisible({ timeout: 30_000 });
    await expect(
      page.getByRole("region", { name: "Workspace dashboard" })
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "ERP overview dashboard" })
    ).toBeVisible({ timeout: 30_000 });
  });

  test("@auth renders governed ApplicationShell chrome in production layout", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator(".app-shell-root")).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.locator("[data-app-shell-content]")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Notifications/i })
    ).toBeVisible();
    await expect(page.getByText("Search modules…")).toBeVisible();
  });
});

test.describe("public dev harness", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("@smoke appshell demo redirects to the canvas harness", async ({
    page,
  }) => {
    await page.goto("/appshell-demo", { waitUntil: "load" });
    await expect(page).toHaveURL(APPSHELL_CANVAS_URL_PATTERN);
    await expect(page.locator("h1.app-shell-page-title")).toHaveText(
      "Dashboard canvas",
      { timeout: 30_000 }
    );
  });

  test("@smoke unsigned appshell canvas falls back to default layout", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    try {
      const layoutRequest = page.waitForResponse(
        (response) =>
          response.request().method() === "GET" &&
          response.url().includes(DASHBOARD_LAYOUT_API_PATH),
        { timeout: 30_000 }
      );

      await page.goto("/appshell-canvas", { waitUntil: "load" });

      const layoutResponse = await layoutRequest;
      expect(layoutResponse.status()).toBe(401);

      await expect(page.locator("h1.app-shell-page-title")).toHaveText(
        "Dashboard canvas",
        { timeout: 30_000 }
      );
      await expect(page.getByText(/Using default layout/i)).toBeVisible({
        timeout: 30_000,
      });
      await expect(
        page.getByRole("button", { name: "Reset layout" })
      ).toBeDisabled();
    } finally {
      await context.close();
    }
  });
});
