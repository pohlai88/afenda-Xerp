import type { CountryCode, CurrencyCode } from "../identity/index.js";
import type { PlatformLifecycleStatus } from "./lifecycle.contract.js";

export const LEGAL_ENTITY_COMPANY_TYPES = [
  "holding",
  "parent",
  "subsidiary",
  "associate",
  "joint_venture",
  "minority_interest",
  "branch_entity",
  "standalone",
] as const;

export type LegalEntityCompanyType =
  (typeof LEGAL_ENTITY_COMPANY_TYPES)[number];

/** Statutory legal entity / company — owns books and tax identity. */
export interface LegalEntityContext {
  readonly baseCurrency: CurrencyCode;
  readonly companyId: string;
  readonly companyType: LegalEntityCompanyType;
  readonly countryCode: CountryCode;
  readonly displayName: string;
  readonly effectiveFrom: string | null;
  readonly effectiveTo: string | null;
  readonly entityGroupId: string | null;
  readonly fiscalCalendarId: string | null;
  readonly legalName: string;
  readonly registrationNumber: string | null;
  readonly reportingCurrency: string | null;
  readonly slug: string;
  readonly status: PlatformLifecycleStatus;
  readonly taxRegistrationNumber: string | null;
  readonly tenantId: string;
}
