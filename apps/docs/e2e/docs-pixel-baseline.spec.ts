import { expect, test } from "@afenda/testing/e2e/playwright-base";

const USE_ERP_ROUTE = "/en/docs/use-erp";
const CARD_LINK = "#nd-page [data-card]";
const DOCS_HEADER = "banner";
const CARD_GRID_REGION = "#nd-page div:has(> a[data-card])";
const PAGE_CONTENT = "#nd-page";

async function applyDocsDarkTheme(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
  });
}

async function gotoUseErpCardGrid(page: import("@playwright/test").Page) {
  await page.goto(USE_ERP_ROUTE, { waitUntil: "domcontentloaded" });
  await expect(page.locator(CARD_LINK).first()).toBeVisible({ timeout: 30_000 });
}

test.describe("docs CSS theme pixel baselines", () => {
  test("@visual @pixel light — header chrome matches baseline", async ({
    page,
  }) => {
    await gotoUseErpCardGrid(page);
    const header = page.getByRole(DOCS_HEADER);
    await expect(header).toBeVisible({ timeout: 30_000 });
    await expect(header).toHaveScreenshot("use-erp-light-header.png");
  });

  test("@visual @pixel light — card grid matches baseline", async ({
    page,
  }) => {
    await gotoUseErpCardGrid(page);
    await expect(page.locator(CARD_GRID_REGION)).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.locator(CARD_GRID_REGION)).toHaveScreenshot(
      "use-erp-light-cards.png"
    );
  });

  test("@visual @pixel dark — page content matches baseline", async ({
    page,
  }) => {
    await gotoUseErpCardGrid(page);
    await applyDocsDarkTheme(page);
    await page.waitForTimeout(100);
    await expect(page.locator(PAGE_CONTENT)).toBeVisible({ timeout: 30_000 });
    await expect(page.locator(PAGE_CONTENT)).toHaveScreenshot(
      "use-erp-dark.png"
    );
  });
});
