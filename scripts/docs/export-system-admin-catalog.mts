import type { SystemAdminCatalog } from "../../apps/docs/src/lib/docs-product-catalog.contract.ts";
import { catalogOutputPath } from "./docs-catalog-paths.mts";
import { writeCatalogJson } from "./write-catalog-json.mts";

export async function exportSystemAdminCatalog(
  outputPath = catalogOutputPath("system-admin")
): Promise<SystemAdminCatalog> {
  const registry = await import(
    "../../apps/erp/src/lib/system-admin/system-admin-sections.ts"
  );

  const catalog = {
    catalogId: "system-admin",
    exportedAt: new Date().toISOString(),
    sections: registry.SYSTEM_ADMIN_SECTIONS.map((section) => ({
      sectionId: section.sectionId,
      label: section.label,
      href: section.href,
      readPermissionKey: section.readPermissionKey,
    })),
  } satisfies SystemAdminCatalog;

  writeCatalogJson(outputPath, catalog);
  console.log(
    `[export:system-admin] wrote ${outputPath} (${catalog.sections.length} sections)`
  );
  return catalog;
}
