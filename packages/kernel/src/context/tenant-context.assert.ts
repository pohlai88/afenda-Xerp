import { assertLegalEntitySlug } from "./legal-entity-context.assert.js";
import {
  PLATFORM_LIFECYCLE_STATUSES,
  type PlatformLifecycleStatus,
} from "./lifecycle.contract.js";
import type { TenantWireContext } from "./tenant-context.contract.js";
import { isTenantSaasLifecyclePhase } from "./tenant-saas-lifecycle.contract.js";

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

type _TenantWireSerializable = AssertJsonSerializable<TenantWireContext>;

/** Compile-time guard — tenant wire context must remain JSON-serializable. */
export type assertTenantContextWireSerializable =
  _TenantWireSerializable extends true ? true : never;

function isPlatformLifecycleStatus(
  value: string
): value is PlatformLifecycleStatus {
  return (PLATFORM_LIFECYCLE_STATUSES as readonly string[]).includes(value);
}

export function assertTenantContextText(value: string, label: string): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

function assertTenantWireContext(value: TenantWireContext): void {
  assertTenantContextText(value.tenantId, "tenantId");
  assertLegalEntitySlug(value.slug);
  assertTenantContextText(value.displayName, "displayName");

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
export function assertWireTenantContext(
  value: unknown
): asserts value is TenantWireContext {
  if (value === null || typeof value !== "object") {
    throw new Error("TenantWireContext must be an object.");
  }

  const record = value as Record<string, unknown>;

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
    record["saasLifecyclePhase"] !== undefined &&
    (typeof record["saasLifecyclePhase"] !== "string" ||
      !isTenantSaasLifecyclePhase(record["saasLifecyclePhase"]))
  ) {
    throw new Error(
      "saasLifecyclePhase must be a valid tenant SaaS lifecycle phase."
    );
  }

  assertTenantWireContext(value as TenantWireContext);
}
