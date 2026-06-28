import type { ProjectWireContext } from "./project-context.contract.js";
import {
  PROJECT_LIFECYCLE_STATUSES,
  type ProjectLifecycleStatus,
} from "./project-context.contract.js";

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

type _ProjectWireSerializable = AssertJsonSerializable<ProjectWireContext>;

/** Compile-time guard — project wire context must remain JSON-serializable. */
export type assertProjectContextWireSerializable =
  _ProjectWireSerializable extends true ? true : never;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isProjectLifecycleStatus(
  value: string
): value is ProjectLifecycleStatus {
  return (PROJECT_LIFECYCLE_STATUSES as readonly string[]).includes(value);
}

export function assertProjectContextText(value: string, label: string): void {
  if (!value.trim()) {
    throw new Error(`${label} is required.`);
  }
}

export function assertProjectContextOptionalText(
  value: string | null,
  label: string
): void {
  if (value !== null && !value.trim()) {
    throw new Error(`${label} must be null or a non-empty string.`);
  }
}

export function assertProjectContextSlug(value: string): void {
  if (!value.trim()) {
    throw new Error("slug is required.");
  }

  if (!SLUG_PATTERN.test(value)) {
    throw new Error(
      "slug must use lowercase letters, numbers, and single hyphen separators."
    );
  }
}

function assertProjectWireContext(value: ProjectWireContext): void {
  assertProjectContextText(value.projectId, "projectId");
  assertProjectContextText(value.tenantId, "tenantId");
  assertProjectContextOptionalText(value.companyId, "companyId");
  assertProjectContextOptionalText(
    value.organizationUnitId,
    "organizationUnitId"
  );
  assertProjectContextSlug(value.slug);
  assertProjectContextText(value.displayName, "displayName");

  if (!isProjectLifecycleStatus(value.status)) {
    throw new Error(
      `status must be one of: ${PROJECT_LIFECYCLE_STATUSES.join(", ")}.`
    );
  }
}

/**
 * JSON ingress guard — narrow unknown wire payloads, then run semantic asserts.
 * Fail closed before identity parse* branding.
 */
export function assertWireProjectContext(
  value: unknown
): asserts value is ProjectWireContext {
  if (value === null || typeof value !== "object") {
    throw new Error("ProjectWireContext must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["projectId"] !== "string") {
    throw new Error("projectId must be a string.");
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

  assertProjectWireContext(value as ProjectWireContext);
}
