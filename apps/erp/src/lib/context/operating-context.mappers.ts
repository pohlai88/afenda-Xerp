import type {
  CompanyLookupRow,
  EntityGroupLookupRow,
  OrganizationLookupRow,
  TenantLookupRow,
} from "@afenda/database";
import {
  brandRequiredCountryCode,
  brandRequiredCurrencyCode,
  type EntityGroupContext,
  type LegalEntityCompanyType,
  type LegalEntityContext,
  ORGANIZATION_UNIT_TYPES,
  type OrganizationUnitContext,
  type OrganizationUnitType,
  parseCompanyId,
  parseOptionalEntityGroupId,
  parseUnknownEntityGroupContext,
  parseUnknownOrganizationUnitContext,
  parseUnknownTeamContext,
  parseUnknownTenantContext,
  type RelationshipToHoldingCompanyType,
  type TeamContext,
  type TenantContext,
  type TenantId,
} from "@afenda/kernel";

/** Persisted DB enum values — mapped to Kernel routing shape at ERP trust boundary. */
const LEGACY_DB_COMPANY_TYPE_TO_KERNEL: Record<
  string,
  {
    readonly companyType: LegalEntityCompanyType;
    readonly relationshipToHoldingCompany: RelationshipToHoldingCompanyType | null;
  }
> = {
  holding: {
    companyType: "holding",
    relationshipToHoldingCompany: null,
  },
  parent: {
    companyType: "group_company",
    relationshipToHoldingCompany: null,
  },
  subsidiary: {
    companyType: "group_company",
    relationshipToHoldingCompany: "subsidiary",
  },
  associate: {
    companyType: "group_company",
    relationshipToHoldingCompany: "associate",
  },
  joint_venture: {
    companyType: "group_company",
    relationshipToHoldingCompany: "joint_venture",
  },
  minority_interest: {
    companyType: "group_company",
    relationshipToHoldingCompany: "minority_investment",
  },
  branch_entity: {
    companyType: "branch_entity",
    relationshipToHoldingCompany: null,
  },
  standalone: {
    companyType: "standalone",
    relationshipToHoldingCompany: null,
  },
};

function formatIsoDateOnly(value: string | Date | null): string | null {
  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

function toTenantContext(row: TenantLookupRow): TenantContext {
  return parseUnknownTenantContext({
    tenantId: row.enterpriseId,
    slug: row.slug,
    displayName: row.name,
    status: row.status,
  });
}

function isOrganizationUnitType(value: string): value is OrganizationUnitType {
  return (ORGANIZATION_UNIT_TYPES as readonly string[]).includes(value);
}

function toOrganizationUnitType(value: string): OrganizationUnitType {
  return isOrganizationUnitType(value) ? value : "department";
}

function mapLegacyDbCompanyType(rowCompanyType: string): {
  readonly companyType: LegalEntityCompanyType;
  readonly relationshipToHoldingCompany: RelationshipToHoldingCompanyType | null;
} {
  return (
    LEGACY_DB_COMPANY_TYPE_TO_KERNEL[rowCompanyType] ?? {
      companyType: "standalone",
      relationshipToHoldingCompany: null,
    }
  );
}

function toLegalEntityContext(
  row: CompanyLookupRow,
  tenantId: TenantId
): LegalEntityContext {
  const routing = mapLegacyDbCompanyType(row.companyType);

  return {
    companyId: parseCompanyId(row.enterpriseId),
    tenantId,
    entityGroupId: parseOptionalEntityGroupId(row.entityGroupEnterpriseId),
    slug: row.slug,
    legalName: row.legalName,
    displayName: row.displayName,
    registrationNumber: row.registrationNumber,
    taxRegistrationNumber: row.taxId,
    countryCode: brandRequiredCountryCode(row.countryCode),
    baseCurrency: brandRequiredCurrencyCode(row.baseCurrency),
    reportingCurrency: null,
    companyType: routing.companyType,
    relationshipToHoldingCompany: routing.relationshipToHoldingCompany,
    fiscalCalendarId: row.fiscalCalendarId,
    effectiveFrom: formatIsoDateOnly(row.effectiveFrom),
    effectiveTo: formatIsoDateOnly(row.effectiveTo),
    status: row.status,
  };
}

function toOrganizationUnitContext(
  row: OrganizationLookupRow,
  tenantId: TenantId
): OrganizationUnitContext {
  return parseUnknownOrganizationUnitContext({
    organizationUnitId: row.enterpriseId,
    tenantId,
    companyId: row.companyEnterpriseId,
    slug: row.slug,
    displayName: row.name,
    organizationUnitType: toOrganizationUnitType(row.type),
    parentOrganizationUnitId: row.parentOrganizationEnterpriseId,
    status: row.status,
    effectiveFrom: formatIsoDateOnly(row.effectiveFrom),
    effectiveTo: formatIsoDateOnly(row.effectiveTo),
  });
}

function toEntityGroupContext(
  row: EntityGroupLookupRow,
  tenantId: TenantId
): EntityGroupContext {
  return parseUnknownEntityGroupContext({
    entityGroupId: row.enterpriseId,
    tenantId,
    slug: row.slug,
    displayName: row.displayName,
    parentLegalEntityId: row.parentLegalEntityEnterpriseId,
    status: row.status,
  });
}

function toTeamContext(org: OrganizationUnitContext): TeamContext {
  return parseUnknownTeamContext({
    teamId: org.organizationUnitId,
    tenantId: org.tenantId,
    companyId: org.companyId,
    organizationUnitId: org.organizationUnitId,
    slug: org.slug,
    displayName: org.displayName,
    status: org.status,
  });
}

export {
  toEntityGroupContext,
  toLegalEntityContext,
  toOrganizationUnitContext,
  toTeamContext,
  toTenantContext,
};
