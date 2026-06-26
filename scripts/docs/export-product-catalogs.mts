import { exportAuthRoutesCatalog } from "./export-auth-routes-catalog.mts";
import { exportEnvCatalog } from "./export-env-catalog.mts";
import { exportModulesCatalog } from "./export-modules-catalog.mts";
import { exportPermissionsCatalog } from "./export-permissions-catalog.mts";
import { exportSystemAdminCatalog } from "./export-system-admin-catalog.mts";
import { catalogOutputPath } from "./docs-catalog-paths.mts";

export async function exportProductCatalogs(): Promise<void> {
  await exportAuthRoutesCatalog(catalogOutputPath("auth-routes"));
  await exportSystemAdminCatalog(catalogOutputPath("system-admin"));
  await exportPermissionsCatalog(catalogOutputPath("permissions"));
  await exportEnvCatalog(catalogOutputPath("env"));
  await exportModulesCatalog(catalogOutputPath("modules"));
}
