import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

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
const registrySource = readFileSync(registryPath, "utf8");

const parseRegistryField = (fieldName: "heading" | "href" | "marker") =>
  [
    ...registrySource.matchAll(new RegExp(`${fieldName}:\\s*"([^"]+)"`, "g")),
  ].map((match) => match[1]);

const readSmokableRouteRegistry = (): readonly SmokableRoute[] => {
  const headings = parseRegistryField("heading");
  const hrefs = parseRegistryField("href");
  const markers = parseRegistryField("marker");

  return hrefs.map((href, index) => ({
    heading: headings[index] ?? "",
    href,
    marker: markers[index] ?? "",
  }));
};

const shellBannerText =
  "Sandbox route lab. Promotion-ready composition only; runtime authority remains in ERP.";
const routeExpectations = readSmokableRouteRegistry();
const rootRoute = routeExpectations[0];
const rootRouteLinkLabel = "Open canonical route";

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
});
