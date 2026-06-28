/**
 * Canonical persistence and lookup registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Step 5, lines 538–551).
 *
 * Step 5 confirms foundation storage after authority design and before
 * tenant URL resolver work. Runtime checks live in
 * `lib/multi-tenancy-persistence-lookup-enforcement.mts`.
 */
export const MULTI_TENANCY_PERSISTENCE_LOOKUP_SURFACE_RULE =
  "multi-tenancy-persistence-lookup-is-canonical-foundation-storage-baseline" as const;

/** Markers that must appear in multi-tenancy.md Step 5 (§538–551). */
export const MULTI_TENANCY_DOC_PERSISTENCE_LOOKUP_MARKERS = [
  "Step 5 — Persistence and lookup",
  "Use existing tables if they exist.",
  "Add only missing foundation tables if appropriate.",
  "Add tenant domain lookup.",
  "Add legal entity and ownership interest support if missing.",
  "Add indexes and unique constraints:",
  "tenant slug/domain",
  "entity group under tenant",
  "legal entity under tenant/entity group",
  "ownership parent/investee/effective date",
  "organization unit under legal entity",
  "Do not create accounting tables.",
] as const;

/** Delivery doc H2 — must match `MULTI_TENANCY_DELIVERY_REQUIRED_SECTIONS` entry. */
export const MULTI_TENANCY_PERSISTENCE_LOOKUP_SECTION =
  "Persistence and lookup" as const;

/** Step 5 dimensions — one table per concern in §540–551. */
export const MULTI_TENANCY_PERSISTENCE_LOOKUP_DIMENSIONS = [
  {
    id: "foundation-tables",
    title: "Foundation tables",
    tableMarker: "### Foundation tables",
    registryImport:
      "packages/database/src/tenant-domain/persistence-lookup-registry.ts",
    registryExport: "MULTI_TENANCY_FOUNDATION_TABLES",
  },
  {
    id: "tenant-domain-lookup",
    title: "Tenant domain lookup",
    tableMarker: "### Tenant domain lookup",
    registryImport:
      "packages/database/src/tenant-domain/persistence-lookup-registry.ts",
    registryExport: "MULTI_TENANCY_LOOKUP_FUNCTIONS",
  },
  {
    id: "indexes-constraints",
    title: "Indexes and unique constraints",
    tableMarker: "### Indexes and unique constraints",
    registryImport:
      "packages/database/src/tenant-domain/persistence-lookup-registry.ts",
    registryExport: "MULTI_TENANCY_REQUIRED_INDEXES",
  },
  {
    id: "accounting-boundary",
    title: "Accounting scope boundary",
    tableMarker: "### Accounting scope boundary",
    registryImport:
      "packages/database/src/tenant-domain/persistence-lookup-registry.ts",
    registryExport: "MULTI_TENANCY_FORBIDDEN_ACCOUNTING_SCHEMA_FILES",
  },
] as const;

/** Required foundation table row markers in delivery doc. */
export const MULTI_TENANCY_FOUNDATION_TABLE_ROW_MARKERS = [
  "| `tenants` |",
  "| `entity_groups` |",
  "| `companies` |",
  "| `legal_entity_ownership` |",
  "| `organizations` |",
  "| `memberships` |",
] as const;

/** Required lookup function row markers. */
export const MULTI_TENANCY_LOOKUP_ROW_MARKERS = [
  "findTenantBySlug",
  "findCompanyByTenantAndSlug",
  "findOrganizationByCompanyAndSlug",
  "findOwnershipInterestsByEntityGroup",
  "workspace-lookup.service.ts",
  "ownership-interest-lookup.service.ts",
  "tenant-domain/index.ts",
] as const;

/** Required index row markers (Step 5 §544–550). */
export const MULTI_TENANCY_INDEX_ROW_MARKERS = [
  "tenants_slug_unique",
  "entity_groups_tenant_slug_unique",
  "companies_tenant_slug_unique",
  "companies_entity_group_id_idx",
  "legal_entity_ownership_parent_child_effective_unique",
  "legal_entity_ownership_parent_legal_entity_id_idx",
  "legal_entity_ownership_child_legal_entity_id_idx",
  "organizations_company_slug_unique",
  "organizations_company_id_idx",
] as const;

/** Required accounting boundary markers. */
export const MULTI_TENANCY_ACCOUNTING_BOUNDARY_ROW_MARKERS = [
  "no accounting tables",
  "journal.schema.ts",
  "ledger.schema.ts",
  "no consolidation arithmetic",
] as const;

export const MULTI_TENANCY_PERSISTENCE_LOOKUP_GATE =
  "scripts/governance/check-multi-tenancy-persistence-lookup.mts" as const;

export const MULTI_TENANCY_PERSISTENCE_LOOKUP_ENFORCEMENT_LIB =
  "scripts/governance/lib/multi-tenancy-persistence-lookup-enforcement.mts" as const;
