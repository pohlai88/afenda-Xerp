/**
 * RLS grant scoping authority — types and pure resolution (no I/O).
 *
 * Aligns with multi-tenancy.md §5 (RLS and grant scoping).
 * Application RBAC remains primary; these types prepare Postgres RLS filters.
 */
import type { MembershipScopeType, RoleScope } from "../database.types.js";

/** All grant scope tiers — persisted and explicit-elevation kinds. */
export const RLS_GRANT_SCOPE_TYPES = [
  "platform",
  "tenant",
  "entity_group",
  "company",
  "organization",
  "team",
  "project",
  "consolidation_view",
  "cross_company",
] as const;

export type RlsGrantScopeType = (typeof RLS_GRANT_SCOPE_TYPES)[number];

/** Membership scopes stored in `memberships.scope_type` today. */
export const PERSISTED_MEMBERSHIP_SCOPE_TYPES = [
  "tenant",
  "company",
  "organization",
] as const satisfies readonly MembershipScopeType[];

/** Planned membership scope extensions (TIP-008 / TIP-030) — require explicit grants. */
export const PLANNED_MEMBERSHIP_SCOPE_TYPES = [
  "entity_group",
  "team",
  "project",
] as const;

/** Explicit elevation kinds — never inferred from hierarchy position. */
export const RLS_GRANT_ELEVATION_KINDS = [
  "platform_admin",
  "cross_company",
  "consolidation_view",
  "minority_interest_company",
] as const;

export type RlsGrantElevationKind = (typeof RLS_GRANT_ELEVATION_KINDS)[number];

export interface RlsGrantElevationFlags {
  readonly consolidationView: boolean;
  readonly crossCompany: boolean;
  readonly minorityInterestCompany: boolean;
  readonly platformAdmin: boolean;
}

export const DEFAULT_RLS_GRANT_ELEVATION_FLAGS: RlsGrantElevationFlags = {
  platformAdmin: false,
  crossCompany: false,
  consolidationView: false,
  minorityInterestCompany: false,
};

/** Minimum Postgres RLS filter dimensions — fail closed when required keys are absent. */
export interface RlsFilterContext {
  readonly entityGroupId: string | null;
  readonly legalEntityId: string | null;
  readonly organizationUnitId: string | null;
  readonly tenantId: string;
}

/** Resolved grant scope passed to application permission checks. */
export interface ResolvedRlsGrantScope {
  readonly elevations: RlsGrantElevationFlags;
  readonly entityGroupId: string | null;
  readonly grantScopeType: RlsGrantScopeType;
  readonly legalEntityId: string | null;
  readonly membershipId: string;
  readonly organizationUnitId: string | null;
  readonly projectId: string | null;
  readonly roleId: string;
  readonly teamId: string | null;
  readonly tenantId: string;
}

export interface ResolveRlsGrantScopeInput {
  readonly entityGroupId?: string | null;
  readonly membership: Pick<
    ResolvedRlsGrantScope,
    "membershipId" | "roleId" | "tenantId"
  > & {
    readonly companyId: string | null;
    readonly organizationId: string | null;
    readonly scopeType: MembershipScopeType;
  };
  readonly organizationUnitId?: string | null;
  readonly projectId?: string | null;
  readonly roleScope: RoleScope;
  readonly teamId?: string | null;
}

export interface MembershipScopeMatchInput {
  readonly companyId?: string | null;
  readonly organizationId?: string | null;
}

/**
 * Whether a membership grant covers the requested workspace dimensions.
 * Fail closed: tenant grants never imply company, org, or sibling legal entity access.
 */
export function membershipMatchesGrantScope(
  membership: Pick<
    ResolveRlsGrantScopeInput["membership"],
    "companyId" | "organizationId" | "scopeType"
  >,
  context: MembershipScopeMatchInput
): boolean {
  const companyId = context.companyId ?? null;
  const organizationId = context.organizationId ?? null;

  if (membership.scopeType === "tenant") {
    if (companyId !== null || organizationId !== null) {
      return false;
    }
    return true;
  }

  if (membership.scopeType === "company") {
    if (!companyId || membership.companyId !== companyId) {
      return false;
    }
    return true;
  }

  if (!(companyId && organizationId)) {
    return false;
  }

  return (
    membership.companyId === companyId &&
    membership.organizationId === organizationId
  );
}

/** Maps persisted membership + role scope to the resolved grant scope type. */
export function resolveRlsGrantScopeType(
  input: Pick<ResolveRlsGrantScopeInput, "membership" | "roleScope"> & {
    readonly teamId?: string | null;
    readonly projectId?: string | null;
  }
): RlsGrantScopeType {
  if (input.roleScope === "platform") {
    return "platform";
  }

  if (input.teamId) {
    return "team";
  }

  if (input.projectId) {
    return "project";
  }

  switch (input.membership.scopeType) {
    case "tenant":
      return "tenant";
    case "company":
      return "company";
    case "organization":
      return "organization";
    default: {
      const exhaustive: never = input.membership.scopeType;
      throw new Error(`Unsupported membership scope type: ${exhaustive}`);
    }
  }
}

export function resolveRlsGrantElevations(input: {
  readonly grantScopeType: RlsGrantScopeType;
  readonly roleScope: RoleScope;
}): RlsGrantElevationFlags {
  return {
    platformAdmin:
      input.roleScope === "platform" && input.grantScopeType === "platform",
    crossCompany: input.grantScopeType === "cross_company",
    consolidationView: input.grantScopeType === "consolidation_view",
    minorityInterestCompany: false,
  };
}

export function resolveRlsGrantScope(
  input: ResolveRlsGrantScopeInput
): ResolvedRlsGrantScope {
  const organizationUnitId =
    input.organizationUnitId ?? input.membership.organizationId ?? null;
  const legalEntityId = input.membership.companyId;
  const grantScopeType = resolveRlsGrantScopeType(input);

  return {
    grantScopeType,
    tenantId: input.membership.tenantId,
    entityGroupId: input.entityGroupId ?? null,
    legalEntityId,
    organizationUnitId,
    teamId: input.teamId ?? null,
    projectId: input.projectId ?? null,
    membershipId: input.membership.membershipId,
    roleId: input.membership.roleId,
    elevations: resolveRlsGrantElevations({
      grantScopeType,
      roleScope: input.roleScope,
    }),
  };
}

export function toRlsFilterContext(
  scope: Pick<
    ResolvedRlsGrantScope,
    "tenantId" | "legalEntityId" | "entityGroupId" | "organizationUnitId"
  >
): RlsFilterContext {
  return {
    tenantId: scope.tenantId,
    legalEntityId: scope.legalEntityId,
    entityGroupId: scope.entityGroupId,
    organizationUnitId: scope.organizationUnitId,
  };
}

/** Validates minimum tenant isolation for future RLS policies. */
export function assertRlsTenantFilter(
  filter: Partial<RlsFilterContext>
): asserts filter is RlsFilterContext & { tenantId: string } {
  if (!filter.tenantId?.trim()) {
    throw new RlsGrantScopeValidationError(
      "tenantId is required for RLS filter context."
    );
  }
}

export class RlsGrantScopeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RlsGrantScopeValidationError";
  }
}
