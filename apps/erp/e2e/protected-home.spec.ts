import { expect, test } from "@playwright/test";

const DEV_LOGIN_EMAIL = "dev-admin@localhost.afenda";
const DEV_LOGIN_EMAIL_ENV = "AFENDA_DEV_LOGIN_EMAIL";
const DEV_LOGIN_PASSWORD_ENV = "AFENDA_DEV_LOGIN_PASSWORD";
const MIN_DEV_LOGIN_PASSWORD_LENGTH = 8;
const DASHBOARD_LAYOUT_API_PATH = "/api/internal/v1/workspace/dashboard-layout";

function hasE2EDevLoginCredentials(): boolean {
  const password = process.env[DEV_LOGIN_PASSWORD_ENV]?.trim();
  return Boolean(password && password.length >= MIN_DEV_LOGIN_PASSWORD_LENGTH);
}

function resolveE2EDevLoginCredentials(): {
  readonly email: string;
  readonly password: string;
} {
  const password = process.env[DEV_LOGIN_PASSWORD_ENV]?.trim();
  if (!password || password.length < MIN_DEV_LOGIN_PASSWORD_LENGTH) {
    throw new Error(
      `${DEV_LOGIN_PASSWORD_ENV} is required (minimum ${MIN_DEV_LOGIN_PASSWORD_LENGTH} characters). Run pnpm auth:bootstrap:dev after setting it in .env.local.`
    );
  }

  const configured = process.env[DEV_LOGIN_EMAIL_ENV]?.trim();
  return {
    email: configured && configured.length > 0 ? configured : DEV_LOGIN_EMAIL,
    password,
  };
}

function waitForDashboardLayoutGet(page: import("@playwright/test").Page) {
  return page.waitForResponse(
    (response) =>
      response.request().method() === "GET" &&
      response.url().includes(DASHBOARD_LAYOUT_API_PATH),
    { timeout: 30_000 }
  );
}

test.describe("protected home dashboard", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      !hasE2EDevLoginCredentials(),
      "Set AFENDA_DEV_LOGIN_PASSWORD (min 8 chars) and run pnpm auth:bootstrap:dev"
    );
    testInfo.annotations.push({
      type: "fixture",
      description:
        "Requires pnpm db:bootstrap:local && pnpm auth:bootstrap:dev",
    });
  });

  test("signs in and renders the protected dashboard", async ({ page }) => {
    const { email, password } = resolveE2EDevLoginCredentials();

    const signInResponse = await page.request.post("/api/auth/sign-in/email", {
      data: { email, password },
    });
    expect(signInResponse.ok()).toBeTruthy();

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
    await expect(page).toHaveURL(/\/appshell-canvas(?:\?.*)?$/);
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
