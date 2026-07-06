import type { AssertJsonSerializable } from "../contracts/json-wire.contract.js";
import { assertWireOptionalText } from "./_internal/wire-text.assert.js";
import { assertLegalEntityEffectiveDateRange } from "./legal-entity-context.assert.js";
import {
  PLATFORM_LIFECYCLE_STATUSES,
  type PlatformLifecycleStatus,
} from "./lifecycle.contract.js";
import type {
  OrganizationUnitType,
  OrganizationUnitWireContext,
} from "./organization-unit-context.contract.js";
import { ORGANIZATION_UNIT_TYPES } from "./organization-unit-context.contract.js";

type _OrganizationUnitWireSerializable =
  AssertJsonSerializable<OrganizationUnitWireContext>;

/** Compile-time guard — organization unit wire context must remain JSON-serializable. */
export type assertOrganizationUnitContextWireSerializable =
  _OrganizationUnitWireSerializable extends true ? true : never;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isPlatformLifecycleStatus(
  value: string
): value is PlatformLifecycleStatus {
  return (PLATFORM_LIFECYCLE_STATUSES as readonly string[]).includes(value);
}

export function isOrganizationUnitType(
  value: string
): value is OrganizationUnitType {
  return (ORGANIZATION_UNIT_TYPES as readonly string[]).includes(value);
}

export function assertOrganizationUnitContextText(
  value: string,
  label: string
): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export function assertOrganizationUnitContextOptionalText(
  value: string | null,
  label: string
): void {
  assertWireOptionalText(value, label);
}

export function assertOrganizationUnitContextSlug(value: string): void {
  if (!value.trim()) {
    throw new Error("slug is required.");
  }

  if (!SLUG_PATTERN.test(value)) {
    throw new Error(
      "slug must use lowercase letters, numbers, and single hyphen separators."
    );
  }
}

function assertOrganizationUnitWireContext(
  value: OrganizationUnitWireContext
): void {
  assertOrganizationUnitContextText(
    value.organizationUnitId,
    "organizationUnitId"
  );
  assertOrganizationUnitContextText(value.tenantId, "tenantId");
  assertOrganizationUnitContextText(value.companyId, "companyId");
  assertOrganizationUnitContextOptionalText(
    value.parentOrganizationUnitId,
    "parentOrganizationUnitId"
  );
  assertOrganizationUnitContextSlug(value.slug);
  assertOrganizationUnitContextText(value.displayName, "displayName");

  if (!isOrganizationUnitType(value.organizationUnitType)) {
    throw new Error(
      `organizationUnitType must be one of: ${ORGANIZATION_UNIT_TYPES.join(", ")}.`
    );
  }

  if (!isPlatformLifecycleStatus(value.status)) {
    throw new Error(
      `status must be one of: ${PLATFORM_LIFECYCLE_STATUSES.join(", ")}.`
    );
  }

  assertLegalEntityEffectiveDateRange(value.effectiveFrom, value.effectiveTo);
}

/**
 * JSON ingress guard — narrow unknown wire payloads, then run semantic asserts.
 * Fail closed before identity parse* branding.
 */
export function assertWireOrganizationUnitContext(
  value: unknown
): asserts value is OrganizationUnitWireContext {
  if (value === null || typeof value !== "object") {
    throw new Error("OrganizationUnitWireContext must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["organizationUnitId"] !== "string") {
    throw new Error("organizationUnitId must be a string.");
  }
  if (typeof record["tenantId"] !== "string") {
    throw new Error("tenantId must be a string.");
  }
  if (typeof record["companyId"] !== "string") {
    throw new Error("companyId must be a string.");
  }
  if (typeof record["slug"] !== "string") {
    throw new Error("slug must be a string.");
  }
  if (typeof record["displayName"] !== "string") {
    throw new Error("displayName must be a string.");
  }
  if (typeof record["organizationUnitType"] !== "string") {
    throw new Error("organizationUnitType must be a string.");
  }
  if (typeof record["status"] !== "string") {
    throw new Error("status must be a string.");
  }
  if (
    record["parentOrganizationUnitId"] !== null &&
    typeof record["parentOrganizationUnitId"] !== "string"
  ) {
    throw new Error("parentOrganizationUnitId must be a string or null.");
  }
  if (
    record["effectiveFrom"] !== null &&
    typeof record["effectiveFrom"] !== "string"
  ) {
    throw new Error("effectiveFrom must be a string or null.");
  }
  if (
    record["effectiveTo"] !== null &&
    typeof record["effectiveTo"] !== "string"
  ) {
    throw new Error("effectiveTo must be a string or null.");
  }

  assertOrganizationUnitWireContext(value as OrganizationUnitWireContext);
}
