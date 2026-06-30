import type { AccountingStandardFamily } from "../standards/accounting-standard.contract.js";

export const JURISDICTION_CODES = ["MY", "SG", "EU", "US", "GLOBAL"] as const;

export type JurisdictionCode = (typeof JURISDICTION_CODES)[number];

export interface JurisdictionReportingProfile {
  readonly jurisdictionCode: JurisdictionCode;
  readonly mandatoryReportingFamily: AccountingStandardFamily;
  readonly statutoryRouteTag: string;
}
