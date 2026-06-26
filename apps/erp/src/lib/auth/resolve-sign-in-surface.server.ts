import type { SignInProviderSurface } from "@afenda/auth";
import { resolveSignInProviderSurface } from "@afenda/auth";
import {
  findTenantBySlug,
  getTenantSettingsByTenantId,
  listTenantSsoProvidersByTenantId,
} from "@afenda/database";

import { mergeTenantSignInSurface } from "./merge-tenant-sign-in-surface";
import { resolvePostAuthTenantSlug } from "./resolve-post-auth-tenant-slug.server";

/** Serializable sign-in provider flags for ERP auth entry pages. */
export async function resolveSignInSurface(): Promise<SignInProviderSurface> {
  const platform = resolveSignInProviderSurface();
  const tenantSlug = await resolvePostAuthTenantSlug();

  if (tenantSlug === null || tenantSlug.length === 0) {
    return platform;
  }

  try {
    const tenant = await findTenantBySlug(tenantSlug);

    if (tenant === null || tenant.status !== "active") {
      return mergeTenantSignInSurface(platform, null, 0);
    }

    const [settings, ssoProviders] = await Promise.all([
      getTenantSettingsByTenantId(tenant.id),
      listTenantSsoProvidersByTenantId(tenant.id),
    ]);

    const enabledSsoProviderCount = ssoProviders.filter(
      (provider) => provider.enabled
    ).length;

    return mergeTenantSignInSurface(
      platform,
      settings?.integrations?.oauth,
      enabledSsoProviderCount
    );
  } catch {
    return platform;
  }
}
