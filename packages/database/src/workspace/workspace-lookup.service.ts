import { and, asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

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

const parentLegalEntityCompany = alias(
  companies,
  "parent_legal_entity_company"
);
const parentOrganization = alias(organizations, "parent_organization");
const companyEntityGroup = alias(entityGroups, "company_entity_group");

export interface TenantLookupRow {
  readonly enterpriseId: string;
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
  readonly enterpriseId: string;
  readonly entityGroupEnterpriseId: string | null;
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
  enterpriseId: companies.enterpriseId,
  tenantId: companies.tenantId,
  entityGroupId: companies.entityGroupId,
  entityGroupEnterpriseId: companyEntityGroup.enterpriseId,
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
  readonly enterpriseId: string;
  readonly id: string;
  readonly parentLegalEntityEnterpriseId: string | null;
  readonly parentLegalEntityId: string | null;
  readonly slug: string;
  readonly status: CompanyStatus;
  readonly tenantId: string;
}

export interface OrganizationLookupRow {
  readonly companyEnterpriseId: string;
  readonly companyId: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly enterpriseId: string;
  readonly id: string;
  readonly name: string;
  readonly parentOrganizationEnterpriseId: string | null;
  readonly parentOrganizationId: string | null;
  readonly slug: string;
  readonly status: OrganizationStatus;
  readonly tenantId: string;
  readonly type: string;
}

const organizationLookupSelect = {
  id: organizations.id,
  enterpriseId: organizations.enterpriseId,
  tenantId: organizations.tenantId,
  companyId: organizations.companyId,
  companyEnterpriseId: companies.enterpriseId,
  slug: organizations.slug,
  name: organizations.name,
  type: organizations.type,
  parentOrganizationId: organizations.parentOrganizationId,
  parentOrganizationEnterpriseId: parentOrganization.enterpriseId,
  status: organizations.status,
  effectiveFrom: organizations.effectiveFrom,
  effectiveTo: organizations.effectiveTo,
} as const;

export { organizationLookupSelect };

type CompanyLookupSelectRow = {
  readonly baseCurrency: string;
  readonly companyType: LegalEntityCompanyType;
  readonly countryCode: string;
  readonly displayName: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly entityGroupEnterpriseId: string | null;
  readonly entityGroupId: string | null;
  readonly enterpriseId: string | null;
  readonly fiscalCalendarId: string | null;
  readonly id: string;
  readonly legalName: string;
  readonly registrationNumber: string | null;
  readonly slug: string;
  readonly status: CompanyStatus;
  readonly taxId: string | null;
  readonly tenantId: string;
};

type OrganizationLookupSelectRow = {
  readonly companyEnterpriseId: string | null;
  readonly companyId: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly enterpriseId: string | null;
  readonly id: string;
  readonly name: string;
  readonly parentOrganizationEnterpriseId: string | null;
  readonly parentOrganizationId: string | null;
  readonly slug: string;
  readonly status: OrganizationStatus;
  readonly tenantId: string;
  readonly type: string;
};

type EntityGroupLookupSelectRow = {
  readonly displayName: string;
  readonly enterpriseId: string | null;
  readonly id: string;
  readonly parentLegalEntityEnterpriseId: string | null;
  readonly parentLegalEntityId: string | null;
  readonly slug: string;
  readonly status: CompanyStatus;
  readonly tenantId: string;
};

function toCompanyLookupRow(
  row: CompanyLookupSelectRow | undefined
): CompanyLookupRow | null {
  if (!row || row.enterpriseId === null) {
    return null;
  }

  return {
    ...row,
    enterpriseId: row.enterpriseId,
  };
}

function toOrganizationLookupRow(
  row: OrganizationLookupSelectRow | undefined
): OrganizationLookupRow | null {
  if (!row || row.enterpriseId === null || row.companyEnterpriseId === null) {
    return null;
  }

  return {
    ...row,
    enterpriseId: row.enterpriseId,
    companyEnterpriseId: row.companyEnterpriseId,
  };
}

function toEntityGroupLookupRow(
  row: EntityGroupLookupSelectRow | undefined
): EntityGroupLookupRow | null {
  if (!row || row.enterpriseId === null) {
    return null;
  }

  return {
    ...row,
    enterpriseId: row.enterpriseId,
  };
}

function toTenantLookupRow(
  row:
    | {
        readonly enterpriseId: string | null;
        readonly id: string;
        readonly name: string;
        readonly slug: string;
        readonly status: TenantStatus;
      }
    | undefined
): TenantLookupRow | null {
  if (!row || row.enterpriseId === null) {
    return null;
  }

  return {
    id: row.id,
    enterpriseId: row.enterpriseId,
    slug: row.slug,
    name: row.name,
    status: row.status,
  };
}

export async function findTenantBySlug(
  slug: string,
  db: AfendaDatabase = getDb()
): Promise<TenantLookupRow | null> {
  const [row] = await db
    .select({
      id: tenants.id,
      enterpriseId: tenants.enterpriseId,
      slug: tenants.slug,
      name: tenants.name,
      status: tenants.status,
    })
    .from(tenants)
    .where(eq(tenants.slug, slug))
    .limit(1);

  return toTenantLookupRow(row);
}

/** Resolves canonical enterprise tenant ID (`ten_*`) to internal uuid PK row. */
export async function findTenantByEnterpriseId(
  enterpriseId: string,
  db: AfendaDatabase = getDb()
): Promise<TenantLookupRow | null> {
  const [row] = await db
    .select({
      id: tenants.id,
      enterpriseId: tenants.enterpriseId,
      slug: tenants.slug,
      name: tenants.name,
      status: tenants.status,
    })
    .from(tenants)
    .where(eq(tenants.enterpriseId, enterpriseId))
    .limit(1);

  return toTenantLookupRow(row);
}

export async function findCompanyByTenantAndSlug(
  tenantId: string,
  slug: string,
  db: AfendaDatabase = getDb()
): Promise<CompanyLookupRow | null> {
  const [row] = await db
    .select(companyLookupSelect)
    .from(companies)
    .leftJoin(
      companyEntityGroup,
      eq(companies.entityGroupId, companyEntityGroup.id)
    )
    .where(and(eq(companies.tenantId, tenantId), eq(companies.slug, slug)))
    .limit(1);

  return toCompanyLookupRow(row);
}

export async function findCompanyById(
  companyId: string,
  db: AfendaDatabase = getDb()
): Promise<CompanyLookupRow | null> {
  const [row] = await db
    .select(companyLookupSelect)
    .from(companies)
    .leftJoin(
      companyEntityGroup,
      eq(companies.entityGroupId, companyEntityGroup.id)
    )
    .where(eq(companies.id, companyId))
    .limit(1);

  return toCompanyLookupRow(row);
}

export async function findOrganizationByCompanyAndSlug(
  companyId: string,
  slug: string,
  db: AfendaDatabase = getDb()
): Promise<OrganizationLookupRow | null> {
  const [row] = await db
    .select(organizationLookupSelect)
    .from(organizations)
    .innerJoin(companies, eq(organizations.companyId, companies.id))
    .leftJoin(
      parentOrganization,
      eq(organizations.parentOrganizationId, parentOrganization.id)
    )
    .where(
      and(eq(organizations.companyId, companyId), eq(organizations.slug, slug))
    )
    .limit(1);

  return toOrganizationLookupRow(row);
}

export async function findOrganizationById(
  organizationId: string,
  db: AfendaDatabase = getDb()
): Promise<OrganizationLookupRow | null> {
  const [row] = await db
    .select(organizationLookupSelect)
    .from(organizations)
    .innerJoin(companies, eq(organizations.companyId, companies.id))
    .leftJoin(
      parentOrganization,
      eq(organizations.parentOrganizationId, parentOrganization.id)
    )
    .where(eq(organizations.id, organizationId))
    .limit(1);

  return toOrganizationLookupRow(row);
}

export async function findEntityGroupById(
  entityGroupId: string,
  db: AfendaDatabase = getDb()
): Promise<EntityGroupLookupRow | null> {
  const [row] = await db
    .select({
      id: entityGroups.id,
      enterpriseId: entityGroups.enterpriseId,
      tenantId: entityGroups.tenantId,
      slug: entityGroups.slug,
      displayName: entityGroups.displayName,
      parentLegalEntityId: entityGroups.parentLegalEntityId,
      parentLegalEntityEnterpriseId: parentLegalEntityCompany.enterpriseId,
      status: entityGroups.status,
    })
    .from(entityGroups)
    .leftJoin(
      parentLegalEntityCompany,
      eq(entityGroups.parentLegalEntityId, parentLegalEntityCompany.id)
    )
    .where(eq(entityGroups.id, entityGroupId))
    .limit(1);

  return toEntityGroupLookupRow(row);
}

/** Active legal entities belonging to an entity group — ordered for deterministic default selection. */
export async function findActiveCompaniesByEntityGroupId(
  entityGroupId: string,
  tenantId: string,
  db: AfendaDatabase = getDb()
): Promise<readonly CompanyLookupRow[]> {
  const rows = await db
    .select(companyLookupSelect)
    .from(companies)
    .leftJoin(
      companyEntityGroup,
      eq(companies.entityGroupId, companyEntityGroup.id)
    )
    .where(
      and(
        eq(companies.entityGroupId, entityGroupId),
        eq(companies.tenantId, tenantId),
        eq(companies.status, "active")
      )
    )
    .orderBy(asc(companies.displayName));

  return rows.flatMap((row) => {
    const mapped = toCompanyLookupRow(row);
    return mapped ? [mapped] : [];
  });
}

export async function findTenantById(
  tenantId: string,
  db: AfendaDatabase = getDb()
): Promise<TenantLookupRow | null> {
  const [row] = await db
    .select({
      id: tenants.id,
      enterpriseId: tenants.enterpriseId,
      slug: tenants.slug,
      name: tenants.name,
      status: tenants.status,
    })
    .from(tenants)
    .where(eq(tenants.id, tenantId))
    .limit(1);

  return toTenantLookupRow(row);
}
