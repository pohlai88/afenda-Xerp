import { existsSync } from "node:fs";
import { join } from "node:path";

import { expect } from "vitest";

import { ERP_SRC_ROOT } from "@/__tests__/support/erp-test-paths";
import { getAuthIngressSurfaceByPath } from "../../auth-ingress-surface.registry";
import {
  AUTH_PATH_LANE_MAP,
  resolveAuthShellVariantForPath,
} from "../../auth-path.registry";
import {
  AUTH_ROUTE_CATALOG,
  getAuthRouteCatalogEntryByPath,
} from "../../auth-route-catalog";
import { loadAuthIngressSurfacePage } from "../../load-auth-ingress-surface-page.server";

export function assertAuthRouteCatalogShellVariants(): void {
  for (const entry of AUTH_ROUTE_CATALOG) {
    expect(resolveAuthShellVariantForPath(entry.path)).toBe(entry.blockId);
  }
}

export function assertAuthRouteCatalogIngressSurfaces(): void {
  for (const entry of AUTH_ROUTE_CATALOG) {
    expect(getAuthIngressSurfaceByPath(entry.path)).toMatchObject({
      blockId: entry.blockId,
      path: entry.path,
      surfaceTemplateId: entry.surfaceTemplateId,
    });
    expect(getAuthRouteCatalogEntryByPath(entry.path)).toMatchObject({
      blockId: entry.blockId,
      lane: entry.lane,
      surfaceTemplateId: entry.surfaceTemplateId,
    });
  }
}

export function assertAuthRouteCatalogIngressPageLoads(): void {
  for (const entry of AUTH_ROUTE_CATALOG) {
    const data = loadAuthIngressSurfacePage(entry.path);

    expect(data.kind).toBe("ready");

    if (data.kind !== "ready") {
      continue;
    }

    expect(data.authShellBlockId).toBe(entry.blockId);
    expect(data.path).toBe(entry.path);
    expect(data.lane).toBe(AUTH_PATH_LANE_MAP[entry.path]);
    expect(data.surface.surfaceTemplate.surfaceTemplateId).toBe(
      entry.surfaceTemplateId
    );
    expect(data.surface.slotHydration?.blockId).toBe(entry.blockId);
  }
}

export function assertAuthRouteCatalogAppPagesExist(): void {
  const appRoot = join(ERP_SRC_ROOT, "app", "(auth)");

  for (const entry of AUTH_ROUTE_CATALOG) {
    const pagePath = join(appRoot, entry.path.replace(/^\//, ""), "page.tsx");
    expect(existsSync(pagePath)).toBe(true);
  }
}
