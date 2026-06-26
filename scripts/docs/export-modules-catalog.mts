import type { ModulesCatalog } from "../../apps/docs/src/lib/docs-product-catalog.contract.ts";
import { catalogOutputPath } from "./docs-catalog-paths.mts";
import { writeCatalogJson } from "./write-catalog-json.mts";

export async function exportModulesCatalog(
  outputPath = catalogOutputPath("modules")
): Promise<ModulesCatalog> {
  const registry = await import(
    "../../packages/entitlements/src/evaluation/feature-manifest.registry.ts"
  );

  const catalog = {
    catalogId: "modules",
    exportedAt: new Date().toISOString(),
    modules: registry.ERP_MODULE_MANIFEST.map((entry) => ({
      moduleId: entry.moduleId,
      label: entry.label,
      routePath: entry.routePath,
      permissionKey: entry.permissionKey,
      requiredEntitlements: [...entry.requiredEntitlements],
      optionalCapabilities: [...entry.optionalCapabilities],
    })),
  } satisfies ModulesCatalog;

  writeCatalogJson(outputPath, catalog);
  console.log(`[export:modules] wrote ${outputPath} (${catalog.modules.length} modules)`);
  return catalog;
}
