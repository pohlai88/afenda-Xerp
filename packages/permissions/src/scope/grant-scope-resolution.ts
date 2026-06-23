import {
  membershipMatchesGrantScope,
  resolveRlsGrantScope,
} from "@afenda/database";
import type { PermissionScopeContext } from "@afenda/kernel";

import type { MembershipContract } from "./membership.contract.js";
import type { RoleScope } from "./role-scope.contract.js";

export interface ResolvePermissionScopeInput {
  readonly entityGroupId?: string | null;
  readonly membership: MembershipContract;
  readonly organizationId?: string | null;
  readonly projectId?: string | null;
  readonly roleScope: RoleScope;
  readonly teamId?: string | null;
}

const MEMBERSHIP_SCOPE_NARROWNESS: Record<
  MembershipContract["scopeType"],
  number
> = {
  tenant: 1,
  company: 2,
  organization: 3,
};

export function selectNarrowestMatchingMembership(
  memberships: readonly MembershipContract[],
  context: {
    readonly companyId?: string | null;
    readonly organizationId?: string | null;
  }
): MembershipContract | null {
  const matching = memberships.filter((membership) =>
    membershipMatchesGrantScope(membership, context)
  );

  if (matching.length === 0) {
    return null;
  }

  return (
    [...matching].sort(
      (left, right) =>
        MEMBERSHIP_SCOPE_NARROWNESS[right.scopeType] -
        MEMBERSHIP_SCOPE_NARROWNESS[left.scopeType]
    )[0] ?? null
  );
}

/** Maps a matched membership + role into kernel `PermissionScopeContext`. */
export function resolvePermissionScopeContext(
  input: ResolvePermissionScopeInput
): PermissionScopeContext {
  const resolved = resolveRlsGrantScope({
    roleScope: input.roleScope,
    entityGroupId: input.entityGroupId ?? null,
    teamId: input.teamId ?? null,
    projectId: input.projectId ?? null,
    organizationUnitId: input.organizationId ?? input.membership.organizationId,
    membership: {
      scopeType: input.membership.scopeType,
      tenantId: input.membership.tenantId,
      companyId: input.membership.companyId,
      organizationId: input.membership.organizationId,
      membershipId: input.membership.id,
      roleId: input.membership.roleId,
    },
  });

  return {
    grantScopeType: resolved.grantScopeType,
    tenantId: resolved.tenantId,
    entityGroupId: resolved.entityGroupId,
    companyId: resolved.legalEntityId,
    organizationId: resolved.organizationUnitId,
    teamId: resolved.teamId,
    projectId: resolved.projectId,
    membershipId: resolved.membershipId,
    roleId: resolved.roleId,
    elevations: { ...resolved.elevations },
  };
}
