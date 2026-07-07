import { findTenantBySlug, type TenantLookupRow } from "@afenda/database";
import type { MembershipContract } from "@afenda/permissions";
import { isMembershipActive } from "@afenda/permissions";

import type { ErpAllowedContextOptions } from "@/lib/context/context-switch.presentation.contract";
import { loadActorMemberships } from "@/lib/context/load-actor-memberships.server";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";

export type PostLoginMembershipTargets = {
  readonly activeMembershipCount: number;
  readonly allowedOptions: ErpAllowedContextOptions;
  readonly memberships: readonly MembershipContract[];
  readonly tenant: TenantLookupRow | null;
};

/**
 * Loads tenant, memberships, and allowed context options for post-login flows.
 * Shared by membership validation and the memberships API route.
 */
export async function loadPostLoginMembershipTargets(input: {
  readonly actorUserId: string;
  readonly tenantSlug: string;
}): Promise<PostLoginMembershipTargets> {
  const tenant = await findTenantBySlug(input.tenantSlug);

  if (tenant === null) {
    return {
      activeMembershipCount: 0,
      allowedOptions: { targets: [] },
      memberships: [],
      tenant: null,
    };
  }

  const memberships = await loadActorMemberships({
    actorUserId: input.actorUserId,
    tenantId: tenant.id,
  });
  const activeMembershipCount = memberships.filter(isMembershipActive).length;
  const allowedOptions = await resolveAllowedContextOptions({
    actorUserId: input.actorUserId,
    memberships,
    selectedCompanySlug: "",
    selectedOrganizationSlug: null,
    tenantId: tenant.id,
  });

  return {
    activeMembershipCount,
    allowedOptions,
    memberships,
    tenant,
  };
}
