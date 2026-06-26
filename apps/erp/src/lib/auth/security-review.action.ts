"use server";

import { getAfendaAuthSession, toAfendaAuthIdentity } from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { clearSecurityReviewFlowCookies } from "@/lib/auth/auth-security-review.cookies.server";
import { isAuthShellV2Default } from "@/lib/auth/is-auth-shell-v2-default";
import { resolvePostAuthTenantSlugFromRequest } from "@/lib/auth/resolve-post-auth-tenant-slug.server";
import { validatePostLoginMembership } from "@/lib/auth/validate-post-login-membership.server";
import { buildAuthV2Path } from "@/lib/auth-v2/auth-v2-path.registry";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";

function resolveSignInPath(): string {
  return isAuthShellV2Default()
    ? buildAuthV2Path("signIn")
    : buildAuthPath("signIn");
}

export async function acknowledgeSecurityReviewAction(): Promise<void> {
  const session = await getAfendaAuthSession(await headers());

  if (session === null) {
    redirect(resolveSignInPath());
  }

  const identity = toAfendaAuthIdentity(session);
  const actorUserId = identity.userId.trim();

  await recordActionAudit({
    action: "auth.security_review.acknowledged",
    actorUserId,
    module: "erp.auth",
    result: "success",
    targetId: actorUserId,
    targetType: "user",
  });

  await clearSecurityReviewFlowCookies();

  const tenantSlug = await resolvePostAuthTenantSlugFromRequest();

  if (tenantSlug === null || tenantSlug.length === 0) {
    redirect(
      isAuthShellV2Default()
        ? buildAuthV2Path("accessDenied")
        : buildAuthPath("accessDenied")
    );
  }

  const validation = await validatePostLoginMembership({
    actorUserId,
    tenantSlug,
  });

  redirect(validation.entryPath);
}
