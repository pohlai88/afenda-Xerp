import type { PermissionsCatalog } from "../../apps/docs/src/lib/docs-product-catalog.contract.ts";
import { catalogOutputPath } from "./docs-catalog-paths.mts";
import { writeCatalogJson } from "./write-catalog-json.mts";

function collectPermissionKeys(value: unknown, keys = new Set<string>()): Set<string> {
  if (typeof value === "string") {
    keys.add(value);
    return keys;
  }

  if (value && typeof value === "object") {
    for (const nested of Object.values(value)) {
      collectPermissionKeys(nested, keys);
    }
  }

  return keys;
}

function splitPermissionKey(key: string): { domain: string; action: string } {
  const [domain = "", action = ""] = key.split(".");
  return { domain, action };
}

export async function exportPermissionsCatalog(
  outputPath = catalogOutputPath("permissions")
): Promise<PermissionsCatalog> {
  const { PERMISSION_REGISTRY } = await import(
    "../../packages/permissions/src/grants/permission.contract.ts"
  );

  const permissions = [...collectPermissionKeys(PERMISSION_REGISTRY)]
    .sort((left, right) => left.localeCompare(right))
    .map((key) => ({
      key,
      ...splitPermissionKey(key),
    }));

  const catalog = {
    catalogId: "permissions",
    exportedAt: new Date().toISOString(),
    permissions,
  } satisfies PermissionsCatalog;

  writeCatalogJson(outputPath, catalog);
  console.log(
    `[export:permissions] wrote ${outputPath} (${catalog.permissions.length} keys)`
  );
  return catalog;
}
