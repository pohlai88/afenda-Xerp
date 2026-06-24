/**
 * Project write governance — types and pure builders (no I/O).
 */
import type { ProjectLifecycleStatus } from "../database.types.js";
import {
  assertPlatformSlug,
  InvalidPlatformSlugError,
  normalizePlatformSlug,
} from "../platform-slug.js";

/** Full PM domain logic remains planned; persistence foundation is TIP-030 Slice 1. */
export const PROJECT_DOMAIN_STATUS = "planned" as const;

export type ProjectDomainStatus = typeof PROJECT_DOMAIN_STATUS;

export class InvalidProjectSlugError extends InvalidPlatformSlugError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidProjectSlugError";
  }
}

export function normalizeProjectSlug(value: string): string {
  return normalizePlatformSlug(value);
}

export function assertProjectSlug(value: string): string {
  try {
    return assertPlatformSlug(value);
  } catch (error) {
    if (error instanceof InvalidPlatformSlugError) {
      throw new InvalidProjectSlugError(error.message);
    }
    throw error;
  }
}

export interface ProjectWriteInput {
  readonly companyId: string;
  readonly displayName: string;
  readonly organizationUnitId?: string | null;
  readonly slug: string;
  readonly status?: ProjectLifecycleStatus;
  readonly tenantId: string;
}

export interface ProjectInsertRow {
  companyId: string;
  displayName: string;
  organizationUnitId: string | null;
  slug: string;
  status: ProjectLifecycleStatus;
  tenantId: string;
}

export type ProjectUpdatePatch = Partial<
  Omit<ProjectInsertRow, "tenantId" | "companyId">
>;

/** Serializable authority record aligned with `@afenda/kernel` `ProjectContext`. */
export interface ProjectAuthorityRecord {
  readonly companyId: string;
  readonly displayName: string;
  readonly organizationUnitId: string | null;
  readonly projectId: string;
  readonly slug: string;
  readonly status: ProjectLifecycleStatus;
  readonly tenantId: string;
}

export function buildProjectInsertRow(
  input: ProjectWriteInput
): ProjectInsertRow {
  return {
    tenantId: input.tenantId,
    companyId: input.companyId,
    organizationUnitId: input.organizationUnitId ?? null,
    slug: assertProjectSlug(input.slug),
    displayName: input.displayName.trim(),
    status: input.status ?? "draft",
  };
}

export function buildProjectUpdatePatch(
  input: ProjectUpdatePatch
): ProjectUpdatePatch {
  const patch: ProjectUpdatePatch = {};

  if (input.slug !== undefined) {
    patch.slug = assertProjectSlug(input.slug);
  }
  if (input.displayName !== undefined) {
    patch.displayName = input.displayName.trim();
  }
  if (input.organizationUnitId !== undefined) {
    patch.organizationUnitId = input.organizationUnitId;
  }
  if (input.status !== undefined) {
    patch.status = input.status;
  }

  return patch;
}

export {
  PROJECT_LIFECYCLE_STATUSES,
  type ProjectLifecycleStatus,
} from "../database.types.js";
