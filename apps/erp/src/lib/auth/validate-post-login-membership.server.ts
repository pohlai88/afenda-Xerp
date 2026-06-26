import { isAuthShellV2Default } from "@afenda/auth";
import { findTenantBySlug } from "@afenda/database";
import { isMembershipActive } from "@afenda/permissions";

import { loadActorMemberships } from "@/lib/context/load-actor-memberships.server";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";
import {
  AUTH_V2_PATHS,
  buildAuthV2Path,
} from "../auth-v2/auth-v2-path.registry";
import { AUTH_PATHS, buildAuthPath } from "./auth-path.registry";
import { DEFAULT_SAFE_INTERNAL_PATH } from "./resolve-safe-internal-path";

export type PostLoginMembershipValidation = {
  readonly activeMembershipCount: number;
  readonly entryPath: string;
  readonly requiresOrganizationSelect: boolean;
  readonly requiresWorkspaceSelect: boolean;
  readonly workspaceTargetCount: number;
};

function resolveUnlinkedEntryPath(): string {
  return isAuthShellV2Default()
    ? buildAuthV2Path("accessDenied", { reason: "unlinked" })
    : buildAuthPath("accessDenied", { reason: "unlinked" });
}

function resolveMissingTenantEntryPath(): string {
  return isAuthShellV2Default()
    ? AUTH_V2_PATHS.accessDenied
    : AUTH_PATHS.accessDenied;
}

function resolveWorkspaceSelectEntryPath(): string {
  return isAuthShellV2Default()
    ? AUTH_V2_PATHS.workspaceSelect
    : AUTH_PATHS.workspaceSelect;
}

function resolveOrganizationSelectEntryPath(): string {
  return isAuthShellV2Default()
    ? AUTH_V2_PATHS.organizationSelect
    : AUTH_PATHS.organizationSelect;
}

function countDistinctCompanySlugs(
  targets: readonly { readonly companySlug: string }[]
): number {
  return new Set(targets.map((target) => target.companySlug)).size;
}

function countOrganizationTargets(
  targets: readonly { readonly organizationSlug?: string }[]
): number {
  return targets.filter((target) => target.organizationSlug !== undefined)
    .length;
}

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
      entryPath: resolveMissingTenantEntryPath(),
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
      entryPath: resolveUnlinkedEntryPath(),
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

  const companyCount = countDistinctCompanySlugs(allowedOptions.targets);
  const organizationTargetCount = countOrganizationTargets(
    allowedOptions.targets
  );

  if (companyCount === 1 && organizationTargetCount > 1) {
    return {
      activeMembershipCount,
      entryPath: resolveOrganizationSelectEntryPath(),
      requiresOrganizationSelect: true,
      requiresWorkspaceSelect: false,
      workspaceTargetCount,
    };
  }

  return {
    activeMembershipCount,
    entryPath: resolveWorkspaceSelectEntryPath(),
    requiresOrganizationSelect: false,
    requiresWorkspaceSelect: true,
    workspaceTargetCount,
  };
}
