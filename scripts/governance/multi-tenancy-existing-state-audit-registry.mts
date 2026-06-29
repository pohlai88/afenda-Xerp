/**
 * Canonical existing-state audit registry — aligned with
 * `docs/PAS/KERNEL/multi-tenancy-delivery-evidence.md` (Step 2, lines 502–511).
 *
 * Step 2 must complete after glossary-first and before modifying authority surfaces.
 * Runtime checks live in `lib/multi-tenancy-existing-state-audit-enforcement.mts`.
 */
export const MULTI_TENANCY_EXISTING_STATE_AUDIT_SURFACE_RULE =
  "multi-tenancy-existing-state-audit-is-canonical-pre-modification-baseline" as const;

/** Markers that must appear in multi-tenancy.md Step 2 (§502–511). */
export const MULTI_TENANCY_DOC_EXISTING_STATE_AUDIT_MARKERS = [
  "Step 2 — Existing-state audit",
  "Audit existing schemas for tenant/company/org/team/project.",
  "Audit existing kernel context.",
  "Audit existing permission/grant model.",
  "Audit existing AppShell context model.",
  "Audit existing tenant subdomain/proxy/middleware.",
  "Audit API/server actions using company/org IDs.",
  "Output table before modifying.",
] as const;

/** Delivery doc H2 — must match `MULTI_TENANCY_DELIVERY_REQUIRED_SECTIONS` entry. */
export const MULTI_TENANCY_EXISTING_STATE_AUDIT_SECTION =
  "Existing-state audit" as const;

/** Step 2 audit dimensions — one table per bullet in §502–510. */
export const MULTI_TENANCY_EXISTING_STATE_AUDIT_DIMENSIONS = [
  {
    id: "schemas",
    title: "Schema audit (tenant / company / org / team / project)",
    tableMarker: "### Schema audit",
    registryImport:
      "packages/database/src/tenant-domain/tenant-domain-registry.ts",
    registryExport: "DATABASE_TENANT_DOMAIN_MODULES",
  },
  {
    id: "kernel-context",
    title: "Kernel context audit",
    tableMarker: "### Kernel context audit",
    registryImport: "packages/kernel/src/context/context-registry.ts",
    registryExport: "KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES",
  },
  {
    id: "permission-grant",
    title: "Permission / grant model audit",
    tableMarker: "### Permission and grant model audit",
    registryImport:
      "packages/permissions/src/permissions-scope-grants-registry.ts",
    registryExport: "PERMISSIONS_SCOPE_GRANTS_MODULES",
  },
  {
    id: "appshell-context",
    title: "AppShell context model audit",
    tableMarker: "### AppShell context model audit",
    registryImport:
      "packages/appshell/src/context/appshell-context-surface-registry.ts",
    registryExport: "APPSHELL_CONTEXT_CONSUMPTION_MODULES",
  },
  {
    id: "tenant-subdomain",
    title: "Tenant subdomain / proxy / middleware audit",
    tableMarker: "### Tenant subdomain and proxy audit",
    artifactPaths: [
      "apps/erp/src/proxy.ts",
      "apps/erp/src/lib/context/tenant-domain.ts",
      "apps/erp/src/lib/context/context.constants.ts",
    ] as const,
  },
  {
    id: "api-actions",
    title: "API and server actions using company / org IDs",
    tableMarker: "### API and server actions audit",
    artifactPaths: [
      "apps/erp/src/lib/api/authorize-api-route.ts",
      "apps/erp/src/lib/api/resolve-api-route-operating-context.ts",
      "apps/erp/src/lib/context/resolve-operating-context.server.ts",
      "apps/erp/src/lib/context/resolve-legal-entity-context.server.ts",
      "apps/erp/src/lib/context/resolve-grant-scope.server.ts",
      "apps/erp/src/lib/context/reject-untrusted-authority-fields.ts",
      "apps/erp/src/lib/server-actions/parse-protected-action-input.ts",
      "apps/erp/src/lib/context/context-switch.action.ts",
    ] as const,
  },
] as const;

/** Required schema audit row identifiers (glossary term or table name). */
export const MULTI_TENANCY_SCHEMA_AUDIT_ROW_MARKERS = [
  "| Tenant |",
  "| Entity Group |",
  "| Legal Entity / Company |",
  "| Ownership Interest |",
  "| Organization Unit |",
  "| Team |",
  "| Project |",
] as const;

/** Required kernel context contract types in the audit table. */
export const MULTI_TENANCY_KERNEL_CONTEXT_AUDIT_ROW_MARKERS = [
  "TenantContext",
  "EntityGroupContext",
  "LegalEntityContext",
  "OwnershipInterestContext",
  "OrganizationUnitContext",
  "TeamContext",
  "ProjectContext",
  "OperatingContext",
  "PermissionScopeContext",
  "ConsolidationScopeContext",
] as const;

/** Required permission/grant audit row markers. */
export const MULTI_TENANCY_PERMISSION_GRANT_AUDIT_ROW_MARKERS = [
  "| scope |",
  "| grants |",
  "`tenant`",
  "`company`",
  "`organization`",
  "entity_group",
  "project",
] as const;

/** Required AppShell context audit row markers. */
export const MULTI_TENANCY_APPSHELL_CONTEXT_AUDIT_ROW_MARKERS = [
  "ApplicationShellOperatingContext",
  "consume-context-only",
  "app-shell-context-switcher",
] as const;

/** Required tenant subdomain audit row markers. */
export const MULTI_TENANCY_TENANT_SUBDOMAIN_AUDIT_ROW_MARKERS = [
  "x-tenant-slug",
  "resolveTenantSlugFromHostname",
  "resolveTenantSlugFromPathname",
  "tenant only",
] as const;

/** Required API/action authority audit row markers. */
export const MULTI_TENANCY_API_ACTIONS_AUDIT_ROW_MARKERS = [
  "rejectUntrustedAuthorityFields",
  "resolveOperatingContext",
  "authorizeApiRoute",
  "parse-protected-action-input",
] as const;

/** Valid implementation status values for audit tables. */
export const MULTI_TENANCY_AUDIT_STATUS_VALUES = [
  "implemented",
  "partial",
  "planned",
  "authority foundation",
  "in progress",
  "missing",
] as const;

export const MULTI_TENANCY_EXISTING_STATE_AUDIT_GATE =
  "scripts/governance/check-multi-tenancy-existing-state-audit.mts" as const;

export const MULTI_TENANCY_EXISTING_STATE_AUDIT_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-existing-state-audit-enforcement.mts" as const;
