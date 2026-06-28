import { and, asc, eq } from "drizzle-orm";

import type {
  CompanyStatus,
  LegalEntityCompanyType,
  OrganizationStatus,
  TenantStatus,
} from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { companies } from "../schema/company.schema.js";
import { entityGroups } from "../schema/entity-group.schema.js";
import { organizations } from "../schema/organization.schema.js";
import { tenants } from "../schema/tenant.schema.js";

export interface TenantLookupRow {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly status: TenantStatus;
}

export interface CompanyLookupRow {
  readonly baseCurrency: string;
  readonly companyType: LegalEntityCompanyType;
  readonly countryCode: string;
  readonly displayName: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly entityGroupId: string | null;
  readonly fiscalCalendarId: string | null;
  readonly id: string;
  readonly legalName: string;
  readonly registrationNumber: string | null;
  readonly slug: string;
  readonly status: CompanyStatus;
  readonly taxId: string | null;
  readonly tenantId: string;
}

const companyLookupSelect = {
  id: companies.id,
  tenantId: companies.tenantId,
  entityGroupId: companies.entityGroupId,
  slug: companies.slug,
  legalName: companies.legalName,
  displayName: companies.displayName,
  registrationNumber: companies.registrationNumber,
  taxId: companies.taxId,
  baseCurrency: companies.baseCurrency,
  countryCode: companies.countryCode,
  companyType: companies.companyType,
  fiscalCalendarId: companies.fiscalCalendarId,
  effectiveFrom: companies.effectiveFrom,
  effectiveTo: companies.effectiveTo,
  status: companies.status,
} as const;

export interface EntityGroupLookupRow {
  readonly displayName: string;
  readonly id: string;
  readonly parentLegalEntityId: string | null;
  readonly slug: string;
  readonly status: CompanyStatus;
  readonly tenantId: string;
}

export interface OrganizationLookupRow {
  readonly companyId: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly id: string;
  readonly name: string;
  readonly parentOrganizationId: string | null;
  readonly slug: string;
  readonly status: OrganizationStatus;
  readonly tenantId: string;
  readonly type: string;
}

const organizationLookupSelect = {
  id: organizations.id,
  tenantId: organizations.tenantId,
  companyId: organizations.companyId,
  slug: organizations.slug,
  name: organizations.name,
  type: organizations.type,
  parentOrganizationId: organizations.parentOrganizationId,
  status: organizations.status,
  effectiveFrom: organizations.effectiveFrom,
  effectiveTo: organizations.effectiveTo,
} as const;

export { organizationLookupSelect };

export async function findTenantBySlug(
  slug: string,
  db: AfendaDatabase = getDb()
): Promise<TenantLookupRow | null> {
  const [row] = await db
    .select({
      id: tenants.id,
      slug: tenants.slug,
      name: tenants.name,
      status: tenants.status,
    })
    .from(tenants)
    .where(eq(tenants.slug, slug))
    .limit(1);

  return row ?? null;
}

/** Resolves canonical enterprise tenant ID (`ten_*`) to internal uuid PK row. */
export async function findTenantByEnterpriseId(
  enterpriseId: string,
  db: AfendaDatabase = getDb()
): Promise<TenantLookupRow | null> {
  const [row] = await db
    .select({
      id: tenants.id,
      slug: tenants.slug,
      name: tenants.name,
      status: tenants.status,
    })
    .from(tenants)
    .where(eq(tenants.enterpriseId, enterpriseId))
    .limit(1);

  return row ?? null;
}

export async function findCompanyByTenantAndSlug(
  tenantId: string,
  slug: string,
  db: AfendaDatabase = getDb()
): Promise<CompanyLookupRow | null> {
  const [row] = await db
    .select(companyLookupSelect)
    .from(companies)
    .where(and(eq(companies.tenantId, tenantId), eq(companies.slug, slug)))
    .limit(1);

  return row ?? null;
}

export async function findCompanyById(
  companyId: string,
  db: AfendaDatabase = getDb()
): Promise<CompanyLookupRow | null> {
  const [row] = await db
    .select(companyLookupSelect)
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  return row ?? null;
}

export async function findOrganizationByCompanyAndSlug(
  companyId: string,
  slug: string,
  db: AfendaDatabase = getDb()
): Promise<OrganizationLookupRow | null> {
  const [row] = await db
    .select(organizationLookupSelect)
    .from(organizations)
    .where(
      and(eq(organizations.companyId, companyId), eq(organizations.slug, slug))
    )
    .limit(1);

  return row ?? null;
}

export async function findOrganizationById(
  organizationId: string,
  db: AfendaDatabase = getDb()
): Promise<OrganizationLookupRow | null> {
  const [row] = await db
    .select(organizationLookupSelect)
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);

  return row ?? null;
}

export async function findEntityGroupById(
  entityGroupId: string,
  db: AfendaDatabase = getDb()
): Promise<EntityGroupLookupRow | null> {
  const [row] = await db
    .select({
      id: entityGroups.id,
      tenantId: entityGroups.tenantId,
      slug: entityGroups.slug,
      displayName: entityGroups.displayName,
      parentLegalEntityId: entityGroups.parentLegalEntityId,
      status: entityGroups.status,
    })
    .from(entityGroups)
    .where(eq(entityGroups.id, entityGroupId))
    .limit(1);

  return row ?? null;
}

/** Active legal entities belonging to an entity group — ordered for deterministic default selection. */
export async function findActiveCompaniesByEntityGroupId(
  entityGroupId: string,
  tenantId: string,
  db: AfendaDatabase = getDb()
): Promise<readonly CompanyLookupRow[]> {
  return db
    .select(companyLookupSelect)
    .from(companies)
    .where(
      and(
        eq(companies.entityGroupId, entityGroupId),
        eq(companies.tenantId, tenantId),
        eq(companies.status, "active")
      )
    )
    .orderBy(asc(companies.displayName));
}

export async function findTenantById(
  tenantId: string,
  db: AfendaDatabase = getDb()
): Promise<TenantLookupRow | null> {
  const [row] = await db
    .select({
      id: tenants.id,
      slug: tenants.slug,
      name: tenants.name,
      status: tenants.status,
    })
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);

  return row ?? null;
}
