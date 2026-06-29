import type {
  LegalEntityCompanyType as DbLegalEntityCompanyType,
  TenantLookupRow,
} from "@afenda/database";
import {
  type LegalEntityCompanyType as KernelLegalEntityCompanyType,
  parseUnknownTenantContext,
  type RelationshipToHoldingCompanyType,
  type TenantContext,
} from "@afenda/kernel";

import { mapPlatformLifecycleStatusToTenantSaasLifecyclePhase } from "./map-tenant-saas-lifecycle-phase";

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
