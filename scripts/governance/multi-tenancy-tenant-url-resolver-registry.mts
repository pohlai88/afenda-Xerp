/**
 * Canonical tenant URL resolver registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 6, lines 553–559).
 *
 * Runtime checks live in `lib/multi-tenancy-tenant-url-resolver-enforcement.mts`.
 */
/** Runtime resolver function registry — verified against apps/erp source files. */
export const TENANT_URL_RESOLVER_FUNCTIONS = [
  {
    name: "resolveTenantSlugFromHostname",
    file: "lib/context/tenant-domain.ts",
  },
  {
    name: "resolveTenantSlugFromPathname",
    file: "lib/context/tenant-domain.ts",
  },
  {
    name: "resolveTenantSlugFromRequest",
    file: "lib/context/tenant-domain.ts",
  },
  {
    name: "resolveWorkspacePathRouting",
    file: "lib/context/tenant-domain.ts",
  },
] as const;

export const TENANT_URL_RESOLVER_HEADER = "x-tenant-slug" as const;

export const TENANT_URL_RESOLVER_PROXY_PRESERVATIONS = [
  "applyContentSecurityPolicy",
  "resolveCorrelationIdFromHeaders",
  "getSessionCookie",
] as const;

export const TENANT_URL_RESOLVER_FORBIDDEN_PATTERNS = [
  "resolveCompanyFromHostname",
  "resolveCompanySlugFromHostname",
  "x-company-slug",
  "COMPANY_SLUG_FROM_HOST",
] as const;

export const MULTI_TENANCY_TENANT_URL_RESOLVER_SURFACE_RULE =
  "multi-tenancy-tenant-url-resolver-is-canonical-subdomain-routing-baseline" as const;

/** Markers that must appear in multi-tenancy.md Step 6 (§553–559). */
export const MULTI_TENANCY_DOC_TENANT_URL_RESOLVER_MARKERS = [
  "Step 6 — Tenant URL resolver",
  "Parse host safely.",
  "Reject reserved subdomains.",
  "Resolve tenant slug.",
  "Do not select company from subdomain.",
  "Preserve CSP/correlation/auth middleware behavior.",
] as const;

/** Delivery doc H2 — must match `MULTI_TENANCY_DELIVERY_REQUIRED_SECTIONS` entry. */
export const MULTI_TENANCY_TENANT_URL_RESOLVER_SECTION =
  "Tenant subdomain strategy" as const;

/** Step 6 dimensions — one table per concern in §555–559. */
export const MULTI_TENANCY_TENANT_URL_RESOLVER_DIMENSIONS = [
  {
    id: "host-parsing",
    title: "Host parsing",
    tableMarker: "### Host parsing",
    registryImport: "apps/erp/src/lib/context/tenant-url-resolver-registry.ts",
    registryExport: "TENANT_URL_RESOLVER_FUNCTIONS",
  },
  {
    id: "reserved-subdomains",
    title: "Reserved subdomains",
    tableMarker: "### Reserved subdomains",
    registryImport: "apps/erp/src/lib/context/context.constants.ts",
    registryExport: "RESERVED_TENANT_SUBDOMAINS",
  },
  {
    id: "tenant-slug-resolution",
    title: "Tenant slug resolution",
    tableMarker: "### Tenant slug resolution",
    registryImport: "apps/erp/src/lib/context/tenant-url-resolver-registry.ts",
    registryExport: "TENANT_URL_RESOLVER_HEADER",
  },
  {
    id: "legal-entity-boundary",
    title: "Legal entity boundary",
    tableMarker: "### Legal entity boundary",
    registryImport: "apps/erp/src/lib/context/tenant-url-resolver-registry.ts",
    registryExport: "TENANT_URL_RESOLVER_FORBIDDEN_PATTERNS",
  },
  {
    id: "middleware-preservation",
    title: "Middleware preservation",
    tableMarker: "### Middleware preservation",
    registryImport: "apps/erp/src/lib/context/tenant-url-resolver-registry.ts",
    registryExport: "TENANT_URL_RESOLVER_PROXY_PRESERVATIONS",
  },
] as const;

/** Required resolver function row markers in delivery doc. */
export const MULTI_TENANCY_TENANT_URL_RESOLVER_FUNCTION_MARKERS = [
  "resolveTenantSlugFromHostname",
  "resolveTenantSlugFromPathname",
  "resolveTenantSlugFromRequest",
  "resolveWorkspacePathRouting",
] as const;

/** Required reserved subdomain markers (minimum platform set from skill). */
export const MULTI_TENANCY_RESERVED_SUBDOMAIN_MARKERS = [
  "`www`",
  "`app`",
  "`api`",
  "`admin`",
  "`cdn`",
] as const;

/** Required middleware preservation row markers. */
export const MULTI_TENANCY_MIDDLEWARE_PRESERVATION_MARKERS = [
  "applyContentSecurityPolicy",
  "resolveCorrelationIdFromHeaders",
  "getSessionCookie",
] as const;

/** Required legal-entity boundary markers. */
export const MULTI_TENANCY_LEGAL_ENTITY_BOUNDARY_MARKERS = [
  "tenant only",
  "never selects legal entity",
  "never from subdomain",
] as const;

export const MULTI_TENANCY_TENANT_URL_RESOLVER_GATE =
  "scripts/governance/check-multi-tenancy-tenant-url-resolver.mts" as const;

export const MULTI_TENANCY_TENANT_URL_RESOLVER_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-tenant-url-resolver-enforcement.mts" as const;
