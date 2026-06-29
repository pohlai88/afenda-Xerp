/**
 * Canonical Step 6 tenant URL resolver registry — aligned with
 * `docs/architecture/multi-tenancy.md` (§553–559).
 *
 * Tenant subdomain and path prefixes resolve tenant authority only.
 * Legal entity selection is never derived from hostname.
 */
export const TENANT_URL_RESOLVER_FUNCTIONS = [
  {
    name: "resolveTenantSlugFromHostname",
    file: "lib/context/tenant-domain.ts",
    purpose: "Parse host safely; extract tenant slug from subdomain",
  },
  {
    name: "resolveTenantSlugFromPathname",
    file: "lib/context/tenant-domain.ts",
    purpose: "Path fallback `/t/{slug}` when hostname carries no tenant",
  },
  {
    name: "resolveTenantSlugFromRequest",
    file: "lib/context/tenant-domain.ts",
    purpose: "Hostname-first tenant slug resolution for server handlers",
  },
  {
    name: "resolveWorkspacePathRouting",
    file: "lib/context/tenant-domain.ts",
    purpose: "Strip `/t` and `/o` prefixes; org hint is selection only",
  },
] as const;

/** HTTP header injected by `apps/erp/src/proxy.ts` after tenant resolution. */
export const TENANT_URL_RESOLVER_HEADER = "x-tenant-slug" as const;

/** Edge proxy module — injects tenant header and preserves middleware behavior. */
export const TENANT_URL_RESOLVER_PROXY_MODULE = "src/proxy.ts" as const;

/**
 * Middleware behaviors that must remain wired in `proxy.ts` (Step 6 §559).
 * CSP, correlation ID propagation, and auth session gate.
 */
export const TENANT_URL_RESOLVER_PROXY_PRESERVATIONS = [
  "applyContentSecurityPolicy",
  "resolveCorrelationIdFromHeaders",
  "getSessionCookie",
] as const;

/** Patterns that must not appear in tenant URL resolution — company is never from subdomain. */
export const TENANT_URL_RESOLVER_FORBIDDEN_PATTERNS = [
  "resolveCompanyFromHostname",
  "resolveCompanySlugFromHostname",
  "x-company-slug",
  "COMPANY_SLUG_FROM_HOST",
] as const;

export type TenantUrlResolverFunctionName =
  (typeof TENANT_URL_RESOLVER_FUNCTIONS)[number]["name"];

export type TenantUrlResolverProxyPreservation =
  (typeof TENANT_URL_RESOLVER_PROXY_PRESERVATIONS)[number];
