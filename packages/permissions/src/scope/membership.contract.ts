import {
  type MembershipScopeType,
  type MembershipStatus,
  membershipMatchesGrantScope,
} from "@afenda/database";

export type { MembershipScopeType, MembershipStatus };

/** Normalized membership contract — no raw database rows. */
export interface MembershipContract {
  readonly companyId: string | null;
  readonly entityGroupId: string | null;
  readonly id: string;
  readonly organizationId: string | null;
  readonly projectId: string | null;
  readonly roleId: string;
  readonly scopeType: MembershipScopeType;
  readonly status: MembershipStatus;
  readonly teamId: string | null;
  readonly tenantId: string;
  readonly userId: string;
}

export function isMembershipActive(
  membership: Pick<MembershipContract, "status">
): boolean {
  return membership.status === "active";
}

export { membershipMatchesGrantScope };
