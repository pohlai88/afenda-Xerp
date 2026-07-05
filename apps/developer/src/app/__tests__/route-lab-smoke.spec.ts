import { expect, test } from "@playwright/test";

const routeExpectations = [
  {
    href: "/",
    heading: "ERP-parity route composition without ERP runtime authority.",
    marker: "Controlling doctrine",
  },
  {
    href: "/dashboard/sales",
    heading: "Sales command surface",
    marker: "Canonical Route Pattern",
  },
  {
    href: "/dashboard/finance",
    heading: "Finance readiness view",
    marker: "Secondary Route Pattern",
  },
  {
    href: "/admin/users",
    heading: "User directory review surface",
    marker: "Operator List Surface",
  },
  {
    href: "/settings/appearance",
    heading: "Appearance settings review",
    marker: "Theme Surface",
  },
] as const;

test.describe("Developer route lab smoke @smoke", () => {
  for (const route of routeExpectations) {
    test(`renders ${route.href}`, async ({ page }) => {
      await page.goto(route.href);

      await expect(page.getByText(route.heading)).toBeVisible();
      await expect(page.getByText(route.marker)).toBeVisible();
    });
  }
});
