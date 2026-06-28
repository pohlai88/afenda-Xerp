/**
 * Canonical tenant-domain module registry — aligned with
 * `docs/architecture/multi-tenancy.md` (Database package, lines 376–384).
 */
export const DATABASE_TENANT_DOMAIN_MODULES = [
  {
    directory: "tenant",
    glossaryTerm: "Tenant",
    table: "tenants",
    status: "implemented",
  },
  {
    directory: "entity-group",
    glossaryTerm: "Entity Group",
    table: "entity_groups",
    status: "implemented",
  },
  {
    directory: "legal-entity",
    glossaryTerm: "Legal Entity / Company",
    table: "companies",
    status: "implemented",
    legacyDirectory: "company",
  },
  {
    directory: "ownership-interest",
    glossaryTerm: "Ownership Interest",
    table: "legal_entity_ownership",
    status: "implemented",
  },
  {
    directory: "organization-unit",
    glossaryTerm: "Organization Unit",
    table: "organizations",
    status: "implemented",
    legacyDirectory: "organization",
  },
  {
    directory: "team",
    glossaryTerm: "Team",
    table: "organizations",
    status: "partial",
    notes: "type = team until Foundation phase 30 dedicated table",
  },
  {
    directory: "project",
    glossaryTerm: "Project",
    table: null,
    status: "planned",
    notes: "Foundation phase 30 — authority stub only",
  },
  {
    directory: "grant-scope",
    glossaryTerm: "RLS Grant",
    table: "memberships",
    status: "implemented",
    legacyDirectory: "rls",
  },
  {
    directory: "tenant-domain",
    glossaryTerm: "Workspace resolution",
    table: null,
    status: "implemented",
    notes: "cross-tier lookup adapters — not a governed table",
  },
] as const;

export type DatabaseTenantDomainModule =
  (typeof DATABASE_TENANT_DOMAIN_MODULES)[number]["directory"];

export type DatabaseTenantDomainImplementationStatus =
  (typeof DATABASE_TENANT_DOMAIN_MODULES)[number]["status"];

/** Directories that must expose an index.ts barrel. */
export const DATABASE_TENANT_DOMAIN_BARREL_DIRECTORIES =
  DATABASE_TENANT_DOMAIN_MODULES.map((module) => module.directory);
