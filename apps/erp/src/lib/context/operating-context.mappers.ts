import type {
  CompanyLookupRow,
  EntityGroupLookupRow,
  OrganizationLookupRow,
  TenantLookupRow,
} from "@afenda/database";
import type {
  EntityGroupContext,
  LegalEntityCompanyType,
  LegalEntityContext,
  OrganizationUnitContext,
  OrganizationUnitType,
  TeamContext,
  TenantContext,
} from "@afenda/kernel";

function formatIsoDateOnly(value: string | Date | null): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

function toLegalEntityCompanyType(value: string): LegalEntityCompanyType {
  const allowed: readonly LegalEntityCompanyType[] = [
    "holding",
    "parent",
    "subsidiary",
    "associate",
    "joint_venture",
    "minority_interest",
    "branch_entity",
    "standalone",
  ];

  if ((allowed as readonly string[]).includes(value)) {
    return value as LegalEntityCompanyType;
  }

  return "standalone";
}

function toTenantContext(row: TenantLookupRow): TenantContext {
  return {
    tenantId: row.id,
    slug: row.slug,
    displayName: row.name,
    status: row.status,
  };
}

function toOrganizationUnitType(value: string): OrganizationUnitType {
  const allowed: readonly OrganizationUnitType[] = [
    "branch",
    "department",
    "site",
    "farm",
    "factory",
    "warehouse",
    "retail_outlet",
    "cost_center",
    "shared_service",
    "operating_unit",
    "company_root",
    "team",
  ];

  if ((allowed as readonly string[]).includes(value)) {
    return value as OrganizationUnitType;
  }

  return "department";
}

function toLegalEntityContext(row: CompanyLookupRow): LegalEntityContext {
  return {
    companyId: row.id,
    tenantId: row.tenantId,
    entityGroupId: row.entityGroupId,
    slug: row.slug,
    legalName: row.legalName,
    displayName: row.displayName,
    registrationNumber: row.registrationNumber,
    taxRegistrationNumber: row.taxId,
    countryCode: row.countryCode,
    baseCurrency: row.baseCurrency,
    reportingCurrency: null,
    companyType: toLegalEntityCompanyType(row.companyType),
    fiscalCalendarId: row.fiscalCalendarId,
    effectiveFrom: formatIsoDateOnly(row.effectiveFrom),
    effectiveTo: formatIsoDateOnly(row.effectiveTo),
    status: row.status,
  };
}

function toOrganizationUnitContext(
  row: OrganizationLookupRow
): OrganizationUnitContext {
  return {
    organizationUnitId: row.id,
    tenantId: row.tenantId,
    companyId: row.companyId,
    slug: row.slug,
    displayName: row.name,
    organizationUnitType: toOrganizationUnitType(row.type),
    parentOrganizationUnitId: row.parentOrganizationId,
    status: row.status,
    effectiveFrom: formatIsoDateOnly(row.effectiveFrom),
    effectiveTo: formatIsoDateOnly(row.effectiveTo),
  };
}

function toEntityGroupContext(row: EntityGroupLookupRow): EntityGroupContext {
  return {
    entityGroupId: row.id,
    tenantId: row.tenantId,
    slug: row.slug,
    displayName: row.displayName,
    parentLegalEntityId: row.parentLegalEntityId,
    status: row.status,
  };
}

function toTeamContext(org: OrganizationUnitContext): TeamContext {
  return {
    teamId: org.organizationUnitId,
    tenantId: org.tenantId,
    companyId: org.companyId,
    organizationUnitId: org.organizationUnitId,
    slug: org.slug,
    displayName: org.displayName,
    status: org.status,
  };
}

export {
  toEntityGroupContext,
  toLegalEntityContext,
  toOrganizationUnitContext,
  toTeamContext,
  toTenantContext,
};
