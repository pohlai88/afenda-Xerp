export const ACCOUNTING_STANDARD_FAMILIES = [
  "IFRS",
  "MFRS",
  "SFRS",
  "US_GAAP",
  "LOCAL_POLICY",
] as const;

export type AccountingStandardFamily =
  (typeof ACCOUNTING_STANDARD_FAMILIES)[number];

export const ACCOUNTING_STANDARD_LIFECYCLE_STATUSES = [
  "current",
  "future_effective",
  "superseded",
  "amended",
  "pending_review",
] as const;

export type AccountingStandardLifecycleStatus =
  (typeof ACCOUNTING_STANDARD_LIFECYCLE_STATUSES)[number];

export const ACCOUNTING_STANDARD_AUTHORITY_STATUSES =
  ACCOUNTING_STANDARD_LIFECYCLE_STATUSES;

export type AccountingStandardAuthorityStatus =
  AccountingStandardLifecycleStatus;

export const REPORTING_PURPOSES = [
  "statutory",
  "group_consolidation",
  "tax",
  "management",
  "regulatory_disclosure",
] as const;

export type ReportingPurpose = (typeof REPORTING_PURPOSES)[number];

export const AUTHORITY_INSTRUMENTS = [
  "standard",
  "interpretation",
  "amendment",
  "implementation_guidance",
  "exposure_draft",
] as const;

export type AuthorityInstrument = (typeof AUTHORITY_INSTRUMENTS)[number];

export const AUTHORITY_BINDING_STRENGTHS = [
  "mandatory",
  "optional",
  "illustrative",
  "superseded",
] as const;

export type AuthorityBindingStrength =
  (typeof AUTHORITY_BINDING_STRENGTHS)[number];

export const AUTHORITY_SOURCE_TYPES = [
  "external_standard",
  "national_standard",
  "regulatory_rule",
  "company_policy",
  "project_policy",
] as const;

export type AuthoritySourceType = (typeof AUTHORITY_SOURCE_TYPES)[number];

export interface AccountingStandardRegistryEntry {
  readonly defaultAuthorityVersionKey: string;
  readonly family: AccountingStandardFamily;
  readonly lifecycleStatus: AccountingStandardLifecycleStatus;
  readonly scopeSummary: string;
  readonly standardCode: string;
  readonly standardKey: string;
  readonly standardTitle: string;
}
