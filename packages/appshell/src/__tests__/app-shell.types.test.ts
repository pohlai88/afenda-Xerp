import { describe, expect, it } from "vitest";
import {
  type AppShellNavItemId,
  DEFAULT_NAV_ITEMS,
  DEFAULT_WORKSPACE_CONTEXT,
} from "../app-shell.types";

describe("@afenda/appshell types", () => {
  it("exports default navigation placeholders with stable ids", () => {
    expect(DEFAULT_NAV_ITEMS).toHaveLength(8);
    expect(DEFAULT_NAV_ITEMS.map((item) => item.id)).toEqual([
      "nexus",
      "manufacturing",
      "inventory",
      "sales",
      "accounting",
      "hrm",
      "projects",
      "system-admin",
    ] satisfies AppShellNavItemId[]);
    expect(DEFAULT_NAV_ITEMS.map((item) => item.label)).toEqual([
      "Nexus",
      "Manufacturing",
      "Inventory",
      "Sales",
      "Accounting",
      "HRM",
      "Projects",
      "System Admin",
    ]);
  });

  it("exports default workspace context placeholders", () => {
    expect(DEFAULT_WORKSPACE_CONTEXT).toEqual({
      tenant: "Demo Tenant",
      company: "Demo Company",
      organization: "Demo Organization",
    });
  });
});
