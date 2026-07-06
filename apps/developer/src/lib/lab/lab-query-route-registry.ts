export interface LabQueryRouteRegistryEntry {
  filePath: string;
  queryId: string;
  routeId: string;
  routePath: string;
  summary: string;
}

/**
 * Governed allowlist for route-lab `_queries` read helpers (ADR-0044).
 * Governance fails when a governed-active route lacks a registered query file.
 */
export const labQueryRouteRegistry = [
  {
    queryId: "settings.appearance.review-note",
    filePath:
      "(lab)/settings/appearance/_queries/read-appearance-review-note.server.ts",
    routeId: "settings.appearance",
    routePath: "/settings/appearance",
    summary:
      "Lab-only appearance review note read — httpOnly cookie lookup without ERP user-settings readers.",
  },
] as const satisfies readonly LabQueryRouteRegistryEntry[];
