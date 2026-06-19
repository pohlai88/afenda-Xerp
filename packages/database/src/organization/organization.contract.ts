/**
 * Organization write governance — types and pure builders (no I/O).
 *
 * Table: `schema/organization.schema.ts`
 * Writes: `organization.service.ts`
 */
import type {
  OrganizationStatus,
  OrganizationType,
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
  readonly companyId: string;
  readonly name: string;
  readonly parentOrganizationId?: string | null;
  readonly slug: string;
  readonly status?: OrganizationStatus;
  readonly tenantId: string;
  readonly type?: OrganizationType;
}

export interface OrganizationInsertRow {
  companyId: string;
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
  readonly tenantId?: never;
  readonly companyId?: never;
};

export function buildOrganizationInsertRow(
  input: OrganizationWriteInput
): OrganizationInsertRow {
  return {
    tenantId: input.tenantId,
    companyId: input.companyId,
    parentOrganizationId: input.parentOrganizationId ?? null,
    slug: assertOrganizationSlug(input.slug),
    name: input.name.trim(),
    type: input.type ?? "department",
    status: input.status ?? "active",
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

  return patch;
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
