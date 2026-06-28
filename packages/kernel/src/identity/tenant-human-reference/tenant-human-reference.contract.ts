/**
 * PAS §4.1.13 / ADR-0023 — tenant human reference types (not Kernel enterprise IDs).
 *
 * `emp_01JZ…` = {@link EmployeeId} (canonical enterprise ID)
 * `EMP-000123` = {@link EmployeeNo} (tenant human reference)
 *
 * Kernel classifies and parses human references at trust boundaries.
 * Kernel does **not** generate or allocate human reference numbers.
 */

import type { Brand } from "../brand/index.js";
import { unbrand } from "../brand/index.js";

/** ADR-0023 governed scopes — parity with `@afenda/database` tenant-human-reference registry. */
export const TENANT_HUMAN_REFERENCE_SCOPES = [
  "employee",
  "customer",
  "supplier",
  "sku",
  "asset",
  "document",
  "warehouse",
] as const satisfies readonly string[];

export type TenantHumanReferenceScope =
  (typeof TENANT_HUMAN_REFERENCE_SCOPES)[number];

export type TenantHumanReference<TScope extends TenantHumanReferenceScope> =
  Brand<string, `TenantHumanReference:${TScope}`>;

export type EmployeeNo = TenantHumanReference<"employee">;
export type CustomerNo = TenantHumanReference<"customer">;
export type SupplierNo = TenantHumanReference<"supplier">;
export type SkuNo = TenantHumanReference<"sku">;
export type AssetNo = TenantHumanReference<"asset">;
export type DocumentNo = TenantHumanReference<"document">;
export type WarehouseCode = TenantHumanReference<"warehouse">;

const MAX_TENANT_HUMAN_REFERENCE_LENGTH = 64;

export interface TenantHumanReferenceScopeDefinition<
  TScope extends TenantHumanReferenceScope,
> {
  readonly label: string;
  readonly normalizeForWire: (value: TenantHumanReference<TScope>) => string;
  readonly parse: (value: string) => TenantHumanReference<TScope>;
  readonly parseOptional: (
    value: string | null | undefined
  ) => TenantHumanReference<TScope> | null;
  readonly scope: TScope;
}

function defineTenantHumanReferenceScope<
  TScope extends TenantHumanReferenceScope,
>(scope: TScope, label: string): TenantHumanReferenceScopeDefinition<TScope> {
  function parse(value: string): TenantHumanReference<TScope> {
    const raw = value.trim();

    if (!raw) {
      throw new Error(`${label} is required.`);
    }

    if (raw.length > MAX_TENANT_HUMAN_REFERENCE_LENGTH) {
      throw new Error(`${label} must not exceed 64 characters.`);
    }

    return raw as TenantHumanReference<TScope>;
  }

  function parseOptional(
    value: string | null | undefined
  ): TenantHumanReference<TScope> | null {
    if (value == null) {
      return null;
    }

    return parse(value);
  }

  function normalizeForWire(value: TenantHumanReference<TScope>): string {
    return unbrand(value);
  }

  return {
    scope,
    label,
    parse,
    parseOptional,
    normalizeForWire,
  };
}

const employeeNoScope = defineTenantHumanReferenceScope(
  "employee",
  "Employee No"
);
const customerNoScope = defineTenantHumanReferenceScope(
  "customer",
  "Customer No"
);
const supplierNoScope = defineTenantHumanReferenceScope(
  "supplier",
  "Supplier No"
);
const skuNoScope = defineTenantHumanReferenceScope("sku", "SKU");
const assetNoScope = defineTenantHumanReferenceScope("asset", "Asset No");
const documentNoScope = defineTenantHumanReferenceScope(
  "document",
  "Document No"
);
const warehouseCodeScope = defineTenantHumanReferenceScope(
  "warehouse",
  "Warehouse Code"
);

export const TENANT_HUMAN_REFERENCE_SCOPE_DEFINITIONS = {
  employee: employeeNoScope,
  customer: customerNoScope,
  supplier: supplierNoScope,
  sku: skuNoScope,
  asset: assetNoScope,
  document: documentNoScope,
  warehouse: warehouseCodeScope,
} as const satisfies {
  readonly [K in TenantHumanReferenceScope]: TenantHumanReferenceScopeDefinition<K>;
};

/** @deprecated Prefer scoped parsers (`parseEmployeeNo`, …). */
export function parseTenantHumanReference<
  TScope extends TenantHumanReferenceScope,
>(value: string, label: string): TenantHumanReference<TScope> {
  const raw = value.trim();

  if (!raw) {
    throw new Error(`${label} is required.`);
  }

  if (raw.length > MAX_TENANT_HUMAN_REFERENCE_LENGTH) {
    throw new Error(`${label} must not exceed 64 characters.`);
  }

  return raw as TenantHumanReference<TScope>;
}

/** @deprecated Prefer scoped parsers (`parseOptionalEmployeeNo`, …). */
export function parseOptionalTenantHumanReference<
  TScope extends TenantHumanReferenceScope,
>(
  value: string | null | undefined,
  label: string
): TenantHumanReference<TScope> | null {
  if (value == null) {
    return null;
  }

  return parseTenantHumanReference<TScope>(value, label);
}

export const parseEmployeeNo = employeeNoScope.parse;
export const parseOptionalEmployeeNo = employeeNoScope.parseOptional;
export const normalizeEmployeeNoForWire = employeeNoScope.normalizeForWire;

export const parseCustomerNo = customerNoScope.parse;
export const parseOptionalCustomerNo = customerNoScope.parseOptional;
export const normalizeCustomerNoForWire = customerNoScope.normalizeForWire;

export const parseSupplierNo = supplierNoScope.parse;
export const parseOptionalSupplierNo = supplierNoScope.parseOptional;
export const normalizeSupplierNoForWire = supplierNoScope.normalizeForWire;

export const parseSkuNo = skuNoScope.parse;
export const parseOptionalSkuNo = skuNoScope.parseOptional;
export const normalizeSkuNoForWire = skuNoScope.normalizeForWire;

export const parseAssetNo = assetNoScope.parse;
export const parseOptionalAssetNo = assetNoScope.parseOptional;
export const normalizeAssetNoForWire = assetNoScope.normalizeForWire;

export const parseDocumentNo = documentNoScope.parse;
export const parseOptionalDocumentNo = documentNoScope.parseOptional;
export const normalizeDocumentNoForWire = documentNoScope.normalizeForWire;

export const parseWarehouseCode = warehouseCodeScope.parse;
export const parseOptionalWarehouseCode = warehouseCodeScope.parseOptional;
export const normalizeWarehouseCodeForWire =
  warehouseCodeScope.normalizeForWire;

export function normalizeTenantHumanReferenceForWire<
  TScope extends TenantHumanReferenceScope,
>(value: TenantHumanReference<TScope>): string {
  return unbrand(value);
}
