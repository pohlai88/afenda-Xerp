import { describe, expect, it } from "vitest";
import type {
  AppShellNavItemSerializable,
  ManifestNavModuleEntry,
} from "../../contracts/navigation.contract.js";
import {
  buildHydratedManifestNavigation,
  buildManifestNavigation,
  hasManifestModuleAccess,
  hydrateManifestNavigation,
  isManifestModuleId,
} from "../build-nav-from-manifest";

/** Fixture aligned with @afenda/entitlements ERP_MODULE_MANIFEST (Slice 1). */
const manifestNavFixture = [
  {
    moduleId: "workspace",
    label: "Workspace",
    routePath: "/modules/workspace",
    permissionKey: "workspace.dashboard_read",
  },
  {
    moduleId: "accounting",
    label: "Accounting",
    routePath: "/modules/accounting",
    permissionKey: "accounting.journal_read",
  },
  {
    moduleId: "hrm",
    label: "HRM",
    routePath: "/modules/hrm",
    permissionKey: "hr.employee_read",
  },
  {
    moduleId: "inventory",
    label: "Inventory",
    routePath: "/modules/inventory",
    permissionKey: "inventory.stock_adjust",
  },
  {
    moduleId: "sales",
    label: "Sales",
    routePath: "/modules/sales",
    permissionKey: "finance.invoices_read",
  },
] as const satisfies readonly ManifestNavModuleEntry[];

describe("buildManifestNavigation", () => {
  it("shows HRM when the user has RBAC permission for module access", () => {
    const granted = new Set<string>(["hr.employee_read"]);
    const navigation = buildManifestNavigation({
      modules: manifestNavFixture,
      grantedPermissionKeys: granted,
    });

    expect(navigation).toEqual([
      {
        icon: "users",
        label: "HRM",
        href: "/modules/hrm",
      },
    ]);
  });

  it("hides HRM when RBAC permission is missing", () => {
    const granted = new Set<string>(["accounting.journal_read"]);
    const navigation = buildManifestNavigation({
      modules: manifestNavFixture,
      grantedPermissionKeys: granted,
    });

    expect(
      navigation.map((item: AppShellNavItemSerializable) => item.label)
    ).not.toContain("HRM");
    expect(
      navigation.map((item: AppShellNavItemSerializable) => item.label)
    ).toEqual(["Accounting"]);
  });

  it("returns serializable navigation items without React elements", () => {
    const granted = new Set<string>([
      "workspace.dashboard_read",
      "hr.employee_read",
    ]);
    const navigation = buildManifestNavigation({
      modules: manifestNavFixture,
      grantedPermissionKeys: granted,
    });

    for (const item of navigation) {
      expect(typeof item.icon).toBe("string");
      expect(typeof item.label).toBe("string");
      expect(typeof item.href).toBe("string");
    }
  });

  it("hydrates manifest navigation into ApplicationShell menu items", () => {
    const granted = new Set<string>(["hr.employee_read"]);
    const hydrated = hydrateManifestNavigation(
      buildManifestNavigation({
        modules: manifestNavFixture,
        grantedPermissionKeys: granted,
      })
    );

    expect(hydrated).toHaveLength(1);
    expect(hydrated[0]?.label).toBe("HRM");
    expect(hydrated[0]?.href).toBe("/modules/hrm");
    expect(hydrated[0]?.icon).toBeDefined();
  });

  it("produces ApplicationShell-ready navigation pages from manifest rows", () => {
    const navigationPages = buildHydratedManifestNavigation({
      modules: manifestNavFixture,
      grantedPermissionKeys: new Set<string>(["hr.employee_read"]),
    });

    expect(navigationPages).toHaveLength(1);
    expect(navigationPages[0]).toMatchObject({
      label: "HRM",
      href: "/modules/hrm",
    });
    expect(navigationPages[0]?.icon).toBeDefined();
    expect(navigationPages.some((page) => page.label === "Accounting")).toBe(
      false
    );
  });

  it("evaluates manifest module access via permission key membership", () => {
    const granted = new Set<string>(["finance.invoices_read"]);

    expect(hasManifestModuleAccess("finance.invoices_read", granted)).toBe(
      true
    );
    expect(hasManifestModuleAccess("hr.employee_read", granted)).toBe(false);
  });

  it("recognizes governed manifest module identifiers", () => {
    expect(isManifestModuleId("hrm")).toBe(true);
    expect(isManifestModuleId("unknown-module")).toBe(false);
  });
});
