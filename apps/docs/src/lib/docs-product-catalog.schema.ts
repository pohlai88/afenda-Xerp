import { readFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import {
  CATALOG_FILE_NAMES,
  CATALOG_IDS,
  type CatalogId,
  type ProductCatalog,
} from "@/lib/docs-product-catalog.contract";

const authRouteCatalogEntrySchema = z.object({
  path: z.string(),
  lane: z.string(),
});

export const authRoutesCatalogSchema = z.object({
  catalogId: z.literal("auth-routes"),
  exportedAt: z.string().min(1),
  lanes: z.array(z.string()),
  routes: z.array(authRouteCatalogEntrySchema),
});

const systemAdminSectionCatalogEntrySchema = z.object({
  sectionId: z.string(),
  label: z.string(),
  href: z.string(),
  readPermissionKey: z.string(),
});

export const systemAdminCatalogSchema = z.object({
  catalogId: z.literal("system-admin"),
  exportedAt: z.string().min(1),
  sections: z.array(systemAdminSectionCatalogEntrySchema),
});

const permissionCatalogEntrySchema = z.object({
  key: z.string(),
  domain: z.string(),
  action: z.string(),
});

export const permissionsCatalogSchema = z.object({
  catalogId: z.literal("permissions"),
  exportedAt: z.string().min(1),
  permissions: z.array(permissionCatalogEntrySchema),
});

const envCatalogEntrySchema = z.object({
  name: z.string(),
  section: z.string(),
  description: z.string().optional(),
  deprecated: z.boolean().optional(),
});

export const envCatalogSchema = z.object({
  catalogId: z.literal("env"),
  exportedAt: z.string().min(1),
  variables: z.array(envCatalogEntrySchema),
});

const moduleCatalogEntrySchema = z.object({
  moduleId: z.string(),
  label: z.string(),
  routePath: z.string(),
  permissionKey: z.string(),
  requiredEntitlements: z.array(z.string()),
  optionalCapabilities: z.array(z.string()),
});

export const modulesCatalogSchema = z.object({
  catalogId: z.literal("modules"),
  exportedAt: z.string().min(1),
  modules: z.array(moduleCatalogEntrySchema),
});

const productCatalogSchemaById = {
  "auth-routes": authRoutesCatalogSchema,
  "system-admin": systemAdminCatalogSchema,
  permissions: permissionsCatalogSchema,
  env: envCatalogSchema,
  modules: modulesCatalogSchema,
} satisfies Record<CatalogId, z.ZodType>;

function asValidatedProductCatalog(
  catalogId: CatalogId,
  parsed: z.infer<(typeof productCatalogSchemaById)[CatalogId]>
): ProductCatalog {
  if (parsed.catalogId !== catalogId) {
    throw new Error(
      `Catalog id mismatch: expected ${catalogId}, received ${String(parsed.catalogId)}`
    );
  }

  // Zod validates structure at the JSON trust boundary; cast aligns readonly
  // contract interfaces with Zod output under exactOptionalPropertyTypes.
  return parsed as ProductCatalog;
}

export function parseProductCatalog(
  catalogId: CatalogId,
  json: unknown
): ProductCatalog {
  const result = productCatalogSchemaById[catalogId].safeParse(json);

  if (!result.success) {
    throw new Error(
      `Invalid ${catalogId} catalog snapshot: ${result.error.message}`
    );
  }

  return asValidatedProductCatalog(catalogId, result.data);
}

const dataDir = join(process.cwd(), "data");

export function readProductCatalog(catalogId: CatalogId): ProductCatalog {
  const fileName = CATALOG_FILE_NAMES[catalogId];
  const raw = readFileSync(join(dataDir, fileName), "utf8");
  const json: unknown = JSON.parse(raw);

  return parseProductCatalog(catalogId, json);
}

export function assertCatalogIdsComplete(): void {
  for (const catalogId of CATALOG_IDS) {
    if (!(catalogId in productCatalogSchemaById)) {
      throw new Error(`Missing Zod schema for catalog id: ${catalogId}`);
    }
  }
}
