/**
 * Cross-tier workspace resolution adapters — read-only lookups, no authority grants.
 */
export {
  findCompanyById,
  findCompanyByTenantAndSlug,
  findEntityGroupById,
  findOrganizationByCompanyAndSlug,
  findOrganizationById,
  findTenantById,
  findTenantBySlug,
  organizationLookupSelect,
  type CompanyLookupRow,
  type EntityGroupLookupRow,
  type OrganizationLookupRow,
  type TenantLookupRow,
} from "../workspace/workspace-lookup.service.js";
export {
  DATABASE_TENANT_DOMAIN_BARREL_DIRECTORIES,
  DATABASE_TENANT_DOMAIN_MODULES,
  type DatabaseTenantDomainImplementationStatus,
  type DatabaseTenantDomainModule,
} from "./tenant-domain-registry.js";
