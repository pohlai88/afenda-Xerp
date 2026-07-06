import type { LabCacheKind } from "./lab-cache-policy";

export interface LabCacheRouteRegistryEntry {
  cacheKind: LabCacheKind;
  loaderPath: string;
  routeId: string;
  routePath: string;
  summary: string;
}

/**
 * Governed cache posture for route-lab surfaces (runtime-parity slice P3).
 */
export const labCacheRouteRegistry = [
  {
    cacheKind: "static-lab-index",
    loaderPath: "app/page.tsx",
    routeId: "lab.index",
    routePath: "/",
    summary: "Root doctrine shell — no shared operator loader cache.",
  },
  {
    cacheKind: "operator-request-dynamic",
    loaderPath: "lib/lab/load-dashboard-sales-page.server.ts",
    routeId: "dashboard.sales",
    routePath: "/dashboard/sales",
    summary: "Sales operator route — React.cache per-request dedupe only.",
  },
  {
    cacheKind: "operator-request-dynamic",
    loaderPath: "lib/lab/load-dashboard-finance-page.server.ts",
    routeId: "dashboard.finance",
    routePath: "/dashboard/finance",
    summary: "Finance operator route — React.cache per-request dedupe only.",
  },
  {
    cacheKind: "operator-request-dynamic",
    loaderPath: "lib/lab/load-admin-users-page.server.ts",
    routeId: "admin.users",
    routePath: "/admin/users",
    summary: "Users operator route — React.cache per-request dedupe only.",
  },
  {
    cacheKind: "operator-request-dynamic",
    loaderPath: "lib/lab/load-settings-appearance-page.server.ts",
    routeId: "settings.appearance",
    routePath: "/settings/appearance",
    summary:
      "Appearance operator route — React.cache dedupe; cookie reads stay request-scoped.",
  },
  {
    cacheKind: "operator-request-dynamic",
    loaderPath: "lib/lab/load-architecture-map-page.server.ts",
    routeId: "architecture.integration.map",
    routePath: "/architecture",
    summary:
      "Integration Map — reads integration-graph.snapshot.json with per-request dedupe.",
  },
  {
    cacheKind: "operator-request-dynamic",
    loaderPath: "lib/lab/load-module-document-page.server.ts",
    routeId: "modules.procurement.requisition.document",
    routePath: "/modules/[moduleSlug]/[surface]/[documentId]",
    summary:
      "Module document route — React.cache dedupe keyed by route params.",
  },
  {
    cacheKind: "lab-health-revalidate",
    loaderPath: "app/api/lab/v1/health/route.ts",
    routeId: "lab.v1.health.get",
    routePath: "/api/lab/v1/health",
    summary:
      "Lab health handler — explicit revalidate 30, no operator payload.",
  },
] as const satisfies readonly LabCacheRouteRegistryEntry[];
