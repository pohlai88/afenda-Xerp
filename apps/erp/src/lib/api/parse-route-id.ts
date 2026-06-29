import {
  type AssetId,
  type CompanyId,
  type CustomerId,
  type DocumentId,
  type EmployeeId,
  type ProductId,
  parseAssetId,
  parseCompanyId,
  parseCustomerId,
  parseDocumentId,
  parseEmployeeId,
  parseProductId,
  parseSupplierId,
  parseTenantId,
  parseWarehouseId,
  type SupplierId,
  type TenantId,
  type WarehouseId,
} from "@afenda/kernel";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

function parseRouteEnterpriseId<TBrand extends string>(input: {
  readonly field: string;
  readonly parse: (value: string) => TBrand;
  readonly value: string;
}): TBrand {
  if (input.value.trim().length === 0) {
    throw new ApiRouteError("validation_failed", `Invalid ${input.field}.`, {
      field: input.field,
    });
  }

  try {
    return input.parse(input.value);
  } catch {
    throw new ApiRouteError("validation_failed", `Invalid ${input.field}.`, {
      field: input.field,
    });
  }
}

export function parseRouteTenantId(value: string): TenantId {
  return parseRouteEnterpriseId({
    field: "tenantId",
    value,
    parse: parseTenantId,
  });
}

export function parseRouteCompanyId(value: string): CompanyId {
  return parseRouteEnterpriseId({
    field: "companyId",
    value,
    parse: parseCompanyId,
  });
}

export function parseRouteCustomerId(value: string): CustomerId {
  return parseRouteEnterpriseId({
    field: "customerId",
    value,
    parse: parseCustomerId,
  });
}

export function parseRouteSupplierId(value: string): SupplierId {
  return parseRouteEnterpriseId({
    field: "supplierId",
    value,
    parse: parseSupplierId,
  });
}

export function parseRouteProductId(value: string): ProductId {
  return parseRouteEnterpriseId({
    field: "productId",
    value,
    parse: parseProductId,
  });
}

export function parseRouteEmployeeId(value: string): EmployeeId {
  return parseRouteEnterpriseId({
    field: "employeeId",
    value,
    parse: parseEmployeeId,
  });
}

export function parseRouteWarehouseId(value: string): WarehouseId {
  return parseRouteEnterpriseId({
    field: "warehouseId",
    value,
    parse: parseWarehouseId,
  });
}

export function parseRouteDocumentId(value: string): DocumentId {
  return parseRouteEnterpriseId({
    field: "documentId",
    value,
    parse: parseDocumentId,
  });
}

export function parseRouteAssetId(value: string): AssetId {
  return parseRouteEnterpriseId({
    field: "assetId",
    value,
    parse: parseAssetId,
  });
}
