/** HTTP header injected by `apps/erp/src/proxy.ts` after tenant subdomain resolution. */
export const TENANT_SLUG_HEADER = "x-tenant-slug";

/**
 * Organization slug from `/o/{organizationSlug}` path prefix only.
 * Selection hint — does not grant tenant authority or bypass membership checks.
 */
export const ORGANIZATION_SLUG_PATH_HINT_HEADER =
  "x-organization-slug-path-hint";

/**
 * Internal routed pathname (tenant/org prefixes stripped) for server-side nav
 * active-route matching. Injected by `apps/erp/src/proxy.ts`.
 */
export const ACTIVE_ROUTE_PATH_HEADER = "x-active-route-path";

export const DEFAULT_TENANT_BASE_DOMAIN = "afenda.app";

/** Local dev fallback when hostname/path carry no tenant — aligns with `DEV_WORKSPACE_FIXTURE`. */
export const DEV_DEFAULT_TENANT_SLUG = "dev-local";

/** Persisted workspace selection — verified server-side on every request. */
export const AFENDA_WORKSPACE_COMPANY_SLUG_COOKIE =
  "afenda-workspace-company-slug";

export const AFENDA_WORKSPACE_ORGANIZATION_SLUG_COOKIE =
  "afenda-workspace-organization-slug";

export const RESERVED_TENANT_SUBDOMAINS = [
  "www",
  "app",
  "api",
  "admin",
  "mail",
  "ftp",
  "cdn",
  "static",
  "docs",
  "status",
] as const;

export type ReservedTenantSubdomain =
  (typeof RESERVED_TENANT_SUBDOMAINS)[number];

export function isReservedTenantSubdomain(
  slug: string
): slug is ReservedTenantSubdomain {
  return (RESERVED_TENANT_SUBDOMAINS as readonly string[]).includes(slug);
}
