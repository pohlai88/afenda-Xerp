import { isAfendaAuthSessionLinked, toAfendaAuthIdentity } from "@afenda/auth";
import { findTenantBySlug } from "@afenda/database";
import { resolvePostAuthTenantSlugFromRequest } from "@/lib/auth/resolve-post-auth-tenant-slug.server";
import { validatePostLoginMembership } from "@/lib/auth/validate-post-login-membership.server";
import { loadActorMemberships } from "@/lib/context/load-actor-memberships.server";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";
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

    const identity = toAfendaAuthIdentity(context.session);
    const validation = await validatePostLoginMembership({
      actorUserId: identity.userId,
      tenantSlug,
    });

    const tenant = await findTenantBySlug(tenantSlug);

    if (tenant === null) {
      return {
        activeMembershipCount: validation.activeMembershipCount,
        entryPath: validation.entryPath,
        requiresOrganizationSelect: validation.requiresOrganizationSelect,
        requiresWorkspaceSelect: validation.requiresWorkspaceSelect,
        targets: [],
        workspaceTargetCount: validation.workspaceTargetCount,
      };
    }

    const memberships = await loadActorMemberships({
      actorUserId: identity.userId,
      tenantId: tenant.id,
    });

    const allowedOptions = await resolveAllowedContextOptions({
      actorUserId: identity.userId,
      memberships,
      selectedCompanySlug: "",
      selectedOrganizationSlug: null,
      tenantId: tenant.id,
    });

    return {
      activeMembershipCount: validation.activeMembershipCount,
      entryPath: validation.entryPath,
      requiresOrganizationSelect: validation.requiresOrganizationSelect,
      requiresWorkspaceSelect: validation.requiresWorkspaceSelect,
      targets: allowedOptions.targets.map((target) => ({
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
