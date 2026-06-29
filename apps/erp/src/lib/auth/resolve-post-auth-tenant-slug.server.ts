import { headers } from "next/headers";

import { DEV_DEFAULT_TENANT_SLUG } from "@/lib/context/context.constants";
import { readTenantRoutingHeaders } from "@/lib/context/tenant-domain.server";

function resolveDevelopmentDefaultTenantSlug(): string | null {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const configured = process.env["AFENDA_DEV_DEFAULT_TENANT_SLUG"]?.trim();
  return configured && configured.length > 0
    ? configured
    : DEV_DEFAULT_TENANT_SLUG;
}

function resolveE2eDefaultTenantSlug(): string | null {
  const configured = process.env["AFENDA_E2E_DEFAULT_TENANT_SLUG"]?.trim();
  return configured && configured.length > 0 ? configured : null;
}

/** Tenant slug for post-auth membership reads on auth entry routes (no subdomain). */
export async function resolvePostAuthTenantSlug(): Promise<string | null> {
  const { tenantSlug } = await readTenantRoutingHeaders();
  if (tenantSlug !== null && tenantSlug.length > 0) {
    return tenantSlug;
  }

  return resolveDevelopmentDefaultTenantSlug() ?? resolveE2eDefaultTenantSlug();
}

export async function resolvePostAuthTenantSlugFromRequest(): Promise<
  string | null
> {
  await headers();
  return resolvePostAuthTenantSlug();
}
