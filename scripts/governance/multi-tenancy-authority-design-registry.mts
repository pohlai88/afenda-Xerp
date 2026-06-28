/**
 * Canonical authority design registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 3, lines 503–509).
 *
 * Step 3 confirms package boundaries after existing-state audit and before
 * context contract changes. Runtime checks live in
 * `lib/multi-tenancy-authority-design-enforcement.mts`.
 */
export const MULTI_TENANCY_AUTHORITY_DESIGN_SURFACE_RULE =
  "multi-tenancy-authority-design-is-canonical-package-boundary-confirmation" as const;

/** Markers that must appear in multi-tenancy.md Step 3 (§503–509). */
export const MULTI_TENANCY_DOC_AUTHORITY_DESIGN_MARKERS = [
  "Step 3 — Authority design",
  "Confirm package ownership.",
  "Confirm dependency edges.",
  "Confirm which contracts belong in kernel.",
  "Confirm which persistence belongs in database.",
  "Confirm what apps/erp owns.",
] as const;

/** Delivery doc H2 — must match `MULTI_TENANCY_DELIVERY_REQUIRED_SECTIONS` entry. */
export const MULTI_TENANCY_AUTHORITY_DESIGN_SECTION = "Authority design" as const;

/** Step 3 authority dimensions — one table per bullet in §505–509. */
export const MULTI_TENANCY_AUTHORITY_DESIGN_DIMENSIONS = [
  {
    id: "package-ownership",
    title: "Package ownership confirmation",
    tableMarker: "### Package ownership",
    registryImport:
      "packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts",
    registryExport: "MULTI_TENANCY_AUTHORITY_OWNERS",
  },
  {
    id: "dependency-edges",
    title: "Dependency edge confirmation",
    tableMarker: "### Dependency edges",
    registryImport:
      "packages/architecture-authority/src/surface/architecture-authority-surface-registry.ts",
    registryExports: [
      "MULTI_TENANCY_REQUIRED_APPROVED_RUNTIME_EDGES",
      "MULTI_TENANCY_FORBIDDEN_RUNTIME_EDGES",
    ] as const,
  },
  {
    id: "kernel-contracts",
    title: "Kernel serializable contracts",
    tableMarker: "### Kernel contracts",
    registryImport: "packages/kernel/src/context/context-registry.ts",
    registryExport: "KERNEL_OPERATING_CONTEXT_REQUIRED_MODULES",
  },
  {
    id: "database-persistence",
    title: "Database persistence ownership",
    tableMarker: "### Database persistence",
    registryImport:
      "packages/database/src/tenant-domain/tenant-domain-registry.ts",
    registryExport: "DATABASE_TENANT_DOMAIN_MODULES",
  },
  {
    id: "erp-ownership",
    title: "ERP application ownership",
    tableMarker: "### ERP application ownership",
    artifactPaths: [
      "apps/erp/src/proxy.ts",
      "apps/erp/src/lib/context/tenant-domain.server.ts",
      "apps/erp/src/lib/context/resolve-operating-context.server.ts",
      "apps/erp/src/lib/context/resolve-legal-entity-context.server.ts",
      "apps/erp/src/lib/context/resolve-grant-scope.server.ts",
      "apps/erp/src/lib/context/context-errors.ts",
      "apps/erp/src/lib/context/context-switch.action.ts",
      "apps/erp/src/lib/api/authorize-api-route.ts",
      "apps/erp/src/lib/api/resolve-api-route-operating-context.ts",
    ] as const,
  },
] as const;

/** Required package ownership row markers (architecture-authority registry). */
export const MULTI_TENANCY_PACKAGE_OWNERSHIP_ROW_MARKERS = [
  "| `@afenda/kernel` |",
  "| `@afenda/database` |",
  "| `apps/erp` |",
  "| `@afenda/permissions` |",
  "| `@afenda/observability` |",
  "| `@afenda/appshell` |",
  "serializable context contracts",
  "persistence and query adapters",
  "Next.js request/context integration",
] as const;

/** Required dependency edge audit row markers. */
export const MULTI_TENANCY_DEPENDENCY_EDGE_ROW_MARKERS = [
  "@afenda/erp → @afenda/kernel",
  "@afenda/erp → @afenda/permissions",
  "@afenda/permissions → @afenda/kernel",
  "@afenda/appshell → @afenda/kernel",
  "@afenda/appshell → @afenda/database",
  "@afenda/appshell → @afenda/permissions",
  "check:multi-tenancy-dependency-rules",
] as const;

/** Required kernel contract types in the authority design table. */
export const MULTI_TENANCY_KERNEL_CONTRACT_ROW_MARKERS = [
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

/** Required database persistence row markers (glossary term or directory). */
export const MULTI_TENANCY_DATABASE_PERSISTENCE_ROW_MARKERS = [
  "| tenant |",
  "| entity-group |",
  "| legal-entity |",
  "| ownership-interest |",
  "| organization-unit |",
  "| team |",
  "| project |",
  "| grant-scope |",
  "| tenant-domain |",
] as const;

/** Required ERP ownership row markers. */
export const MULTI_TENANCY_ERP_OWNERSHIP_ROW_MARKERS = [
  "proxy.ts",
  "tenant-domain.server.ts",
  "resolve-operating-context.server.ts",
  "resolve-legal-entity-context.server.ts",
  "resolve-grant-scope.server.ts",
  "context-switch.action.ts",
  "authorize-api-route.ts",
  "rejectUntrustedAuthorityFields",
  "x-tenant-slug",
] as const;

export const MULTI_TENANCY_AUTHORITY_DESIGN_GATE =
  "scripts/governance/check-multi-tenancy-authority-design.mts" as const;

export const MULTI_TENANCY_AUTHORITY_DESIGN_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-authority-design-enforcement.mts" as const;
