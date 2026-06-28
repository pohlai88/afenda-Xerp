import {
  isPermissionGrantScopeType,
  type PermissionGrantElevationFlags,
} from "./permission-grant-vocabulary.contract.js";
import type { PermissionScopeWireContext } from "./permission-scope-context.contract.js";

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _PermissionScopeWireSerializable =
  AssertJsonSerializable<PermissionScopeWireContext>;

/** Compile-time guard — permission scope wire context must remain JSON-serializable. */
export type assertPermissionScopeContextWireSerializable =
  _PermissionScopeWireSerializable extends true ? true : never;

/** Back-compat alias for existing kernel/permissions compile-time guards. */
export type assertPermissionScopeContextJsonSerializable =
  assertPermissionScopeContextWireSerializable;

const ELEVATION_KEYS = [
  "consolidationView",
  "crossCompany",
  "minorityInterestCompany",
  "platformAdmin",
] as const satisfies readonly (keyof PermissionGrantElevationFlags)[];

export function assertPermissionScopeContextText(
  value: string,
  label: string
): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export function assertPermissionScopeContextOptionalText(
  value: string | null,
  label: string
): void {
  if (value !== null && !value.trim()) {
    throw new Error(`${label} must be null or a non-empty string.`);
  }
}

function assertPermissionGrantElevationFlags(
  value: unknown
): asserts value is PermissionGrantElevationFlags {
  if (value === null || typeof value !== "object") {
    throw new Error("elevations must be an object.");
  }

  const record = value as Record<string, unknown>;

  for (const key of ELEVATION_KEYS) {
    if (typeof record[key] !== "boolean") {
      throw new Error(`elevations.${key} must be a boolean.`);
    }
  }
}

function assertPermissionScopeWireContext(
  value: PermissionScopeWireContext
): void {
  if (!isPermissionGrantScopeType(value.grantScopeType)) {
    throw new Error(
      "grantScopeType must be one of the permission grant scope types."
    );
  }

  assertPermissionScopeContextText(value.tenantId, "tenantId");
  assertPermissionScopeContextText(value.membershipId, "membershipId");
  assertPermissionScopeContextText(value.roleId, "roleId");
  assertPermissionScopeContextOptionalText(
    value.entityGroupId,
    "entityGroupId"
  );
  assertPermissionScopeContextOptionalText(value.companyId, "companyId");
  assertPermissionScopeContextOptionalText(
    value.organizationId,
    "organizationId"
  );
  assertPermissionScopeContextOptionalText(value.teamId, "teamId");
  assertPermissionScopeContextOptionalText(value.projectId, "projectId");
  assertPermissionGrantElevationFlags(value.elevations);
}

/**
 * JSON ingress guard — narrow unknown wire payloads, then run semantic asserts.
 * Fail closed before identity parse* branding.
 */
export function assertWirePermissionScopeContext(
  value: unknown
): asserts value is PermissionScopeWireContext {
  if (value === null || typeof value !== "object") {
    throw new Error("PermissionScopeWireContext must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["grantScopeType"] !== "string") {
    throw new Error("grantScopeType must be a string.");
  }
  if (typeof record["tenantId"] !== "string") {
    throw new Error("tenantId must be a string.");
  }
  if (typeof record["membershipId"] !== "string") {
    throw new Error("membershipId must be a string.");
  }
  if (typeof record["roleId"] !== "string") {
    throw new Error("roleId must be a string.");
  }
  if (
    record["entityGroupId"] !== null &&
    typeof record["entityGroupId"] !== "string"
  ) {
    throw new Error("entityGroupId must be a string or null.");
  }
  if (record["companyId"] !== null && typeof record["companyId"] !== "string") {
    throw new Error("companyId must be a string or null.");
  }
  if (
    record["organizationId"] !== null &&
    typeof record["organizationId"] !== "string"
  ) {
    throw new Error("organizationId must be a string or null.");
  }
  if (record["teamId"] !== null && typeof record["teamId"] !== "string") {
    throw new Error("teamId must be a string or null.");
  }
  if (record["projectId"] !== null && typeof record["projectId"] !== "string") {
    throw new Error("projectId must be a string or null.");
  }

  assertPermissionGrantElevationFlags(record["elevations"]);

  assertPermissionScopeWireContext(value as PermissionScopeWireContext);
}
