import { varchar } from "drizzle-orm/pg-core";

export type TenantHumanReferenceScope =
  | "employee_no"
  | "customer_no"
  | "supplier_no"
  | "sku"
  | "asset_no"
  | "document_no"
  | "warehouse_code";

export interface TenantHumanReferenceColumnOptions {
  readonly columnName?: TenantHumanReferenceScope | string;
  readonly length?: number;
}

/**
 * Tenant-scoped human reference column (ADR-0023).
 *
 * Uniqueness: composite `unique (tenant_id, <column>)` in schema — not global unique.
 * Not a PK, not an FK, not an RLS boundary.
 */
export function tenantHumanReferenceColumn(
  scope: TenantHumanReferenceScope,
  options: TenantHumanReferenceColumnOptions = {}
) {
  const columnName = options.columnName ?? scope;
  const length = options.length ?? defaultLengthForScope(scope);
  return varchar(columnName, { length }).notNull();
}

function defaultLengthForScope(scope: TenantHumanReferenceScope): number {
  switch (scope) {
    case "sku":
      return 64;
    case "warehouse_code":
      return 32;
    default:
      return 64;
  }
}
