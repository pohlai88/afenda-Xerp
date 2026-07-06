export interface LabActionRouteRegistryEntry {
  actionId: string;
  filePath: string;
  routeId: string;
  routePath: string;
  summary: string;
}

/**
 * Governed allowlist for route-lab Server Actions (runtime-parity slice P2).
 * Governance fails when a governed-active route lacks a registered action file.
 */
export const labActionRouteRegistry = [
  {
    actionId: "settings.appearance.save-review-note",
    filePath:
      "(lab)/settings/appearance/_actions/save-appearance-review-note.server.ts",
    routeId: "settings.appearance",
    routePath: "/settings/appearance",
    summary:
      "Lab-only appearance review note — httpOnly cookie persistence without ERP user-settings authority.",
  },
] as const satisfies readonly LabActionRouteRegistryEntry[];
