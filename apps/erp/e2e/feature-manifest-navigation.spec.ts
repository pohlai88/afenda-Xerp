import { ERP_VIEWER_AUTH_STORAGE_RELATIVE } from "@afenda/testing/e2e/auth-paths";
import {
  E2E_DEV_FIXTURE_ANNOTATION,
  hasE2EDevLoginCredentials,
  hasE2EViewerLoginCredentials,
} from "@afenda/testing/e2e/erp-credentials";
import { expect, test } from "@afenda/testing/e2e/playwright-base";

const MANIFEST_PLACEHOLDER_COPY = /registered in the feature manifest/i;
const SIGN_IN_PATH_PATTERN = /\/sign-in/;
const ACCOUNTING_CORE_TERMS = /ledger|journal|posting/i;

test.describe("feature manifest navigation (tenant admin)", () => {
  test.beforeEach((_fixtures, testInfo) => {
    test.skip(
      !hasE2EDevLoginCredentials(),
      "Set AFENDA_DEV_LOGIN_PASSWORD (min 8 chars) and run pnpm auth:bootstrap:dev"
    );
    testInfo.annotations.push(E2E_DEV_FIXTURE_ANNOTATION);
  });

  test("@smoke @auth shows HRM in manifest-driven sidebar navigation", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible({
      timeout: 30_000,
    });

    const hrmNavLink = page.locator(
      'a.app-shell-nav-link[href="/modules/hrm"]'
    );
    await expect(hrmNavLink).toHaveCount(1);
    await expect(hrmNavLink).toBeAttached();
    await expect(hrmNavLink).toHaveAttribute("href", "/modules/hrm");
  });

  test("@auth renders the HRM module placeholder from the manifest route", async ({
    page,
  }) => {
    const response = await page.goto("/modules/hrm", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "HRM" })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByText(MANIFEST_PLACEHOLDER_COPY)).toBeVisible();
  });

  test("@auth renders accounting as a shell placeholder without Accounting Core", async ({
    page,
  }) => {
    const response = await page.goto("/modules/accounting", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "Accounting" })).toBeVisible(
      {
        timeout: 30_000,
      }
    );
    await expect(page.getByText(MANIFEST_PLACEHOLDER_COPY)).toBeVisible();
    await expect(page.getByText(ACCOUNTING_CORE_TERMS)).toHaveCount(0);
  });

  test("@auth returns not found for unknown manifest module segments", async ({
    page,
  }) => {
    const response = await page.goto("/modules/unknown-module", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(404);
  });
});

test.describe("feature manifest RBAC denial (workspace reader)", () => {
  test.use({
    storageState: ERP_VIEWER_AUTH_STORAGE_RELATIVE,
  });

  test.beforeEach((_fixtures, testInfo) => {
    test.skip(
      !hasE2EViewerLoginCredentials(),
      "Set AFENDA_DEV_LOGIN_PASSWORD (min 8 chars); viewer defaults to {password}-viewer after pnpm auth:bootstrap:dev"
    );
    testInfo.annotations.push(E2E_DEV_FIXTURE_ANNOTATION);
  });

  test("@auth hides HRM when RBAC permission is missing", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole("link", { name: "HRM" })).toHaveCount(0);
  });

  test("@auth returns forbidden for direct HRM route access", async ({
    page,
  }) => {
    const response = await page.goto("/modules/hrm", {
      waitUntil: "domcontentloaded",
    });

    expect(response?.status()).toBe(403);
  });
});

test.describe("feature manifest route guard (unsigned)", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("@smoke redirects unsigned users to sign-in", async ({ page }) => {
    await page.goto("/modules/hrm", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(SIGN_IN_PATH_PATTERN);
  });
});
