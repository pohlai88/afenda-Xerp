import { AUTH_PATHS, buildAuthPath } from "./auth-path.registry";
import { loadPostLoginMembershipTargets } from "./load-post-login-membership-targets.server";
import { DEFAULT_SAFE_INTERNAL_PATH } from "./resolve-safe-internal-path";

export type PostLoginMembershipValidation = {
  readonly activeMembershipCount: number;
  readonly entryPath: string;
  readonly requiresOrganizationSelect: boolean;
  readonly requiresWorkspaceSelect: boolean;
  readonly workspaceTargetCount: number;
};

export function computePostLoginMembershipValidation(
  targets: Awaited<ReturnType<typeof loadPostLoginMembershipTargets>>
): PostLoginMembershipValidation {
  if (targets.tenant === null) {
    return {
      activeMembershipCount: 0,
      entryPath: AUTH_PATHS.accessDenied,
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      workspaceTargetCount: 0,
    };
  }

  if (targets.activeMembershipCount === 0) {
    return {
      activeMembershipCount: 0,
      entryPath: buildAuthPath("accessDenied", { reason: "unlinked" }),
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      workspaceTargetCount: 0,
    };
  }

  const workspaceTargetCount = targets.allowedOptions.targets.length;

  if (workspaceTargetCount <= 1) {
    return {
      activeMembershipCount: targets.activeMembershipCount,
      entryPath: DEFAULT_SAFE_INTERNAL_PATH,
      requiresOrganizationSelect: false,
      requiresWorkspaceSelect: false,
      workspaceTargetCount,
    };
  }

  const companyCount = new Set(
    targets.allowedOptions.targets.map((target) => target.companySlug)
  ).size;
  const organizationTargetCount = targets.allowedOptions.targets.filter(
    (target) => target.organizationSlug !== undefined
  ).length;

  if (companyCount === 1 && organizationTargetCount > 1) {
    return {
      activeMembershipCount: targets.activeMembershipCount,
      entryPath: AUTH_PATHS.organizationSelect,
      requiresOrganizationSelect: true,
      requiresWorkspaceSelect: false,
      workspaceTargetCount,
    };
  }

  return {
    activeMembershipCount: targets.activeMembershipCount,
    entryPath: AUTH_PATHS.workspaceSelect,
    requiresOrganizationSelect: false,
    requiresWorkspaceSelect: true,
    workspaceTargetCount,
  };
}

/**
 * Validates platform memberships after authentication and resolves the post-login entry path.
 * Uses the same membership reads as system-admin membership management.
 */
export async function validatePostLoginMembership(input: {
  readonly actorUserId: string;
  readonly tenantSlug: string;
}): Promise<PostLoginMembershipValidation> {
  const targets = await loadPostLoginMembershipTargets(input);
  return computePostLoginMembershipValidation(targets);
}
