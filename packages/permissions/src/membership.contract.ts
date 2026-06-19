export type MembershipScopeType = "tenant" | "company" | "organization";

export type MembershipStatus = "active" | "pending" | "suspended" | "revoked";

/** Normalized membership contract — no raw database rows. */
export interface MembershipContract {
  readonly companyId: string | null;
  readonly id: string;
  readonly organizationId: string | null;
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

/** Whether membership scope matches the requested company context. */
export function membershipMatchesCompany(
  membership: Pick<MembershipContract, "companyId" | "scopeType">,
  companyId: string | null | undefined
): boolean {
  if (membership.scopeType === "tenant") {
    return true;
  }

  if (!companyId) {
    return false;
  }

  return membership.companyId === companyId;
}

/** Whether membership scope matches the requested organization context. */
export function membershipMatchesOrganization(
  membership: Pick<MembershipContract, "organizationId" | "scopeType">,
  organizationId: string | null | undefined
): boolean {
  if (membership.scopeType !== "organization") {
    return true;
  }

  if (!organizationId) {
    return false;
  }

  return membership.organizationId === organizationId;
}
