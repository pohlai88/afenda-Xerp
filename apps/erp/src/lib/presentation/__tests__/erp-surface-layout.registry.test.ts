import { describe, expect, it } from "vitest";

import {
  ERP_SURFACE_LAYOUT_REGISTRY,
  ERP_SURFACE_MCP_LAYOUT_CATALOG,
  getErpSurfaceLayoutByRoute,
  listErpSurfaceLayoutsByWave,
  listUnwiredErpSurfaceLayouts,
} from "@/lib/presentation/erp-surface-layout.registry";

describe("erp-surface-layout.registry", () => {
  it("maps all six layout formats to v2 views via MCP catalog", () => {
    expect(ERP_SURFACE_MCP_LAYOUT_CATALOG["page-shell"].v2View).toBe(
      "PageSurface"
    );
    expect(ERP_SURFACE_MCP_LAYOUT_CATALOG["data-list"].v2View).toBe(
      "DataTableSurface"
    );
    expect(ERP_SURFACE_MCP_LAYOUT_CATALOG["form-edit"].v2View).toBe(
      "FormSurface"
    );
    expect(ERP_SURFACE_MCP_LAYOUT_CATALOG.settings.v2View).toBe(
      "SettingsSurface"
    );
    expect(ERP_SURFACE_MCP_LAYOUT_CATALOG["metrics-row"].v2View).toBe(
      "MetricWidget"
    );
    expect(ERP_SURFACE_MCP_LAYOUT_CATALOG.evidence.v2View).toBe(
      "EvidenceWidget"
    );
  });

  it("registers wave-c system-admin cluster as wired", () => {
    const waveC = listErpSurfaceLayoutsByWave("wave-c");

    expect(waveC).toHaveLength(7);
    expect(waveC.every((entry) => entry.wired)).toBe(true);
    expect(waveC.map((entry) => entry.routePattern).sort()).toEqual(
      [
        "/system-admin/audit",
        "/system-admin/diagnostics",
        "/system-admin/memberships",
        "/system-admin/permissions",
        "/system-admin/roles",
        "/system-admin/settings",
        "/system-admin/users",
      ].sort()
    );
  });

  it("resolves layout fixtures by route pattern", () => {
    const users = getErpSurfaceLayoutByRoute("/system-admin/users");

    expect(users?.format).toBe("data-list");
    expect(users?.v2View).toBe("DataTableSurface");
    expect(users?.surfaceFixture.title).toBe("Users");
  });

  it("normalizes trailing slashes when resolving routes", () => {
    expect(
      getErpSurfaceLayoutByRoute("/system-admin/roles/")?.routePattern
    ).toBe("/system-admin/roles");
  });

  it("registers wave-d consumer proof routes as wired", () => {
    const waveD = listErpSurfaceLayoutsByWave("wave-d");

    expect(waveD).toHaveLength(3);
    expect(waveD.every((entry) => entry.wired)).toBe(true);
    expect(waveD.map((entry) => entry.routePattern).sort()).toEqual(
      [
        "/modules/procurement/readiness",
        "/settings/profile",
        "/standards/accounting-readiness",
      ].sort()
    );
  });

  it("lists deferred dynamic routes for next waves", () => {
    const unwired = listUnwiredErpSurfaceLayouts();

    expect(
      unwired.some((entry) => entry.routePattern === "/settings/profile")
    ).toBe(false);
    expect(
      unwired.some(
        (entry) => entry.routePattern === "/standards/accounting-readiness"
      )
    ).toBe(false);
    expect(
      unwired.some(
        (entry) => entry.routePattern === "/modules/procurement/readiness"
      )
    ).toBe(false);
    expect(
      unwired.some((entry) => entry.routePattern === "/modules/[moduleId]")
    ).toBe(true);
  });

  it("keeps registry entries unique by route pattern", () => {
    const patterns = ERP_SURFACE_LAYOUT_REGISTRY.map(
      (entry) => entry.routePattern
    );

    expect(new Set(patterns).size).toBe(patterns.length);
  });
});
