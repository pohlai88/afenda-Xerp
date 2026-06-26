import type { SignInProviderSurface } from "@afenda/auth";
import type {
  TenantOAuthProviderId,
  TenantOAuthSettings,
} from "@afenda/database";

/** Intersects platform sign-in methods with tenant integration toggles. */
export function mergeTenantSignInSurface(
  platform: SignInProviderSurface,
  tenantOAuth: TenantOAuthSettings | null | undefined,
  enabledSsoProviderCount: number
): SignInProviderSurface {
  const socialProviderIds = platform.socialProviderIds.filter((providerId) => {
    if (tenantOAuth === null) {
      return false;
    }

    if (tenantOAuth === undefined) {
      return true;
    }

    const tenantProvider =
      tenantOAuth.providers[providerId as TenantOAuthProviderId];

    return tenantProvider.enabled === true;
  });

  return {
    passkeyEnabled: platform.passkeyEnabled,
    socialProviderIds,
    ssoEnabled: platform.ssoEnabled && enabledSsoProviderCount > 0,
  };
}
