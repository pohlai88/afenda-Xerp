/**
 * Canonical Step 5 persistence + lookup registry — aligned with
 * `docs/architecture/multi-tenancy.md` (§538–551).
 *
 * Foundation tables, required indexes, and lookup adapters. No accounting tables.
 */
export const MULTI_TENANCY_FOUNDATION_TABLES = [
  {
    table: "tenants",
    schemaFile: "schema/tenant.schema.ts",
    serviceModule: "tenant/tenant.service.ts",
    status: "implemented",
  },
  {
    table: "entity_groups",
    schemaFile: "schema/entity-group.schema.ts",
    serviceModule: "entity-group/entity-group.service.ts",
    status: "implemented",
  },
  {
    table: "companies",
    schemaFile: "schema/company.schema.ts",
    serviceModule: "company/company.service.ts",
    status: "implemented",
  },
  {
    table: "legal_entity_ownership",
    schemaFile: "schema/legal-entity-ownership.schema.ts",
    serviceModule: "ownership-interest/ownership-interest.service.ts",
    status: "implemented",
  },
  {
    table: "organizations",
    schemaFile: "schema/organization.schema.ts",
    serviceModule: "organization/organization.service.ts",
    status: "implemented",
  },
  {
    table: "memberships",
    schemaFile: "schema/membership.schema.ts",
    serviceModule: "membership/membership.service.ts",
    status: "implemented",
  },
] as const;

/** Required indexes per Step 5 bullet (§544–550). */
export const MULTI_TENANCY_REQUIRED_INDEXES = [
  {
    step5Key: "tenant-slug",
    label: "tenant slug/domain",
    schemaFile: "schema/tenant.schema.ts",
    indexNames: ["tenants_slug_unique"] as const,
  },
  {
    step5Key: "entity-group-under-tenant",
    label: "entity group under tenant",
    schemaFile: "schema/entity-group.schema.ts",
    indexNames: [
      "entity_groups_tenant_slug_unique",
      "entity_groups_tenant_id_idx",
    ] as const,
  },
  {
    step5Key: "legal-entity-under-tenant",
    label: "legal entity under tenant/entity group",
    schemaFile: "schema/company.schema.ts",
    indexNames: [
      "companies_tenant_slug_unique",
      "companies_entity_group_id_idx",
      "companies_tenant_id_idx",
    ] as const,
  },
  {
    step5Key: "ownership-effective-dated",
    label: "ownership parent/investee/effective date",
    schemaFile: "schema/legal-entity-ownership.schema.ts",
    indexNames: [
      "legal_entity_ownership_parent_child_effective_unique",
      "legal_entity_ownership_parent_legal_entity_id_idx",
      "legal_entity_ownership_child_legal_entity_id_idx",
    ] as const,
  },
  {
    step5Key: "organization-under-legal-entity",
    label: "organization unit under legal entity",
    schemaFile: "schema/organization.schema.ts",
    indexNames: [
      "organizations_company_slug_unique",
      "organizations_company_id_idx",
      "organizations_tenant_company_idx",
    ] as const,
  },
] as const;

/** Read-only tenant-domain lookup adapters (no authority grants). */
export const MULTI_TENANCY_LOOKUP_FUNCTIONS = [
  {
    name: "findTenantBySlug",
    file: "workspace/workspace-lookup.service.ts",
  },
  {
    name: "findTenantById",
    file: "workspace/workspace-lookup.service.ts",
  },
  {
    name: "findEntityGroupById",
    file: "workspace/workspace-lookup.service.ts",
  },
  {
    name: "findCompanyByTenantAndSlug",
    file: "workspace/workspace-lookup.service.ts",
  },
  {
    name: "findCompanyById",
    file: "workspace/workspace-lookup.service.ts",
  },
  {
    name: "findOrganizationByCompanyAndSlug",
    file: "workspace/workspace-lookup.service.ts",
  },
  {
    name: "findOrganizationById",
    file: "workspace/workspace-lookup.service.ts",
  },
  {
    name: "findOwnershipInterestsByEntityGroup",
    file: "ownership-interest/ownership-interest-lookup.service.ts",
  },
] as const;

/** Accounting schema filenames that must not exist in this slice. */
export const MULTI_TENANCY_FORBIDDEN_ACCOUNTING_SCHEMA_FILES = [
  "journal.schema.ts",
  "ledger.schema.ts",
  "chart-of-accounts.schema.ts",
  "general-ledger.schema.ts",
  "posting.schema.ts",
] as const;

export type MultiTenancyFoundationTable =
  (typeof MULTI_TENANCY_FOUNDATION_TABLES)[number]["table"];

export type MultiTenancyRequiredIndexKey =
  (typeof MULTI_TENANCY_REQUIRED_INDEXES)[number]["step5Key"];
