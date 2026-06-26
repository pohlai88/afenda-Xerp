import {
  getAfendaAuthSession,
  isAfendaAuthSessionLinked,
  isAuthShellV2Default,
  toAfendaAuthIdentity,
} from "@afenda/auth";
import { findTenantBySlug } from "@afenda/database";
import type { ApplicationShellContextSwitchTarget } from "@afenda/kernel";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { resolvePostAuthTenantSlugFromRequest } from "@/lib/auth/resolve-post-auth-tenant-slug.server";
import { validatePostLoginMembership } from "@/lib/auth/validate-post-login-membership.server";
import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";
import { loadActorMemberships } from "@/lib/context/load-actor-memberships.server";
import { resolveAllowedContextOptions } from "@/lib/context/resolve-allowed-context-options.server";

export type AuthWorkspaceSelectPageData = {
  readonly targets: readonly ApplicationShellContextSwitchTarget[];
};

function resolveSignInRedirect(): string {
  return isAuthShellV2Default()
    ? buildAuthV2Path("signIn")
    : buildAuthPath("signIn");
}

export async function loadAuthWorkspaceSelectPageData(): Promise<AuthWorkspaceSelectPageData> {
  const session = await getAfendaAuthSession(await headers());

  if (session === null) {
    redirect(resolveSignInRedirect());
  }

  if (!isAfendaAuthSessionLinked(session)) {
    redirect(
      isAuthShellV2Default()
        ? buildAuthV2Path("accessDenied", { reason: "unlinked" })
        : buildAuthPath("accessDenied", { reason: "unlinked" })
    );
  }

  const tenantSlug = await resolvePostAuthTenantSlugFromRequest();

  if (tenantSlug === null || tenantSlug.length === 0) {
    redirect(
      isAuthShellV2Default()
        ? buildAuthV2Path("accessDenied")
        : buildAuthPath("accessDenied")
    );
  }

  const identity = toAfendaAuthIdentity(session);
  const validation = await validatePostLoginMembership({
    actorUserId: identity.userId,
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

  return { targets: allowedOptions.targets };
}

export async function loadAuthOrganizationSelectPageData(): Promise<AuthWorkspaceSelectPageData> {
  const session = await getAfendaAuthSession(await headers());

  if (session === null) {
    redirect(resolveSignInRedirect());
  }

  if (!isAfendaAuthSessionLinked(session)) {
    redirect(
      isAuthShellV2Default()
        ? buildAuthV2Path("accessDenied", { reason: "unlinked" })
        : buildAuthPath("accessDenied", { reason: "unlinked" })
    );
  }

  const tenantSlug = await resolvePostAuthTenantSlugFromRequest();

  if (tenantSlug === null || tenantSlug.length === 0) {
    redirect(
      isAuthShellV2Default()
        ? buildAuthV2Path("accessDenied")
        : buildAuthPath("accessDenied")
    );
  }

  const identity = toAfendaAuthIdentity(session);
  const validation = await validatePostLoginMembership({
    actorUserId: identity.userId,
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
