/**
 * Team write governance — types and pure builders (no I/O).
 */
import type { CompanyStatus } from "../database.types.js";
import {
  assertPlatformSlug,
  InvalidPlatformSlugError,
  normalizePlatformSlug,
} from "../platform-slug.js";

export class InvalidTeamSlugError extends InvalidPlatformSlugError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidTeamSlugError";
  }
}

export function normalizeTeamSlug(value: string): string {
  return normalizePlatformSlug(value);
}

export function assertTeamSlug(value: string): string {
  try {
    return assertPlatformSlug(value);
  } catch (error) {
    if (error instanceof InvalidPlatformSlugError) {
      throw new InvalidTeamSlugError(error.message);
    }
    throw error;
  }
}

export interface TeamWriteInput {
  readonly companyId?: string | null;
  readonly displayName: string;
  readonly organizationUnitId?: string | null;
  readonly slug: string;
  readonly status?: CompanyStatus;
  readonly tenantId: string;
}

export interface TeamInsertRow {
  companyId: string | null;
  displayName: string;
  organizationUnitId: string | null;
  slug: string;
  status: CompanyStatus;
  tenantId: string;
}

export type TeamUpdatePatch = Partial<Omit<TeamInsertRow, "tenantId">>;

/** Serializable authority record aligned with `@afenda/kernel` `TeamContext`. */
export interface TeamAuthorityRecord {
  readonly companyId: string | null;
  readonly displayName: string;
  readonly organizationUnitId: string | null;
  readonly slug: string;
  readonly status: CompanyStatus;
  readonly teamId: string;
  readonly tenantId: string;
}

export function buildTeamInsertRow(input: TeamWriteInput): TeamInsertRow {
  return {
    tenantId: input.tenantId,
    companyId: input.companyId ?? null,
    organizationUnitId: input.organizationUnitId ?? null,
    slug: assertTeamSlug(input.slug),
    displayName: input.displayName.trim(),
    status: input.status ?? "active",
  };
}

export function buildTeamUpdatePatch(input: TeamUpdatePatch): TeamUpdatePatch {
  const patch: TeamUpdatePatch = {};

  if (input.slug !== undefined) {
    patch.slug = assertTeamSlug(input.slug);
  }
  if (input.displayName !== undefined) {
    patch.displayName = input.displayName.trim();
  }
  if (input.companyId !== undefined) {
    patch.companyId = input.companyId;
  }
  if (input.organizationUnitId !== undefined) {
    patch.organizationUnitId = input.organizationUnitId;
  }
  if (input.status !== undefined) {
    patch.status = input.status;
  }

  return patch;
}

export { TEAM_ORGANIZATION_UNIT_TYPE } from "./team.constants.js";
