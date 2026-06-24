import {
  membershipMatchesGrantScope,
  type MembershipScopeType,
} from "@afenda/database";

export type { MembershipScopeType };

export type MembershipStatus = "active" | "pending" | "suspended" | "revoked";

/** Normalized membership contract — no raw database rows. */
export interface MembershipContract {
  readonly companyId: string | null;
  readonly entityGroupId: string | null;
  readonly id: string;
  readonly organizationId: string | null;
  readonly projectId: string | null;
  readonly teamId: string | null;
  readonly roleId: string;
  readonly scopeType: MembershipScopeType;
  readonly status: MembershipStatus;
  readonly tenantId: string;
  readonly userId: string;
}

export function isMembershipActive(
  membership: Pick<MembershipContract, "status">
): boolean {
  return membership.status === "active";
}

export { membershipMatchesGrantScope };

/** @deprecated Use `membershipMatchesGrantScope` — tenant grants do not imply company access. */
export function membershipMatchesCompany(
  membership: Pick<
    MembershipContract,
    "companyId" | "entityGroupId" | "organizationId" | "projectId" | "scopeType"
  >,
  companyId: string | null | undefined,
  entityGroupId?: string | null
): boolean {
  return membershipMatchesGrantScope(membership, {
    companyId: companyId ?? null,
    entityGroupId: entityGroupId ?? null,
    organizationId: null,
  });
}

/** @deprecated Use `membershipMatchesGrantScope`. */
export function membershipMatchesOrganization(
  membership: Pick<
    MembershipContract,
    "organizationId" | "scopeType" | "companyId" | "entityGroupId"
  >,
  organizationId: string | null | undefined,
  companyId?: string | null,
  entityGroupId?: string | null
): boolean {
  return membershipMatchesGrantScope(membership, {
    companyId: companyId ?? membership.companyId ?? null,
    entityGroupId: entityGroupId ?? membership.entityGroupId ?? null,
    organizationId: organizationId ?? null,
  });
}
