import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";

// Smoke SSOT: src/lib/lab/route-surface-registry.ts

interface SmokableRoute {
  heading: string;
  href: string;
  marker: string;
}

const appRoot = process.cwd().endsWith(path.join("apps", "developer"))
  ? process.cwd()
  : path.resolve(process.cwd(), "apps", "developer");
const registryPath = path.resolve(
  appRoot,
  "src",
  "lib",
  "lab",
  "route-surface-registry.ts"
);

const readSmokableRouteRegistry = (): readonly SmokableRoute[] => {
  const registrySource = readFileSync(registryPath, "utf8");

  return [
    ...registrySource.matchAll(
      /heading:\s*"([^"]+)"[\s\S]*?href:\s*"([^"]+)"[\s\S]*?marker:\s*"([^"]+)"/g
    ),
  ].map((match) => ({
    heading: match[1] ?? "",
    href: match[2] ?? "",
    marker: match[3] ?? "",
  }));
};

const routeExpectations = readSmokableRouteRegistry();
const rootRoute = routeExpectations[0];
const rootRouteLinkLabel = "Open canonical route";
const routeAcceptanceViewports = [
  { height: 900, label: "desktop", width: 1440 },
  { height: 844, label: "mobile", width: 390 },
] as const;

const assertNoHorizontalOverflow = async (page: Page) => {
  const overflow = await page.evaluate(() => ({
    bodyClientWidth: document.body.clientWidth,
    bodyScrollWidth: document.body.scrollWidth,
    documentClientWidth: document.documentElement.clientWidth,
    documentScrollWidth: document.documentElement.scrollWidth,
  }));

  expect(overflow.documentScrollWidth).toBeLessThanOrEqual(
    overflow.documentClientWidth + 1
  );
  expect(overflow.bodyScrollWidth).toBeLessThanOrEqual(
    overflow.bodyClientWidth + 1
  );
};

const assertAccessibleInteractiveNames = async (page: Page) => {
  const unnamedInteractiveElements = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a, button"))
      .filter((element) => {
        const accessibleName =
          element.getAttribute("aria-label") ??
          element.getAttribute("title") ??
          element.textContent;

        return !accessibleName?.trim();
      })
      .map((element) => element.outerHTML)
  );

  expect(unnamedInteractiveElements).toEqual([]);
};

const assertImagesHaveAltText = async (page: Page) => {
  const imagesWithoutAlt = await page.evaluate(() =>
    Array.from(document.images)
      .filter((image) => !image.hasAttribute("alt"))
      .map((image) => image.currentSrc || image.src)
  );

  expect(imagesWithoutAlt).toEqual([]);
};

const assertKeyboardFocusReachesVisibleElement = async (page: Page) => {
  await page.keyboard.press("Tab");

  const focusState = await page.evaluate(() => {
    const element = document.activeElement;

    if (!(element instanceof HTMLElement) || element === document.body) {
      return { height: 0, tagName: element?.tagName ?? "", width: 0 };
    }

    const rect = element.getBoundingClientRect();

    return {
      height: rect.height,
      tagName: element.tagName,
      width: rect.width,
    };
  });

  expect(focusState.tagName).not.toBe("");
  expect(focusState.width).toBeGreaterThan(0);
  expect(focusState.height).toBeGreaterThan(0);
};

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

const shellBannerText =
  "Sandbox route lab. Promotion-ready composition only; runtime authority remains in ERP.";
test.describe("Developer route lab acceptance @smoke", () => {
  for (const route of routeExpectations) {
    test(`proves route acceptance for ${route.href}`, async ({ page }) => {
      await page.goto(route.href);

      await expect(
        page.getByRole("heading", {
          level: 1,
          name: route.heading,
        })
      ).toBeVisible();
      await expect(page.getByText(route.marker, { exact: true })).toBeVisible();

      if (route.href !== "/") {
        await expect(
          page.getByRole("heading", {
            level: 2,
            name: "Afenda Route Lab",
          })
        ).toBeVisible();
        await expect(page.getByText(shellBannerText)).toBeVisible();
      }
    });
  }

  test("exposes stable route entry links from the root route", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: rootRoute.heading,
      })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: rootRouteLinkLabel })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: rootRouteLinkLabel })
    ).toHaveAttribute("href", "/dashboard/sales");
    await expect(
      page.getByRole("link", { name: "Review theme surface" })
    ).toHaveAttribute("href", "/settings/appearance");
  });

  test("exposes route-lab doctrine on the root route", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: rootRoute.heading,
      })
    ).toBeVisible();
    await expect(
      page.getByText("apps/developer proves ERP frontend shape.")
    ).toBeVisible();
    await expect(
      page.getByText("apps/erp owns ERP runtime authority.")
    ).toBeVisible();
    await expect(
      page.getByText(
        "Promotion replaces data authority, not route composition."
      )
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: /Abstract blueprint/i })
    ).toBeVisible();
  });

  test("keeps route acceptance frontend-only without runtime error boundaries", async ({
    page,
  }) => {
    test.slow();

    for (const route of routeExpectations) {
      await page.goto(route.href);
      await expect(page.getByText("Something went wrong")).toHaveCount(0);
      await expect(
        page.getByText("runtime authority remains in ERP")
      ).toHaveCount(route.href === "/" ? 0 : 1);
    }
  });

  test("keeps registered routes free of browser runtime errors", async ({
    page,
  }) => {
    test.slow();

    const runtimeErrors = collectRouteRuntimeErrors(page);

    for (const route of routeExpectations) {
      await page.goto(route.href);
      await page
        .getByRole("heading", { level: 1, name: route.heading })
        .waitFor();
    }

    expect(runtimeErrors).toEqual([]);
  });

  test("exposes the appearance lab review-note Server Action surface", async ({
    page,
  }) => {
    await page.goto("/settings/appearance");

    await expect(
      page.getByText("Lab review note", { exact: true })
    ).toBeVisible();
    await expect(page.getByLabel("Review note")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save review note" })
    ).toBeVisible();
  });

  test("renders the explicit root not-found surface for unmatched URLs", async ({
    page,
  }) => {
    await page.goto("/route-lab-missing-surface");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Route-lab surface not found",
      })
    ).toBeVisible();
    await expect(
      page.getByText(
        "The requested URL does not match a governed route-lab surface."
      )
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Return to route lab index" })
    ).toHaveAttribute("href", "/");
    await expect(
      page.getByRole("link", { name: "Open canonical route" })
    ).toHaveAttribute("href", "/dashboard/sales");
  });

  for (const viewport of routeAcceptanceViewports) {
    test(`proves accessibility and visual layout acceptance on ${viewport.label}`, async ({
      page,
    }) => {
      await page.setViewportSize({
        height: viewport.height,
        width: viewport.width,
      });

      for (const route of routeExpectations) {
        await page.goto(route.href);

        await expect(page.locator("main").first()).toBeVisible();
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        await assertAccessibleInteractiveNames(page);
        await assertImagesHaveAltText(page);
        await assertNoHorizontalOverflow(page);
        await assertKeyboardFocusReachesVisibleElement(page);
      }
    });
  }
});
