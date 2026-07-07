import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";

// Smoke SSOT: src/lib/lab/route-surface-registry.ts

interface SmokableRoute {
  heading: string;
  href: string;
  marker: string;
  routeProfile: "index" | "operator-lab" | "consumer-proof";
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
const developerThemeStorageKey = "afenda-studio-v2-theme";

const readSmokableRouteRegistry = (): readonly SmokableRoute[] => {
  const registrySource = readFileSync(registryPath, "utf8");
  const entryBlocks = [
    ...registrySource.matchAll(/\{\s*actionSeam:\s*"[^"]+"[\s\S]*?\n\s{2}\}/g),
  ];

  return entryBlocks
    .map((match) => {
      const block = match[0];

      return {
        heading: block.match(/heading:\s*"([^"]+)"/)?.[1] ?? "",
        href: block.match(/href:\s*"([^"]+)"/)?.[1] ?? "",
        marker: block.match(/marker:\s*"([^"]+)"/)?.[1] ?? "",
        routeProfile:
          (block.match(/routeProfile:\s*"([^"]+)"/)?.[1] as
            | SmokableRoute["routeProfile"]
            | undefined) ?? "operator-lab",
      };
    })
    .filter((route) => route.href.length > 0);
};

const assertRouteSurfaceVisible = async (page: Page, route: SmokableRoute) => {
  if (route.routeProfile === "consumer-proof") {
    await expect(page.getByText(route.heading, { exact: true })).toBeVisible();
    await expect(page.getByText(route.marker, { exact: true })).toBeVisible();
    return;
  }

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: route.heading,
    })
  ).toBeVisible();
  await expect(page.getByText(route.marker, { exact: true })).toBeVisible();
};

const waitForRouteSurface = async (page: Page, route: SmokableRoute) => {
  if (route.routeProfile === "consumer-proof") {
    await page.getByText(route.heading, { exact: true }).waitFor();
    return;
  }

  await page.getByRole("heading", { level: 1, name: route.heading }).waitFor();
};

const routeExpectations = readSmokableRouteRegistry();
const rootRoute =
  routeExpectations.find((route) => route.routeProfile === "index") ??
  routeExpectations[0];
const consumerProofRoutes = routeExpectations.filter(
  (route) => route.routeProfile === "consumer-proof"
);
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
test.describe("Developer app surface acceptance @smoke", () => {
  for (const route of routeExpectations) {
    test(`proves route acceptance for ${route.href}`, async ({ page }) => {
      await page.goto(route.href);

      await assertRouteSurfaceVisible(page, route);

      if (route.routeProfile === "operator-lab") {
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
      ).toHaveCount(route.routeProfile === "operator-lab" ? 1 : 0);
    }
  });

  test("keeps registered routes free of browser runtime errors", async ({
    page,
  }) => {
    test.slow();

    const runtimeErrors = collectRouteRuntimeErrors(page);

    for (const route of routeExpectations) {
      await page.goto(route.href);
      await waitForRouteSurface(page, route);
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

        if (route.routeProfile === "consumer-proof") {
          await expect(
            page.locator('[data-proof="v2-proof-root"]')
          ).toBeVisible();
        } else {
          await expect(page.locator("main").first()).toBeVisible();
        }

        if (route.routeProfile !== "consumer-proof") {
          await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        }

        await assertAccessibleInteractiveNames(page);
        await assertImagesHaveAltText(page);
        await assertNoHorizontalOverflow(page);
        await assertKeyboardFocusReachesVisibleElement(page);
      }
    });
  }

  test.describe("Consumer-proof profile", () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((storageKey) => {
        window.localStorage.removeItem(storageKey);
      }, developerThemeStorageKey);
    });

    for (const route of consumerProofRoutes) {
      test(`exposes theme customizer without runtime errors on ${route.href}`, async ({
        page,
      }) => {
        const runtimeErrors = collectRouteRuntimeErrors(page);

        await page.goto(route.href);
        await expect(page.getByLabel("Theme customizer")).toBeVisible();

        expect(runtimeErrors).toEqual([]);
      });

      test(`supports theme selection on ${route.href}`, async ({ page }) => {
        await page.goto(route.href);

        const themeState = page.locator('[data-proof="theme-state"]');
        await expect(themeState).toHaveAttribute(
          "data-theme-id",
          "afenda-brand"
        );

        await page.getByLabel("Toggle color mode").click();
        await expect(themeState).not.toHaveAttribute("data-mode", "system");

        await page.getByRole("combobox", { name: "Theme" }).click();
        await page.getByRole("option", { name: "Swiss Noir" }).click();
        await expect(themeState).toHaveAttribute("data-theme-id", "swiss-noir");
      });

      test(`does not emit hydration mismatch console errors on ${route.href}`, async ({
        page,
      }) => {
        const runtimeErrors = collectRouteRuntimeErrors(page);

        await page.goto(route.href);
        await page.locator('[data-proof="theme-state"]').waitFor();

        const hydrationErrors = runtimeErrors.filter((entry) =>
          /hydration/i.test(entry)
        );

        expect(hydrationErrors).toEqual([]);
      });
    }
  });
});
