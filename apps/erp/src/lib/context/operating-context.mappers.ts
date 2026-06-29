import type {
  CompanyLookupRow,
  LegalEntityCompanyType as DbLegalEntityCompanyType,
  EntityGroupLookupRow,
  OrganizationLookupRow,
  OwnershipInterestLookupRow,
  TenantLookupRow,
} from "@afenda/database";
import {
  brandRequiredCountryCode,
  brandRequiredCurrencyCode,
  type EntityGroupContext,
  type LegalEntityCompanyType as KernelLegalEntityCompanyType,
  type LegalEntityContext,
  ORGANIZATION_UNIT_TYPES,
  type OrganizationUnitContext,
  type OrganizationUnitType,
  parseCompanyId,
  parseOptionalEntityGroupId,
  parseTenantId,
  parseUnknownEntityGroupContext,
  parseUnknownOrganizationUnitContext,
  parseUnknownTeamContext,
  parseUnknownTenantContext,
  type RelationshipToHoldingCompanyType,
  type TeamContext,
  type TenantContext,
} from "@afenda/kernel";

import { mapPlatformLifecycleStatusToTenantSaasLifecyclePhase } from "./map-tenant-saas-lifecycle-phase";

/** Persisted DB enum values — mapped to Kernel routing shape at ERP trust boundary. */
const LEGACY_DB_COMPANY_TYPE_TO_KERNEL: Record<
  string,
  {
    readonly companyType: KernelLegalEntityCompanyType;
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

function isOrganizationUnitType(value: string): value is OrganizationUnitType {
  return (ORGANIZATION_UNIT_TYPES as readonly string[]).includes(value);
}

function toOrganizationUnitType(value: string): OrganizationUnitType {
  return isOrganizationUnitType(value) ? value : "department";
}

function mapLegacyDbCompanyType(rowCompanyType: string): {
  readonly companyType: KernelLegalEntityCompanyType;
  readonly relationshipToHoldingCompany: RelationshipToHoldingCompanyType | null;
} {
  return (
    LEGACY_DB_COMPANY_TYPE_TO_KERNEL[rowCompanyType] ?? {
      companyType: "standalone",
      relationshipToHoldingCompany: null,
    }
  );
}

/** Maps database company type vocabulary to kernel legal-entity wire fields. */
export function mapDbLegalEntityCompanyTypeToKernelWire(
  companyType: DbLegalEntityCompanyType
): {
  readonly companyType: KernelLegalEntityCompanyType;
  readonly relationshipToHoldingCompany: RelationshipToHoldingCompanyType | null;
} {
  switch (companyType) {
    case "holding":
      return { companyType: "holding", relationshipToHoldingCompany: null };
    case "parent":
      return {
        companyType: "group_company",
        relationshipToHoldingCompany: null,
      };
    case "branch_entity":
      return {
        companyType: "branch_entity",
        relationshipToHoldingCompany: null,
      };
    case "standalone":
      return { companyType: "standalone", relationshipToHoldingCompany: null };
    case "subsidiary":
      return {
        companyType: "standalone",
        relationshipToHoldingCompany: "subsidiary",
      };
    case "joint_venture":
      return {
        companyType: "standalone",
        relationshipToHoldingCompany: "joint_venture",
      };
    case "associate":
      return {
        companyType: "standalone",
        relationshipToHoldingCompany: "associate",
      };
    case "minority_interest":
      return {
        companyType: "standalone",
        relationshipToHoldingCompany: "minority_investment",
      };
    default: {
      const _exhaustive: never = companyType;
      return _exhaustive;
    }
  }
}

/** Projects kernel effective-dating fields from database ownership interest lookups. */
export function mapOwnershipInterestEffectiveDating(
  row: Pick<OwnershipInterestLookupRow, "effectiveFrom" | "effectiveTo">
): {
  readonly effectiveFrom: string;
  readonly effectiveTo: string | null;
} {
  return {
    effectiveFrom: row.effectiveFrom,
    effectiveTo: row.effectiveTo,
  };
}

export function toLegalEntityContext(
  row: CompanyLookupRow
): LegalEntityContext {
  const routing = mapLegacyDbCompanyType(row.companyType);

  return {
    companyId: parseCompanyId(row.enterpriseId),
    tenantId: parseTenantId(row.tenantId),
    entityGroupId: parseOptionalEntityGroupId(
      row.entityGroupEnterpriseId ?? row.entityGroupId
    ),
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

export function toOrganizationUnitContext(
  row: OrganizationLookupRow
): OrganizationUnitContext {
  return parseUnknownOrganizationUnitContext({
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
  });
}

export function toEntityGroupContext(
  row: EntityGroupLookupRow,
  tenantEnterpriseId: string
): EntityGroupContext {
  return parseUnknownEntityGroupContext({
    entityGroupId: row.enterpriseId,
    tenantId: tenantEnterpriseId,
    slug: row.slug,
    displayName: row.displayName,
    parentLegalEntityId: row.parentLegalEntityEnterpriseId,
    status: row.status,
  });
}

export function toTeamContext(org: OrganizationUnitContext): TeamContext {
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

/** Maps database tenant lookup rows to kernel `TenantContext` at the ERP trust boundary. */
export function toTenantContext(row: TenantLookupRow): TenantContext {
  return parseUnknownTenantContext({
    tenantId: row.enterpriseId,
    slug: row.slug,
    displayName: row.name,
    status: row.status,
    saasLifecyclePhase: mapPlatformLifecycleStatusToTenantSaasLifecyclePhase(
      row.status
    ),
  });
}
