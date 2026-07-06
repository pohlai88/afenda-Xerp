import { expect, type Page, test } from "@playwright/test";

const developerThemeStorageKey = "afenda-studio-v2-theme";

const proofRouteHref = "/design-system/v2-proof";

const collectRouteRuntimeErrors = (page: Page) => {
  const runtimeErrors: string[] = [];

  page.on("pageerror", (error) => {
    runtimeErrors.push(`pageerror: ${error.message}`);
  });

  page.on("console", (message) => {
    if (message.type() === "error") {
      runtimeErrors.push(`console.error: ${message.text()}`);
    }
  });

  return runtimeErrors;
};

test.describe("Phase 8 V2 proof route @smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((storageKey) => {
      window.localStorage.removeItem(storageKey);
    }, developerThemeStorageKey);
  });

  test("renders consumer proof surfaces through public exports", async ({
    page,
  }) => {
    await page.goto(proofRouteHref);

    await expect(
      page.getByText("V2 design system consumer proof")
    ).toBeVisible();
    await expect(page.getByText("Phase 8 V2 consumer proof")).toBeVisible();
    await expect(page.getByText("Page surface pattern")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Open records" })
    ).toBeVisible();
    await expect(page.getByText("Active backlog")).toBeVisible();
    await expect(page.getByText("Record form")).toBeVisible();
    await expect(page.getByText("Archive record?")).toBeVisible();
    await expect(page.getByText("Workspace settings")).toBeVisible();
    await expect(page.getByText("Evidence checkpoint")).toBeVisible();
    await expect(page.getByLabel("Theme customizer")).toBeVisible();
    await expect(page.locator('[data-proof="import-law"]')).toBeVisible();
  });

  test("supports light/dark mode and editorial theme selection", async ({
    page,
  }) => {
    await page.goto(proofRouteHref);

    const themeState = page.locator('[data-proof="theme-state"]');
    await expect(themeState).toHaveAttribute("data-theme-id", "afenda-brand");

    await page.getByLabel("Toggle color mode").click();
    await expect(themeState).not.toHaveAttribute("data-mode", "system");

    await page.getByRole("combobox", { name: "Theme" }).click();
    await page.getByRole("option", { name: "Swiss Noir" }).click();
    await expect(themeState).toHaveAttribute("data-theme-id", "swiss-noir");

    await page.getByRole("combobox", { name: "Theme" }).click();
    await page.getByRole("option", { name: "Verdant Noir" }).click();
    await expect(themeState).toHaveAttribute("data-theme-id", "verdant-noir");

    await page.getByRole("combobox", { name: "Theme" }).click();
    await page.getByRole("option", { name: "shadcn Default" }).click();
    await expect(themeState).toHaveAttribute("data-theme-id", "shadcn-default");
  });

  test("keeps the proof route free of browser runtime errors", async ({
    page,
  }) => {
    const runtimeErrors = collectRouteRuntimeErrors(page);

    await page.goto(proofRouteHref);
    await page.getByText("V2 design system consumer proof").waitFor();

    expect(runtimeErrors).toEqual([]);
  });

  test("does not emit hydration mismatch console errors", async ({ page }) => {
    const runtimeErrors = collectRouteRuntimeErrors(page);

    await page.goto(proofRouteHref);
    await page.locator('[data-proof="theme-state"]').waitFor();

    const hydrationErrors = runtimeErrors.filter((entry) =>
      /hydration/i.test(entry)
    );

    expect(hydrationErrors).toEqual([]);
  });
});
