import type { SignInProviderSurface } from "@afenda/auth";
import { resolveSignInProviderSurface } from "@afenda/auth";
import {
  findTenantBySlug,
  getTenantSettingsByTenantId,
  listTenantSsoProvidersByTenantId,
} from "@afenda/database";
import { unstable_noStore as noStore } from "next/cache";

import { readTenantRoutingHeaders } from "@/lib/context/tenant-domain.server";

import { mergeTenantSignInSurface } from "./merge-tenant-sign-in-surface";

/** Serializable sign-in provider flags for ERP auth entry pages. */
export async function resolveSignInSurface(): Promise<SignInProviderSurface> {
  noStore();
  const platform = resolveSignInProviderSurface();
  const { tenantSlug } = await readTenantRoutingHeaders();

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
