/**
 * Entity group write governance — types and pure builders (no I/O).
 */
import type { CompanyStatus } from "../database.types.js";
import {
  assertPlatformSlug,
  InvalidPlatformSlugError,
  normalizePlatformSlug,
} from "../platform-slug.js";

export class InvalidEntityGroupSlugError extends InvalidPlatformSlugError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEntityGroupSlugError";
  }
}

export function normalizeEntityGroupSlug(value: string): string {
  return normalizePlatformSlug(value);
}

export function assertEntityGroupSlug(value: string): string {
  try {
    return assertPlatformSlug(value);
  } catch (error) {
    if (error instanceof InvalidPlatformSlugError) {
      throw new InvalidEntityGroupSlugError(error.message);
    }
    throw error;
  }
}

export interface EntityGroupWriteInput {
  readonly displayName: string;
  readonly parentLegalEntityId?: string | null;
  readonly slug: string;
  readonly status?: CompanyStatus;
  readonly tenantId: string;
}

export interface EntityGroupInsertRow {
  displayName: string;
  parentLegalEntityId: string | null;
  slug: string;
  status: CompanyStatus;
  tenantId: string;
}

export type EntityGroupUpdatePatch = Partial<
  Omit<EntityGroupInsertRow, "tenantId">
>;

export function buildEntityGroupInsertRow(
  input: EntityGroupWriteInput
): EntityGroupInsertRow {
  return {
    tenantId: input.tenantId,
    slug: assertEntityGroupSlug(input.slug),
    displayName: input.displayName.trim(),
    parentLegalEntityId: input.parentLegalEntityId ?? null,
    status: input.status ?? "active",
  };
}

export function buildEntityGroupUpdatePatch(
  input: EntityGroupUpdatePatch
): EntityGroupUpdatePatch {
  const patch: EntityGroupUpdatePatch = {};

  if (input.slug !== undefined) {
    patch.slug = assertEntityGroupSlug(input.slug);
  }
  if (input.displayName !== undefined) {
    patch.displayName = input.displayName.trim();
  }
  if (input.parentLegalEntityId !== undefined) {
    patch.parentLegalEntityId = input.parentLegalEntityId;
  }
  if (input.status !== undefined) {
    patch.status = input.status;
  }

  return patch;
}
