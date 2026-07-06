import type { AssertJsonSerializable } from "../contracts/json-wire.contract.js";
import { assertWireOptionalText } from "./_internal/wire-text.assert.js";
import type { EntityGroupWireContext } from "./entity-group-context.contract.js";
import {
  PLATFORM_LIFECYCLE_STATUSES,
  type PlatformLifecycleStatus,
} from "./lifecycle.contract.js";

type _EntityGroupWireSerializable =
  AssertJsonSerializable<EntityGroupWireContext>;

/** Compile-time guard — entity group wire context must remain JSON-serializable. */
export type assertEntityGroupContextWireSerializable =
  _EntityGroupWireSerializable extends true ? true : never;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isPlatformLifecycleStatus(
  value: string
): value is PlatformLifecycleStatus {
  return (PLATFORM_LIFECYCLE_STATUSES as readonly string[]).includes(value);
}

export function assertEntityGroupContextText(
  value: string,
  label: string
): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export function assertEntityGroupContextOptionalText(
  value: string | null,
  label: string
): void {
  assertWireOptionalText(value, label);
}

export function assertEntityGroupContextSlug(value: string): void {
  if (!value.trim()) {
    throw new Error("slug is required.");
  }

  if (!SLUG_PATTERN.test(value)) {
    throw new Error(
      "slug must use lowercase letters, numbers, and single hyphen separators."
    );
  }
}

function assertEntityGroupWireContext(value: EntityGroupWireContext): void {
  assertEntityGroupContextText(value.entityGroupId, "entityGroupId");
  assertEntityGroupContextText(value.tenantId, "tenantId");
  assertEntityGroupContextOptionalText(
    value.parentLegalEntityId,
    "parentLegalEntityId"
  );
  assertEntityGroupContextSlug(value.slug);
  assertEntityGroupContextText(value.displayName, "displayName");

  if (!isPlatformLifecycleStatus(value.status)) {
    throw new Error(
      `status must be one of: ${PLATFORM_LIFECYCLE_STATUSES.join(", ")}.`
    );
  }
}

/**
 * JSON ingress guard — narrow unknown wire payloads, then run semantic asserts.
 * Fail closed before identity parse* branding.
 */
export function assertWireEntityGroupContext(
  value: unknown
): asserts value is EntityGroupWireContext {
  if (value === null || typeof value !== "object") {
    throw new Error("EntityGroupWireContext must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["entityGroupId"] !== "string") {
    throw new Error("entityGroupId must be a string.");
  }
  if (typeof record["tenantId"] !== "string") {
    throw new Error("tenantId must be a string.");
  }
  if (typeof record["slug"] !== "string") {
    throw new Error("slug must be a string.");
  }
  if (typeof record["displayName"] !== "string") {
    throw new Error("displayName must be a string.");
  }
  if (typeof record["status"] !== "string") {
    throw new Error("status must be a string.");
  }
  if (
    record["parentLegalEntityId"] !== null &&
    typeof record["parentLegalEntityId"] !== "string"
  ) {
    throw new Error("parentLegalEntityId must be a string or null.");
  }

  assertEntityGroupWireContext(value as EntityGroupWireContext);
}
