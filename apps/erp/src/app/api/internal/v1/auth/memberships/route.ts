import { isAfendaAuthSessionLinked } from "@afenda/auth";
import { loadPostLoginMembershipTargets } from "@/lib/auth/load-post-login-membership-targets.server";
import { resolvePostAuthTenantSlugFromRequest } from "@/lib/auth/resolve-post-auth-tenant-slug.server";
import { resolveProtectedPathActorUserIdFromSession } from "@/lib/auth/resolve-protected-path-actor.server";
import { computePostLoginMembershipValidation } from "@/lib/auth/validate-post-login-membership.server";
import { authMembershipsGetContract } from "@/server/api/contracts/auth/auth-memberships.contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = createApiHandler({
  contract: authMembershipsGetContract,
  async handler(context) {
    if (context.session === null || context.userId === null) {
      throw new ApiRouteError("unauthenticated", "Authentication is required.");
    }

    if (!isAfendaAuthSessionLinked(context.session)) {
      throw new ApiRouteError(
        "forbidden",
        "Your account is not linked to an Afenda ERP workspace."
      );
    }

    const tenantSlug = await resolvePostAuthTenantSlugFromRequest();

    if (tenantSlug === null || tenantSlug.length === 0) {
      throw new ApiRouteError(
        "forbidden",
        "A tenant context is required to validate membership."
      );
    }

    const actorUserId = resolveProtectedPathActorUserIdFromSession(
      context.session
    );
    const targets = await loadPostLoginMembershipTargets({
      actorUserId,
      tenantSlug,
    });
    const validation = computePostLoginMembershipValidation(targets);

    if (targets.tenant === null) {
      return {
        activeMembershipCount: validation.activeMembershipCount,
        entryPath: validation.entryPath,
        requiresOrganizationSelect: validation.requiresOrganizationSelect,
        requiresWorkspaceSelect: validation.requiresWorkspaceSelect,
        targets: [],
        workspaceTargetCount: validation.workspaceTargetCount,
      };
    }

    return {
      activeMembershipCount: validation.activeMembershipCount,
      entryPath: validation.entryPath,
      requiresOrganizationSelect: validation.requiresOrganizationSelect,
      requiresWorkspaceSelect: validation.requiresWorkspaceSelect,
      targets: targets.allowedOptions.targets.map((target) => ({
        companySlug: target.companySlug,
        isSelected: target.isSelected,
        label: target.label,
        ...(target.organizationSlug === undefined
          ? {}
          : { organizationSlug: target.organizationSlug }),
      })),
      workspaceTargetCount: validation.workspaceTargetCount,
    };
  },
});
