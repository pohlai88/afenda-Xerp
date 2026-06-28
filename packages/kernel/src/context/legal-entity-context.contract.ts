import type {
  CompanyId,
  CountryCode,
  CurrencyCode,
  EntityGroupId,
  TenantId,
} from "../identity/index.js";
import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

export const LEGAL_ENTITY_COMPANY_TYPES = [
  "holding",
  "group_company",
  "branch_entity",
  "standalone",
] as const;

export type LegalEntityCompanyType =
  (typeof LEGAL_ENTITY_COMPANY_TYPES)[number];

export const RELATIONSHIP_TO_HOLDING_COMPANY_TYPES = [
  "subsidiary",
  "joint_venture",
  "associate",
  "minority_investment",
] as const;

export type RelationshipToHoldingCompanyType =
  (typeof RELATIONSHIP_TO_HOLDING_COMPANY_TYPES)[number];

/**
 * Statutory legal entity / company context.
 *
 * Kernel owns this as cross-module operating context:
 * tenant, entity group, legal company identity, country, currency,
 * lifecycle status, and holding-company relationship routing.
 *
 * IFRS alignment is intentionally limited to routing vocabulary:
 * - subsidiary routes to IFRS 10 control / consolidation assessment.
 * - joint_venture routes to IFRS 11 joint-control assessment.
 * - associate routes to IAS 28 significant-influence assessment.
 * - minority_investment routes to investment classification review.
 *
 * Kernel does not own accounting-standard versions, accounting treatment,
 * consolidation method derivation, ownership %, eliminations, markup policy,
 * tax treatment, journal entries, or financial reporting calculations.
 */
export interface LegalEntityContext {
  readonly baseCurrency: CurrencyCode;
  readonly companyId: CompanyId;

  /**
   * Top-level setup classification.
   *
   * - holding: root / holding company in a group structure.
   * - group_company: company configured under a holding company.
   * - branch_entity: statutory branch entity.
   * - standalone: company outside a holding-company structure.
   */
  readonly companyType: LegalEntityCompanyType;

  readonly countryCode: CountryCode;
  readonly displayName: string;

  /**
   * ISO calendar date: YYYY-MM-DD, or null when unknown/not applicable.
   */
  readonly effectiveFrom: string | null;

  /**
   * ISO calendar date: YYYY-MM-DD, or null for open-ended.
   */
  readonly effectiveTo: string | null;
  readonly entityGroupId: EntityGroupId | null;

  /**
   * Opaque pointer only.
   *
   * FiscalCalendarId / FiscalPeriodId are intentionally not Kernel
   * platform-floor ID families. Fiscal calendar rules belong to Finance /
   * Accounting authority.
   */
  readonly fiscalCalendarId: string | null;

  readonly legalName: string;

  /**
   * Primary statutory registration number for setup/evidence/display only.
   * Detailed statutory registration profiles belong to Compliance / Tax.
   */
  readonly registrationNumber: string | null;

  /**
   * Required only when companyType = "group_company".
   *
   * This is Kernel-owned routing vocabulary only. Downstream Accounting,
   * Accounting Standards, Consolidation, Intercompany, Tax, and Reporting
   * packages own their own treatment logic.
   */
  readonly relationshipToHoldingCompany: RelationshipToHoldingCompanyType | null;
  readonly reportingCurrency: CurrencyCode | null;
  readonly slug: string;

  readonly status: PlatformLifecycleStatus;

  /**
   * Primary tax registration number for setup/evidence/display only.
   * Detailed tax profiles belong to Tax / Compliance.
   */
  readonly taxRegistrationNumber: string | null;
  readonly tenantId: TenantId;
}

/**
 * JSON/wire format for LegalEntityContext.
 *
 * IDs and primitive branded values are plain strings for serialization.
 * Consumers must parse this through parseLegalEntityContext before using it
 * as internal Kernel context.
 */
export interface LegalEntityWireContext {
  readonly baseCurrency: string;
  readonly companyId: string;

  readonly companyType: LegalEntityCompanyType;

  readonly countryCode: string;
  readonly displayName: string;

  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly entityGroupId: string | null;

  readonly fiscalCalendarId: string | null;

  readonly legalName: string;
  readonly registrationNumber: string | null;
  readonly relationshipToHoldingCompany: RelationshipToHoldingCompanyType | null;
  readonly reportingCurrency: string | null;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly taxRegistrationNumber: string | null;
  readonly tenantId: string;
}
