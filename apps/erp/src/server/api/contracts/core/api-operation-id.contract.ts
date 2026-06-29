/**
 * PAS-API-001 API-001 — cross-style operation identity (family layer).
 * Style-agnostic; REST/OpenAPI projection lives in binding PAS only.
 */

declare const apiOperationIdBrand: unique symbol;

export type Brand<TValue, TBrand extends string> = TValue & {
  readonly [apiOperationIdBrand]: TBrand;
};

/** Branded operation identity — produced only via {@link parseApiOperationId}. */
export type ApiOperationId = Brand<string, "ApiOperationId">;

/**
 * Dotted lowercase identity: `{namespace}.{version}.{resource...}.{verb}`.
 * Hyphens allowed in segments (e.g. `dashboard-layout`, `audit-events`).
 */
const API_OPERATION_ID_PATTERN =
  /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+\.(get|post|put|patch|delete)$/;

export function isValidApiOperationIdFormat(value: string): boolean {
  return API_OPERATION_ID_PATTERN.test(value);
}

/** Trust boundary — validate wire/registry string before branding. */
export function parseApiOperationId(value: string): ApiOperationId {
  if (!isValidApiOperationIdFormat(value)) {
    throw new Error(`Invalid ApiOperationId format: ${value}`);
  }
  return value as ApiOperationId;
}

export function unbrandApiOperationId(value: ApiOperationId): string {
  return value;
}

export function assertUniqueApiOperationIds(ids: readonly string[]): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (!isValidApiOperationIdFormat(id)) {
      throw new Error(`Invalid ApiOperationId format in registry: ${id}`);
    }
    if (seen.has(id)) {
      throw new Error(`Duplicate ApiOperationId in registry: ${id}`);
    }
    seen.add(id);
  }
}
