/**
 * Index naming policy for PAS §4.1 split-ID persistence (Supabase btree guidance).
 */

export function enterpriseIdUniqueIndexName(tableName: string): string {
  return `${tableName}_enterprise_id_unique`;
}

export function tenantHumanReferenceUniqueIndexName(
  tableName: string,
  columnName: string
): string {
  return `${tableName}_tenant_${columnName}_unique`;
}

export function tenantForeignKeyIndexName(
  tableName: string,
  columnName = "tenant_id"
): string {
  return `${tableName}_${columnName}_idx`;
}

/** @deprecated Slice C pilot tables — use LIVE_PLATFORM_ENTITY_TABLES */
export const PILOT_ENTERPRISE_ID_TABLES = ["tenants", "products"] as const;
