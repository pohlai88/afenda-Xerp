import { findTenantBySlug } from "@afenda/database";
import { isMembershipActive } from "@afenda/permissions";

import { loadActorMemberships } from "@/lib/context/load-actor-memberships.server";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";

import { AUTH_PATHS, buildAuthPath } from "./auth-path.registry";
import { DEFAULT_SAFE_INTERNAL_PATH } from "./resolve-safe-internal-path";

export type PostLoginMembershipValidation = {
  readonly activeMembershipCount: number;
  readonly entryPath: string;
  readonly requiresOrganizationSelect: boolean;
  readonly requiresWorkspaceSelect: boolean;
  readonly workspaceTargetCount: number;
};

/**
 * Validates platform memberships after authentication and resolves the post-login entry path.
 * Uses the same membership reads as system-admin membership management.
 */
export async function validatePostLoginMembership(input: {
  readonly actorUserId: string;
  readonly tenantSlug: string;
}): Promise<PostLoginMembershipValidation> {
  const tenant = await findTenantBySlug(input.tenantSlug);

  if (tenant === null) {
    return {
      activeMembershipCount: 0,
      entryPath: AUTH_PATHS.accessDenied,
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      workspaceTargetCount: 0,
    };
  }

  const memberships = await loadActorMemberships({
    actorUserId: input.actorUserId,
    tenantId: tenant.id,
  });

  const activeMembershipCount = memberships.filter(isMembershipActive).length;

  if (activeMembershipCount === 0) {
    return {
      activeMembershipCount: 0,
      entryPath: buildAuthPath("accessDenied", { reason: "unlinked" }),
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      workspaceTargetCount: 0,
    };
  }

  const allowedOptions = await resolveAllowedContextOptions({
    actorUserId: input.actorUserId,
    memberships,
    selectedCompanySlug: "",
    selectedOrganizationSlug: null,
    tenantId: tenant.id,
  });

  const workspaceTargetCount = allowedOptions.targets.length;

  if (workspaceTargetCount <= 1) {
    return {
      activeMembershipCount,
      entryPath: DEFAULT_SAFE_INTERNAL_PATH,
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      workspaceTargetCount,
    };
  }

  const companyCount = new Set(
    allowedOptions.targets.map((target) => target.companySlug)
  ).size;
  const organizationTargetCount = allowedOptions.targets.filter(
    (target) => target.organizationSlug !== undefined
  ).length;

  if (companyCount === 1 && organizationTargetCount > 1) {
    return {
      activeMembershipCount,
      entryPath: AUTH_PATHS.organizationSelect,
      requiresOrganizationSelect: true,
      requiresWorkspaceSelect: false,
      workspaceTargetCount,
    };
  }

  return {
    activeMembershipCount,
    entryPath: AUTH_PATHS.workspaceSelect,
    requiresOrganizationSelect: false,
    requiresWorkspaceSelect: true,
    workspaceTargetCount,
  };
}
