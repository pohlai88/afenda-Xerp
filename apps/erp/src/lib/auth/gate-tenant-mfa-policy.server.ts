import {
  type AfendaAuthSession,
  assertTenantMfaPolicySatisfied,
  isMfaPolicyBypassBlockedError,
} from "@afenda/auth";
import { redirect } from "next/navigation";

import { resolveActiveRoutePathFromHeaders } from "@/lib/modules/resolve-active-route-path-from-headers.server";

const TENANT_MFA_ENROLLMENT_PATHS = new Set([
  "/settings/security",
  "/settings/security/",
]);

export function resolveTenantMfaEnrollmentRedirect(returnPath: string): string {
  const params = new URLSearchParams({ notice: "mfa-required" });

  if (returnPath.length > 0 && returnPath !== "/settings/security") {
    params.set("next", returnPath);
  }

  return `/settings/security?${params.toString()}`;
}

/**
 * Redirects users who must enroll MFA before accessing protected ERP surfaces.
 * Exempts the user security settings route so enrollment can complete.
 */
export async function gateTenantMfaPolicyBeforeProtectedAccess(input: {
  readonly activeRoutePath: string | undefined;
  readonly companyId: string;
  readonly session: AfendaAuthSession;
  readonly tenantId: string;
}): Promise<void> {
  const normalizedPath = input.activeRoutePath?.replace(/\/+$/, "") ?? "";

  if (TENANT_MFA_ENROLLMENT_PATHS.has(normalizedPath)) {
    return;
  }

  try {
    await assertTenantMfaPolicySatisfied({
      authUserId: input.session.user.authUserId,
      companyId: input.companyId,
      tenantId: input.tenantId,
    });
  } catch (error) {
    if (!isMfaPolicyBypassBlockedError(error)) {
      throw error;
    }

    redirect(
      resolveTenantMfaEnrollmentRedirect(
        input.activeRoutePath && input.activeRoutePath.length > 0
          ? input.activeRoutePath
          : "/"
      )
    );
  }
}

export async function gateTenantMfaPolicyFromHeaders(input: {
  readonly headerStore: Readonly<Headers>;
  readonly operatingContext: {
    readonly legalEntity: { readonly companyId: string };
    readonly tenant: { readonly tenantId: string };
  };
  readonly session: AfendaAuthSession;
}): Promise<void> {
  const activeRoutePath = resolveActiveRoutePathFromHeaders(input.headerStore);

  await gateTenantMfaPolicyBeforeProtectedAccess({
    activeRoutePath,
    companyId: input.operatingContext.legalEntity.companyId,
    session: input.session,
    tenantId: input.operatingContext.tenant.tenantId,
  });
}
