export interface LabApiRouteRegistryEntry {
  dynamic: "auto" | "force-dynamic";
  filePath: string;
  method: "GET";
  path: string;
  revalidate?: number;
  routeId: string;
  runtime: "nodejs";
  summary: string;
}

/**
 * Governed allowlist for route-lab Route Handlers (runtime-parity slice P1).
 * Governance fails on any `route.ts` under `src/app/api/**` not listed here.
 */
export const labApiRouteRegistry = [
  {
    dynamic: "auto",
    filePath: "api/lab/v1/health/route.ts",
    method: "GET",
    path: "/api/lab/v1/health",
    revalidate: 30,
    routeId: "lab.v1.health.get",
    runtime: "nodejs",
    summary:
      "Route-lab liveness probe — frontend-only; no auth, tenant, or ERP runtime authority.",
  },
] as const satisfies readonly LabApiRouteRegistryEntry[];

export const labApiRouteRegistryPaths = labApiRouteRegistry.map(
  (entry) => entry.path
);
