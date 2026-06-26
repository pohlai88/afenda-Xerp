import type { AuthRoutesCatalog } from "../../apps/docs/src/lib/docs-product-catalog.contract.ts";
import { catalogOutputPath } from "./docs-catalog-paths.mts";
import { writeCatalogJson } from "./write-catalog-json.mts";

export async function exportAuthRoutesCatalog(
  outputPath = catalogOutputPath("auth-routes")
): Promise<AuthRoutesCatalog> {
  const registry = await import(
    "../../apps/erp/src/lib/auth/auth-path.registry.ts"
  );

  const catalog = {
    catalogId: "auth-routes",
    exportedAt: new Date().toISOString(),
    lanes: [...registry.AUTH_LANES],
    routes: registry.AUTH_SEGMENT_PATHS.map((path) => ({
      path,
      lane: registry.AUTH_PATH_LANE_MAP[path],
    })),
  } satisfies AuthRoutesCatalog;

  writeCatalogJson(outputPath, catalog);
  console.log(`[export:auth-routes] wrote ${outputPath} (${catalog.routes.length} routes)`);
  return catalog;
}
