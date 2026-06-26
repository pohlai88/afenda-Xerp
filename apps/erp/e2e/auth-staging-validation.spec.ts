import { execSync } from "node:child_process";
import path from "node:path";
import {
  E2E_DEV_FIXTURE_ANNOTATION,
  hasE2EDevLoginCredentials,
  hasE2EViewerLoginCredentials,
  resolveE2EDevLoginCredentials,
  resolveE2EViewerLoginCredentials,
  signInWithEmailPassword,
} from "@afenda/testing/e2e/erp-credentials";
import { expect, test } from "@afenda/testing/e2e/playwright-base";

const STAGING_BRAND_HEADLINE = "Staging Validation Org";
const repoRoot = path.resolve(process.cwd(), "../..");

function resetStagingAuthStateFromE2e(): void {
  execSync("pnpm exec tsx scripts/reset-staging-e2e-auth-state.ts", {
    cwd: path.join(repoRoot, "packages/database"),
    stdio: "inherit",
  });
}

async function ensureTenantMfaPolicyOptional(
  page: import("@playwright/test").Page
) {
  await page.goto("/system-admin/settings/security", {
    waitUntil: "domcontentloaded",
  });

  if (!page.url().includes("/system-admin/settings/security")) {
    resetStagingAuthStateFromE2e();
    await page.goto("/system-admin/settings/security", {
      waitUntil: "domcontentloaded",
    });
  }

  await expect(page).toHaveURL(/\/system-admin\/settings\/security/, {
    timeout: 30_000,
  });

  const tenantSwitch = page.getByRole("switch").first();
  await expect(tenantSwitch).toBeVisible({ timeout: 30_000 });

  if (await tenantSwitch.isChecked()) {
    await tenantSwitch.click();
    await expect(page.getByText("Optional MFA")).toBeVisible({
      timeout: 15_000,
    });
  }
}

async function expectPostAuthCompleteRedirect(
  page: import("@playwright/test").Page,
  locationPattern: RegExp
) {
  await page.goto("/sign-in", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    // biome-ignore lint/suspicious/noDocumentCookie: e2e seeds post-auth bridge cookie in browser context
    document.cookie = `afenda-post-auth-sign-in-method=${encodeURIComponent("google")}; Path=/; Max-Age=600; SameSite=Lax`;
  });

  await page.goto("/auth/complete", { waitUntil: "commit" });
  await expect(page).toHaveURL(locationPattern, { timeout: 15_000 });
}

test.describe.configure({ mode: "serial", timeout: 120_000 });

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
        "MFA-enrolled users hit /mfa before security review under enforce-all"
      );

      await expectPostAuthCompleteRedirect(page, /\/security\/review/);
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

      await expectPostAuthCompleteRedirect(page, /\/mfa/);
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
    await expect(
      page.getByRole("heading", { name: "Social OAuth" })
    ).toBeVisible({ timeout: 30_000 });

    const socialOAuthRegion = page.getByRole("region", {
      name: "Social OAuth",
    });
    const githubRow = socialOAuthRegion
      .getByRole("listitem")
      .filter({ hasText: "GitHub (github)" });
    const githubSwitch = githubRow.getByRole("switch");
    await expect(githubSwitch).toBeChecked({ timeout: 15_000 });

    await githubSwitch.click();
    await expect(
      page.getByText("OAuth provider settings saved.", { exact: false })
    ).toBeVisible({ timeout: 15_000 });

    const browserInstance = page.context().browser();
    if (!browserInstance) {
      throw new Error("Expected Playwright browser instance");
    }

    const publicContext = await browserInstance.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const publicPage = await publicContext.newPage();

    try {
      await expect
        .poll(
          async () => {
            await publicPage.goto("/sign-in", {
              waitUntil: "domcontentloaded",
            });
            return publicPage.getByRole("button", { name: /^GitHub/i }).count();
          },
          { timeout: 30_000 }
        )
        .toBe(0);
    } finally {
      await publicContext.close();
    }

    await githubSwitch.click();
    await expect(
      page.getByText("OAuth provider settings saved.", { exact: false })
    ).toBeVisible({ timeout: 15_000 });
  });

  test("step 4 — tenant MFA policy redirects non-MFA users to enrollment", async ({
    browser,
    page,
  }) => {
    test.skip(
      !hasE2EViewerLoginCredentials(),
      "Set AFENDA_DEV_LOGIN_PASSWORD and run pnpm auth:bootstrap:dev for viewer account"
    );

    await page.goto("/system-admin/settings/security", {
      waitUntil: "domcontentloaded",
    });
    await expect(page).toHaveURL(/\/system-admin\/settings\/security/, {
      timeout: 30_000,
    });

    const tenantSwitch = page.getByRole("switch").first();
    await expect(tenantSwitch).toBeVisible({ timeout: 15_000 });
    const wasRequired = await tenantSwitch.isChecked();

    if (!wasRequired) {
      await tenantSwitch.click();
      await expect(tenantSwitch).toBeChecked({ timeout: 15_000 });
    }

    const viewerContext = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const viewerPage = await viewerContext.newPage();

    try {
      const credentials = resolveE2EViewerLoginCredentials();
      await viewerPage.goto("/sign-in", { waitUntil: "domcontentloaded" });
      await signInWithEmailPassword(viewerPage, credentials);

      await viewerPage.goto("/", { waitUntil: "load" });
      await expect(viewerPage).toHaveURL(
        /\/settings\/security\?.*notice=mfa-required/,
        {
          timeout: 30_000,
        }
      );
      await expect(
        viewerPage.getByText(
          /requires two-factor authentication before you can access/i
        )
      ).toBeVisible({ timeout: 30_000 });
    } finally {
      await viewerContext.close();
    }
  });

  test("step 5 — company MFA override updates effective enforcement label", async ({
    page,
  }) => {
    await ensureTenantMfaPolicyOptional(page);

    await page.goto("/system-admin/settings/security", {
      waitUntil: "domcontentloaded",
    });

    const overrideSelect = page.locator("#company-mfa-override");
    await expect(overrideSelect).toBeVisible();

    await overrideSelect.selectOption("require");
    await expect
      .poll(async () => overrideSelect.inputValue(), { timeout: 30_000 })
      .toBe("require");

    await expect(
      page.getByText("Effective enforcement for this workspace: required.")
    ).toBeVisible({ timeout: 30_000 });
  });

  test("step 6 — appearance branding renders on sign-in", async ({
    browser,
    page,
  }) => {
    await ensureTenantMfaPolicyOptional(page);

    await page.goto("/system-admin/settings/appearance", {
      waitUntil: "domcontentloaded",
    });
    await expect(page).toHaveURL(/\/system-admin\/settings\/appearance/, {
      timeout: 30_000,
    });

    const enabledCheckbox = page.getByRole("checkbox", {
      name: /enable tenant auth branding/i,
    });
    await expect(enabledCheckbox).toBeVisible({ timeout: 15_000 });

    if (!(await enabledCheckbox.isChecked())) {
      await enabledCheckbox.check();
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
      await expect
        .poll(
          async () => {
            await publicPage.goto("/sign-in", {
              waitUntil: "domcontentloaded",
            });
            return publicPage
              .getByRole("heading", {
                level: 2,
                name: STAGING_BRAND_HEADLINE,
              })
              .count();
          },
          { timeout: 30_000 }
        )
        .toBeGreaterThan(0);
    } finally {
      await publicContext.close();
    }
  });
});
