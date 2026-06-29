import type { ApplicationShellContextSwitchTarget } from "@afenda/appshell";
import { getAfendaAuthSession, isAfendaAuthSessionLinked } from "@afenda/auth";
import { findTenantBySlug } from "@afenda/database";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { resolvePostAuthTenantSlugFromRequest } from "@/lib/auth/resolve-post-auth-tenant-slug.server";
import { resolveProtectedPathActorUserIdFromSession } from "@/lib/auth/resolve-protected-path-actor.server";
import { validatePostLoginMembership } from "@/lib/auth/validate-post-login-membership.server";
import { loadActorMemberships } from "@/lib/context/load-actor-memberships.server";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";

export type AuthWorkspaceSelectPageData = {
  readonly targets: readonly ApplicationShellContextSwitchTarget[];
};

export async function loadAuthWorkspaceSelectPageData(): Promise<AuthWorkspaceSelectPageData> {
  const session = await getAfendaAuthSession(await headers());

  if (session === null) {
    redirect(buildAuthPath("signIn"));
  }

  if (!isAfendaAuthSessionLinked(session)) {
    redirect(buildAuthPath("accessDenied", { reason: "unlinked" }));
  }

  const tenantSlug = await resolvePostAuthTenantSlugFromRequest();

  if (tenantSlug === null || tenantSlug.length === 0) {
    redirect(buildAuthPath("accessDenied"));
  }

  const actorUserId = resolveProtectedPathActorUserIdFromSession(session);
  const validation = await validatePostLoginMembership({
    actorUserId,
    tenantSlug,
  });

  if (!validation.requiresWorkspaceSelect) {
    redirect(validation.entryPath);
  }

  const tenant = await findTenantBySlug(tenantSlug);

  if (tenant === null) {
    redirect(validation.entryPath);
  }

  const memberships = await loadActorMemberships({
    actorUserId,
    tenantId: tenant.id,
  });

  const allowedOptions = await resolveAllowedContextOptions({
    actorUserId,
    memberships,
    selectedCompanySlug: "",
    selectedOrganizationSlug: null,
    tenantId: tenant.id,
  });

  return { targets: allowedOptions.targets };
}

export async function loadAuthOrganizationSelectPageData(): Promise<AuthWorkspaceSelectPageData> {
  const session = await getAfendaAuthSession(await headers());

  if (session === null) {
    redirect(buildAuthPath("signIn"));
  }

  if (!isAfendaAuthSessionLinked(session)) {
    redirect(buildAuthPath("accessDenied", { reason: "unlinked" }));
  }

  const tenantSlug = await resolvePostAuthTenantSlugFromRequest();

  if (tenantSlug === null || tenantSlug.length === 0) {
    redirect(buildAuthPath("accessDenied"));
  }

  const actorUserId = resolveProtectedPathActorUserIdFromSession(session);
  const validation = await validatePostLoginMembership({
    actorUserId,
    tenantSlug,
  });

  if (!validation.requiresOrganizationSelect) {
    redirect(validation.entryPath);
  }

  const tenant = await findTenantBySlug(tenantSlug);

  if (tenant === null) {
    redirect(validation.entryPath);
  }

  const memberships = await loadActorMemberships({
    actorUserId,
    tenantId: tenant.id,
  });

  const allowedOptions = await resolveAllowedContextOptions({
    actorUserId,
    memberships,
    selectedCompanySlug: "",
    selectedOrganizationSlug: null,
    tenantId: tenant.id,
  });

  const organizationTargets = allowedOptions.targets.filter(
    (target) => target.organizationSlug !== undefined
  );

  return {
    targets:
      organizationTargets.length > 0
        ? organizationTargets
        : allowedOptions.targets,
  };
}
