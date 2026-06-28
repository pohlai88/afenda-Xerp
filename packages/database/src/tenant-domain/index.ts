/**
 * Cross-tier workspace resolution adapters — read-only lookups, no authority grants.
 */
export {
  type CompanyLookupRow,
  type EntityGroupLookupRow,
  findCompanyById,
  findCompanyByTenantAndSlug,
  findEntityGroupById,
  findOrganizationByCompanyAndSlug,
  findOrganizationById,
  findTenantByEnterpriseId,
  findTenantById,
  findTenantBySlug,
  type OrganizationLookupRow,
  organizationLookupSelect,
  type TenantLookupRow,
} from "../workspace/workspace-lookup.service.js";
export {
  MULTI_TENANCY_FORBIDDEN_ACCOUNTING_SCHEMA_FILES,
  MULTI_TENANCY_FOUNDATION_TABLES,
  MULTI_TENANCY_LOOKUP_FUNCTIONS,
  MULTI_TENANCY_REQUIRED_INDEXES,
  type MultiTenancyFoundationTable,
  type MultiTenancyRequiredIndexKey,
} from "./persistence-lookup-registry.js";
export {
  DATABASE_TENANT_DOMAIN_BARREL_DIRECTORIES,
  DATABASE_TENANT_DOMAIN_MODULES,
  type DatabaseTenantDomainImplementationStatus,
  type DatabaseTenantDomainModule,
} from "./tenant-domain-registry.js";
