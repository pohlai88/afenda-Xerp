"use server";

import { getAfendaAuthSession } from "@afenda/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { buildAuthPath } from "@/lib/auth/auth-path.registry";
import { clearSecurityReviewFlowCookies } from "@/lib/auth/auth-security-review.cookies.server";
import { resolvePostAuthTenantSlugFromRequest } from "@/lib/auth/resolve-post-auth-tenant-slug.server";
import { resolveProtectedPathActorUserIdFromSession } from "@/lib/auth/resolve-protected-path-actor.server";
import { validatePostLoginMembership } from "@/lib/auth/validate-post-login-membership.server";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";

export async function acknowledgeSecurityReviewAction(): Promise<void> {
  const session = await getAfendaAuthSession(await headers());

  if (session === null) {
    redirect(buildAuthPath("signIn"));
  }

  const actorUserId =
    resolveProtectedPathActorUserIdFromSession(session).trim();

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
    redirect(buildAuthPath("accessDenied"));
  }

  const validation = await validatePostLoginMembership({
    actorUserId,
    tenantSlug,
  });

  redirect(validation.entryPath);
}
