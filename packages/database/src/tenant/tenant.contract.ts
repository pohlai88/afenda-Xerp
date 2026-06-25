/**
 * Tenant write governance — types and pure builders (no I/O).
 *
 * Table: `schema/tenant.schema.ts`
 * Writes: `tenant.service.ts`
 */
import type { TenantStatus } from "../database.types.js";
import {
  assertPlatformSlug,
  InvalidPlatformSlugError,
  normalizePlatformSlug,
} from "../platform-slug.js";

export class InvalidTenantSlugError extends InvalidPlatformSlugError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTenantSlugError";
  }
}

export interface TenantWriteInput {
  readonly mfaRequired?: boolean;
  readonly name: string;
  readonly slug: string;
  readonly status?: TenantStatus;
}

export interface TenantInsertRow {
  mfaRequired: boolean;
  name: string;
  slug: string;
  status: TenantStatus;
}

export type TenantRecord = TenantInsertRow;

export type TenantUpdatePatch = Partial<TenantInsertRow>;

export function normalizeTenantSlug(value: string): string {
  return normalizePlatformSlug(value);
}

export function assertTenantSlug(value: string): string {
  try {
    return assertPlatformSlug(value);
  } catch (error) {
    if (error instanceof InvalidPlatformSlugError) {
      throw new InvalidTenantSlugError(error.message);
    }
    throw error;
  }
}

/** Only active tenants allow normal workspace authorization. */
export function isTenantOperational(
  tenant: Pick<TenantRecord, "status">
): boolean {
  return tenant.status === "active";
}

export function getTenantAccessBlockReason(
  status: TenantStatus
): string | null {
  switch (status) {
    case "active":
      return null;
    case "suspended":
      return "Tenant is suspended and workspace access is blocked.";
    case "archived":
      return "Tenant is archived and workspace access is blocked.";
    default:
      return `Tenant status "${status}" cannot access the workspace.`;
  }
}

export function buildTenantInsertRow(input: TenantWriteInput): TenantInsertRow {
  return {
    mfaRequired: input.mfaRequired ?? false,
    slug: assertTenantSlug(input.slug),
    name: input.name.trim(),
    status: input.status ?? "active",
  };
}

export function buildTenantUpdatePatch(
  input: TenantUpdatePatch
): TenantUpdatePatch {
  const patch: TenantUpdatePatch = {};

  if (input.slug !== undefined) {
    patch.slug = assertTenantSlug(input.slug);
  }
  if (input.name !== undefined) {
    patch.name = input.name.trim();
  }
  if (input.status !== undefined) {
    patch.status = input.status;
  }
  if (input.mfaRequired !== undefined) {
    patch.mfaRequired = input.mfaRequired;
  }

  return patch;
}
