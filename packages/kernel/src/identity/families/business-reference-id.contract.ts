/**
 * Business master-data enterprise IDs (CRM, HRM, inventory, finance reference).
 */

import { normalizeOptionalBrandedIdForWire } from "../wire/identity-wire.contract.js";
import {
  defineEnterpriseFamily,
  type EnterpriseBrand,
} from "./define-enterprise-family.js";

const customer = defineEnterpriseFamily("customer");
const supplier = defineEnterpriseFamily("supplier");
const product = defineEnterpriseFamily("product");
const employee = defineEnterpriseFamily("employee");
const warehouse = defineEnterpriseFamily("warehouse");
const document = defineEnterpriseFamily("document");
const asset = defineEnterpriseFamily("asset");

export type CustomerId = EnterpriseBrand<"customer">;
export type SupplierId = EnterpriseBrand<"supplier">;
export type ProductId = EnterpriseBrand<"product">;
export type EmployeeId = EnterpriseBrand<"employee">;
export type WarehouseId = EnterpriseBrand<"warehouse">;
export type DocumentId = EnterpriseBrand<"document">;
export type AssetId = EnterpriseBrand<"asset">;

export const parseCustomerId = customer.parse;
export const parseOptionalCustomerId = customer.parseOptional;
export const createCustomerId = customer.create;
export const toCustomerId = customer.to;

export const parseSupplierId = supplier.parse;
export const parseOptionalSupplierId = supplier.parseOptional;
export const createSupplierId = supplier.create;
export const toSupplierId = supplier.to;

export const parseProductId = product.parse;
export const parseOptionalProductId = product.parseOptional;
export const createProductId = product.create;
export const toProductId = product.to;

export const parseEmployeeId = employee.parse;
export const parseOptionalEmployeeId = employee.parseOptional;
export const createEmployeeId = employee.create;
export const toEmployeeId = employee.to;

export const parseWarehouseId = warehouse.parse;
export const parseOptionalWarehouseId = warehouse.parseOptional;
export const createWarehouseId = warehouse.create;
export const toWarehouseId = warehouse.to;

export const parseDocumentId = document.parse;
export const parseOptionalDocumentId = document.parseOptional;
export const createDocumentId = document.create;
export const toDocumentId = document.to;

export const parseAssetId = asset.parse;
export const parseOptionalAssetId = asset.parseOptional;
export const createAssetId = asset.create;
export const toAssetId = asset.to;

export function normalizeCustomerIdForWire(
  value: string | CustomerId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toCustomerId);
}

export function normalizeSupplierIdForWire(
  value: string | SupplierId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toSupplierId);
}

export function normalizeProductIdForWire(
  value: string | ProductId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toProductId);
}

export function normalizeEmployeeIdForWire(
  value: string | EmployeeId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toEmployeeId);
}

export function normalizeWarehouseIdForWire(
  value: string | WarehouseId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toWarehouseId);
}

export function normalizeDocumentIdForWire(
  value: string | DocumentId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toDocumentId);
}

export function normalizeAssetIdForWire(
  value: string | AssetId | null | undefined
): string | null {
  return normalizeOptionalBrandedIdForWire(value, toAssetId);
}
