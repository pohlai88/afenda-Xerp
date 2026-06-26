import {
  E2E_DEV_FIXTURE_ANNOTATION,
  hasE2EDevLoginCredentials,
  hasE2EViewerLoginCredentials,
  resolveE2EDevLoginCredentials,
  resolveE2EViewerLoginCredentials,
} from "@afenda/testing/e2e/erp-credentials";
import { expect, test } from "@afenda/testing/e2e/playwright-base";

const STAGING_BRAND_HEADLINE = "Staging Validation Org";
const POST_AUTH_METHOD_COOKIE = "afenda-post-auth-sign-in-method";

test.describe.configure({ mode: "serial" });

test.describe("auth staging validation @staging", () => {
  test.beforeEach((_fixtures, testInfo) => {
    test.skip(
      !hasE2EDevLoginCredentials(),
      "Set AFENDA_DEV_LOGIN_PASSWORD (min 8 chars) and run pnpm auth:bootstrap:dev"
    );
    testInfo.annotations.push(E2E_DEV_FIXTURE_ANNOTATION);
  });

  test("step 2 — passwordless security review before workspace entry", async ({
    browser,
  }) => {
    const credentials = resolveE2EDevLoginCredentials();
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    try {
      const signInResponse = await page.request.post(
        "/api/auth/sign-in/email",
        {
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        }
      );
      expect(signInResponse.ok()).toBeTruthy();

      const sessionResponse = await page.request.get("/api/auth/get-session");
      expect(sessionResponse.ok()).toBeTruthy();
      const sessionPayload = (await sessionResponse.json()) as {
        user?: { twoFactorEnabled?: boolean };
      };

      test.skip(
        sessionPayload.user?.twoFactorEnabled === true,
        "MFA-enrolled users hit /v2/mfa before security review under enforce-all"
      );

      await context.addCookies([
        {
          domain: "localhost",
          name: POST_AUTH_METHOD_COOKIE,
          path: "/",
          value: "google",
        },
      ]);

      await page.goto("/v2/auth/complete", { waitUntil: "commit" });
      await expect(page).toHaveURL(/\/v2\/security\/review/, {
        timeout: 15_000,
      });
    } finally {
      await context.close();
    }
  });

  test("step 1 — enforce-all MFA step-up on post-auth complete (when MFA enrolled)", async ({
    browser,
  }) => {
    const credentials = resolveE2EDevLoginCredentials();
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const page = await context.newPage();

    try {
      const signInResponse = await page.request.post(
        "/api/auth/sign-in/email",
        {
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        }
      );
      expect(signInResponse.ok()).toBeTruthy();

      const sessionResponse = await page.request.get("/api/auth/get-session");
      expect(sessionResponse.ok()).toBeTruthy();
      const sessionPayload = (await sessionResponse.json()) as {
        user?: { twoFactorEnabled?: boolean };
      };

      test.skip(
        sessionPayload.user?.twoFactorEnabled !== true,
        "Dev admin does not have MFA enrolled — enroll at /settings/security to validate step 1 live"
      );

      await context.addCookies([
        {
          domain: "localhost",
          name: POST_AUTH_METHOD_COOKIE,
          path: "/",
          value: "google",
        },
      ]);

      await page.goto("/v2/auth/complete", { waitUntil: "commit" });
      await expect(page).toHaveURL(/\/v2\/mfa/, { timeout: 15_000 });
    } finally {
      await context.close();
    }
  });

  test("step 3 — tenant GitHub OAuth toggle hides GitHub on sign-in", async ({
    page,
  }) => {
    await page.goto("/system-admin/settings/integrations", {
      waitUntil: "domcontentloaded",
    });

    const githubRow = page.getByRole("listitem").filter({ hasText: /GitHub/i });
    const githubSwitch = githubRow.getByRole("switch");
    const wasEnabled = await githubSwitch.isChecked();

    if (wasEnabled) {
      await githubSwitch.click();
      await expect(
        page.getByText("OAuth provider settings saved.", { exact: false })
      ).toBeVisible({ timeout: 15_000 });
    }

    const browserInstance = page.context().browser();
    if (!browserInstance) {
      throw new Error("Expected Playwright browser instance");
    }

    const publicContext = await browserInstance.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const publicPage = await publicContext.newPage();

    try {
      await publicPage.goto("/v2/sign-in", { waitUntil: "domcontentloaded" });
      await expect(
        publicPage.getByRole("button", { name: /^GitHub/i })
      ).toHaveCount(0);
    } finally {
      await publicContext.close();
    }

    if (wasEnabled) {
      await githubSwitch.click();
      await expect(
        page.getByText("OAuth provider settings saved.", { exact: false })
      ).toBeVisible({ timeout: 15_000 });
    }
  });

  test("step 4 — tenant MFA policy redirects non-MFA users to enrollment", async ({
    browser,
  }) => {
    test.skip(
      !hasE2EViewerLoginCredentials(),
      "Set AFENDA_DEV_LOGIN_PASSWORD and run pnpm auth:bootstrap:dev for viewer account"
    );

    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    await adminPage.goto("/system-admin/settings/security", {
      waitUntil: "domcontentloaded",
    });

    const tenantSwitch = adminPage.getByRole("switch").first();
    const wasRequired = await tenantSwitch.isChecked();

    if (!wasRequired) {
      await tenantSwitch.click();
      await expect(adminPage.getByText("Enforcement active")).toBeVisible({
        timeout: 15_000,
      });
    }

    const viewerContext = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const viewerPage = await viewerContext.newPage();

    try {
      const credentials = resolveE2EViewerLoginCredentials();
      const signInResponse = await viewerPage.request.post(
        "/api/auth/sign-in/email",
        {
          data: {
            email: credentials.email,
            password: credentials.password,
          },
        }
      );
      expect(signInResponse.ok()).toBeTruthy();

      await viewerPage.goto("/", { waitUntil: "commit" });
      await expect(viewerPage).toHaveURL(
        /\/settings\/security\?.*notice=mfa-required/,
        {
          timeout: 20_000,
        }
      );
      await expect(
        viewerPage.getByText(/requires two-factor authentication/i)
      ).toBeVisible();
    } finally {
      await viewerContext.close();
    }

    if (!wasRequired) {
      await tenantSwitch.click();
      await expect(adminPage.getByText("Optional MFA")).toBeVisible({
        timeout: 15_000,
      });
    }

    await adminContext.close();
  });

  test("step 5 — company MFA override updates effective enforcement label", async ({
    page,
  }) => {
    await page.goto("/system-admin/settings/security", {
      waitUntil: "domcontentloaded",
    });

    const overrideSelect = page.locator("#company-mfa-override");
    await expect(overrideSelect).toBeVisible();

    const previousValue = await overrideSelect.inputValue();
    await overrideSelect.selectOption("require");

    await expect(
      page.getByText(/Effective enforcement for this workspace: required/i)
    ).toBeVisible({ timeout: 15_000 });

    await overrideSelect.selectOption(previousValue);
  });

  test("step 6 — appearance branding renders on auth-v2 sign-in", async ({
    browser,
    page,
  }) => {
    await page.goto("/system-admin/settings/appearance", {
      waitUntil: "domcontentloaded",
    });

    const enabledSwitch = page.getByRole("switch").first();
    if (!(await enabledSwitch.isChecked())) {
      await enabledSwitch.click();
    }

    await page.getByLabel("Brand headline").fill(STAGING_BRAND_HEADLINE);
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText("Appearance settings saved.")).toBeVisible({
      timeout: 15_000,
    });

    const publicContext = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const publicPage = await publicContext.newPage();

    try {
      await publicPage.goto("/v2/sign-in", { waitUntil: "domcontentloaded" });
      await expect(
        publicPage.getByRole("heading", {
          level: 2,
          name: STAGING_BRAND_HEADLINE,
        })
      ).toBeVisible({ timeout: 15_000 });
    } finally {
      await publicContext.close();
    }
  });
});
