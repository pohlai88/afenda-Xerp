export interface LabBffRouteRegistryEntry {
  filePath: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  routeId: string;
  summary: string;
}

/**
 * Governed allowlist for route-lab BFF handlers (runtime-parity slice P5).
 * Empty by design — ADR-0039 excludes platform BFF routes from the sandbox.
 */
export const labBffRouteRegistry: readonly LabBffRouteRegistryEntry[] = [];

export const labBffRouteRegistryPaths: readonly string[] =
  labBffRouteRegistry.map((entry) => entry.path);
