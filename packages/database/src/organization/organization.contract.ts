/**
 * Organization write governance — types and pure builders (no I/O).
 *
 * Table: `schema/organization.schema.ts`
 * Writes: `organization.service.ts`
 */
import type {
  OrganizationStatus,
  OrganizationType,
  OrganizationUnitType,
} from "../database.types.js";
import {
  assertPlatformSlug,
  InvalidPlatformSlugError,
  normalizePlatformSlug,
} from "../platform-slug.js";

export class InvalidOrganizationSlugError extends InvalidPlatformSlugError {
  constructor(message: string) {
    super(message);
    this.name = "InvalidOrganizationSlugError";
  }
}

export class OrganizationScopeMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationScopeMismatchError";
  }
}

export class OrganizationCycleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationCycleError";
  }
}

export class OrganizationParentNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationParentNotFoundError";
  }
}

export class OrganizationHasChildrenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationHasChildrenError";
  }
}

export class OrganizationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrganizationValidationError";
  }
}

export function normalizeOrganizationSlug(value: string): string {
  return normalizePlatformSlug(value);
}

export function assertOrganizationSlug(value: string): string {
  try {
    return assertPlatformSlug(value);
  } catch (error) {
    if (error instanceof InvalidPlatformSlugError) {
      throw new InvalidOrganizationSlugError(error.message);
    }
    throw error;
  }
}

export interface OrganizationWriteInput {
  readonly companyId?: string;
  readonly effectiveFrom?: string | null;
  readonly effectiveTo?: string | null;
  readonly legalEntityId?: string;
  readonly name: string;
  readonly organizationUnitType?: OrganizationUnitType;
  readonly parentOrganizationId?: string | null;
  readonly parentOrganizationUnitId?: string | null;
  readonly slug: string;
  readonly status?: OrganizationStatus;
  readonly tenantId: string;
  readonly type?: OrganizationType;
}

export interface OrganizationInsertRow {
  companyId: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
  name: string;
  parentOrganizationId: string | null;
  slug: string;
  status: OrganizationStatus;
  tenantId: string;
  type: OrganizationType;
}

export type OrganizationUpdatePatch = Partial<
  Omit<OrganizationInsertRow, "tenantId" | "companyId">
> & {
  readonly companyId?: never;
  readonly tenantId?: never;
};

/** Authority read model aligned with multi-tenancy.md organization unit fields. */
export interface OrganizationUnitAuthorityRecord {
  readonly displayName: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly legalEntityId: string;
  readonly organizationUnitId: string;
  readonly organizationUnitType: OrganizationUnitType;
  readonly parentOrganizationUnitId: string | null;
  readonly slug: string;
  readonly status: OrganizationStatus;
  readonly tenantId: string;
}

function assertEffectiveDateRange(
  effectiveFrom: string | null,
  effectiveTo: string | null
): void {
  if (
    effectiveFrom !== null &&
    effectiveTo !== null &&
    effectiveTo < effectiveFrom
  ) {
    throw new OrganizationValidationError(
      "effectiveTo must be on or after effectiveFrom."
    );
  }
}

export function resolveLegalEntityId(
  input: Pick<OrganizationWriteInput, "companyId" | "legalEntityId">
): string {
  const legalEntityId = input.legalEntityId ?? input.companyId;

  if (legalEntityId === undefined || legalEntityId.length === 0) {
    throw new OrganizationValidationError(
      "legalEntityId (or companyId) is required."
    );
  }

  if (
    input.legalEntityId !== undefined &&
    input.companyId !== undefined &&
    input.legalEntityId !== input.companyId
  ) {
    throw new OrganizationValidationError(
      "legalEntityId and companyId must match when both are provided."
    );
  }

  return legalEntityId;
}

export function resolveParentOrganizationUnitId(
  input: Pick<
    OrganizationWriteInput,
    "parentOrganizationId" | "parentOrganizationUnitId"
  >
): string | null {
  const parentOrganizationUnitId =
    input.parentOrganizationUnitId ?? input.parentOrganizationId ?? null;

  if (
    input.parentOrganizationId !== undefined &&
    input.parentOrganizationUnitId !== undefined &&
    input.parentOrganizationId !== input.parentOrganizationUnitId
  ) {
    throw new OrganizationValidationError(
      "parentOrganizationUnitId and parentOrganizationId must match when both are provided."
    );
  }

  return parentOrganizationUnitId;
}

export function resolveOrganizationUnitType(
  input: Pick<OrganizationWriteInput, "organizationUnitType" | "type">
): OrganizationUnitType {
  const organizationUnitType = input.organizationUnitType ?? input.type;

  if (
    input.organizationUnitType !== undefined &&
    input.type !== undefined &&
    input.organizationUnitType !== input.type
  ) {
    throw new OrganizationValidationError(
      "organizationUnitType and type must match when both are provided."
    );
  }

  return organizationUnitType ?? "department";
}

export function buildOrganizationInsertRow(
  input: OrganizationWriteInput
): OrganizationInsertRow {
  const effectiveFrom = input.effectiveFrom ?? null;
  const effectiveTo = input.effectiveTo ?? null;
  assertEffectiveDateRange(effectiveFrom, effectiveTo);

  return {
    tenantId: input.tenantId,
    companyId: resolveLegalEntityId(input),
    parentOrganizationId: resolveParentOrganizationUnitId(input),
    slug: assertOrganizationSlug(input.slug),
    name: input.name.trim(),
    type: resolveOrganizationUnitType(input),
    status: input.status ?? "active",
    effectiveFrom,
    effectiveTo,
  };
}

export function buildOrganizationUpdatePatch(
  input: OrganizationUpdatePatch
): OrganizationUpdatePatch {
  const patch: OrganizationUpdatePatch = {};

  if (input.parentOrganizationId !== undefined) {
    patch.parentOrganizationId = input.parentOrganizationId;
  }
  if (input.slug !== undefined) {
    patch.slug = assertOrganizationSlug(input.slug);
  }
  if (input.name !== undefined) {
    patch.name = input.name.trim();
  }
  if (input.type !== undefined) {
    patch.type = input.type;
  }
  if (input.status !== undefined) {
    patch.status = input.status;
  }
  if (input.effectiveFrom !== undefined) {
    patch.effectiveFrom = input.effectiveFrom;
  }
  if (input.effectiveTo !== undefined) {
    patch.effectiveTo = input.effectiveTo;
  }

  if (patch.effectiveFrom !== undefined || patch.effectiveTo !== undefined) {
    assertEffectiveDateRange(
      patch.effectiveFrom ?? null,
      patch.effectiveTo ?? null
    );
  }

  return patch;
}

export function toOrganizationUnitAuthorityRecord(input: {
  readonly companyId: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly id: string;
  readonly name: string;
  readonly parentOrganizationId: string | null;
  readonly slug: string;
  readonly status: OrganizationStatus;
  readonly tenantId: string;
  readonly type: OrganizationType;
}): OrganizationUnitAuthorityRecord {
  return {
    organizationUnitId: input.id,
    tenantId: input.tenantId,
    legalEntityId: input.companyId,
    parentOrganizationUnitId: input.parentOrganizationId,
    organizationUnitType: input.type,
    displayName: input.name,
    slug: input.slug,
    status: input.status,
    effectiveFrom: input.effectiveFrom,
    effectiveTo: input.effectiveTo,
  };
}

/**
 * Ensures assigning `parentOrganizationId` would not create a cycle.
 * Pure helper for tests and service validation.
 */
export function assertNoOrganizationCycle(
  organizationId: string | null,
  parentOrganizationId: string | null,
  resolveParentId: (id: string) => string | null | undefined
): void {
  if (!parentOrganizationId) {
    return;
  }

  if (organizationId && parentOrganizationId === organizationId) {
    throw new OrganizationCycleError(
      "An organization cannot be its own parent."
    );
  }

  const visited = new Set<string>();
  let currentId: string | null = parentOrganizationId;

  while (currentId) {
    if (organizationId && currentId === organizationId) {
      throw new OrganizationCycleError(
        "Organization hierarchy cannot contain a cycle."
      );
    }

    if (visited.has(currentId)) {
      throw new OrganizationCycleError(
        "Organization hierarchy cannot contain a cycle."
      );
    }

    visited.add(currentId);
    currentId = resolveParentId(currentId) ?? null;
  }
}
