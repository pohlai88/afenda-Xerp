import {
  type CustomerId,
  type EmployeeId,
  type ProductId,
  parseCustomerId,
  parseEmployeeId,
  parseProductId,
  parseTenantId,
  type TenantId,
} from "@afenda/kernel";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

function parseIngressEnterpriseId<T>(input: {
  readonly field: string;
  readonly parse: (value: string) => T;
  readonly value: string;
}): T {
  try {
    return input.parse(input.value);
  } catch (error: unknown) {
    const detail =
      error instanceof Error ? error.message : "Invalid enterprise ID format";
    throw new ApiRouteError("validation_failed", `Invalid ${input.field}.`, {
      field: input.field,
      reason: detail,
    });
  }
}

/** Parse untrusted route, query, header, or body tenant IDs before service logic. */
export function parseRouteTenantId(value: string): TenantId {
  return parseIngressEnterpriseId({
    field: "tenantId",
    parse: parseTenantId,
    value,
  });
}

/** Parse untrusted route, query, header, or body customer IDs before service logic. */
export function parseRouteCustomerId(value: string): CustomerId {
  return parseIngressEnterpriseId({
    field: "customerId",
    parse: parseCustomerId,
    value,
  });
}

/** Parse untrusted route, query, header, or body product IDs before service logic. */
export function parseRouteProductId(value: string): ProductId {
  return parseIngressEnterpriseId({
    field: "productId",
    parse: parseProductId,
    value,
  });
}

/** Parse untrusted route, query, header, or body employee IDs before service logic. */
export function parseRouteEmployeeId(value: string): EmployeeId {
  return parseIngressEnterpriseId({
    field: "employeeId",
    parse: parseEmployeeId,
    value,
  });
}
