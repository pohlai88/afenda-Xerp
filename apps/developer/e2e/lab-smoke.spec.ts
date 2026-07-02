import { expect, test } from "@playwright/test";

const labRoutes = [
  { path: "/", heading: "Developer Route Lab", appShell: true },
  { path: "/dashboard/sales", heading: "Sales dashboard" },
  { path: "/dashboard/finance", heading: "Finance dashboard" },
  { path: "/admin/users", heading: "Users" },
  { path: "/settings/appearance", heading: "Appearance" },
] as const;

for (const route of labRoutes) {
  test(`@smoke ${route.path} renders demo lab without auth`, async ({
    page,
  }) => {
    await page.goto(route.path);
    await expect(
      page.getByText("Developer Route Lab — demo fixtures only")
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading })
    ).toBeVisible();
    if ("appShell" in route && route.appShell) {
      await expect(page.getByText("Afenda Route Lab")).toBeVisible();
    }
  });
}
