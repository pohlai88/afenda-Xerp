import type { AssertJsonSerializable } from "../contracts/json-wire.contract.js";
import {
  assertWireOptionalText,
  assertWireRequiredText,
} from "./_internal/wire-text.assert.js";
import {
  PLATFORM_LIFECYCLE_STATUSES,
  type PlatformLifecycleStatus,
} from "./lifecycle.contract.js";
import type { TeamWireContext } from "./team-context.contract.js";

type _TeamWireSerializable = AssertJsonSerializable<TeamWireContext>;

/** Compile-time guard — team wire context must remain JSON-serializable. */
export type assertTeamContextWireSerializable =
  _TeamWireSerializable extends true ? true : never;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isPlatformLifecycleStatus(
  value: string
): value is PlatformLifecycleStatus {
  return (PLATFORM_LIFECYCLE_STATUSES as readonly string[]).includes(value);
}

export function assertTeamContextText(value: string, label: string): void {
  assertWireRequiredText(value, label);
}

export function assertTeamContextOptionalText(
  value: string | null,
  label: string
): void {
  assertWireOptionalText(value, label);
}

export function assertTeamContextSlug(value: string): void {
  if (!value.trim()) {
    throw new Error("slug is required.");
  }

  if (!SLUG_PATTERN.test(value)) {
    throw new Error(
      "slug must use lowercase letters, numbers, and single hyphen separators."
    );
  }
}

function assertTeamWireContext(value: TeamWireContext): void {
  assertTeamContextText(value.teamId, "teamId");
  assertTeamContextText(value.tenantId, "tenantId");
  assertTeamContextOptionalText(value.companyId, "companyId");
  assertTeamContextOptionalText(value.organizationUnitId, "organizationUnitId");
  assertTeamContextSlug(value.slug);
  assertTeamContextText(value.displayName, "displayName");

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
export function assertWireTeamContext(
  value: unknown
): asserts value is TeamWireContext {
  if (value === null || typeof value !== "object") {
    throw new Error("TeamWireContext must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["teamId"] !== "string") {
    throw new Error("teamId must be a string.");
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
  if (record["companyId"] !== null && typeof record["companyId"] !== "string") {
    throw new Error("companyId must be a string or null.");
  }
  if (
    record["organizationUnitId"] !== null &&
    typeof record["organizationUnitId"] !== "string"
  ) {
    throw new Error("organizationUnitId must be a string or null.");
  }

  assertTeamWireContext(value as TeamWireContext);
}
