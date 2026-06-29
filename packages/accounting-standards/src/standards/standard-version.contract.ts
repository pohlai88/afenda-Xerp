import type {
  AccountingStandardAuthorityStatus,
  AccountingStandardFamily,
  AuthorityBindingStrength,
  AuthorityInstrument,
  AuthoritySourceType,
} from "./accounting-standard.contract.js";

export interface AccountingStandardVersionRef {
  readonly authorityInstrument?: AuthorityInstrument;
  readonly authoritySourceType?: AuthoritySourceType;
  readonly authorityStatus: AccountingStandardAuthorityStatus;
  readonly bindingStrength?: AuthorityBindingStrength;
  readonly edition: string;
  readonly effectiveForAnnualPeriodsBeginningOnOrAfter: string;
  readonly effectiveUntil?: string | null;
  readonly issuedAsOf: string;
  readonly retrievedAt: string;
  readonly sourceName: string;
  readonly sourceUrl: string;
  readonly standardCode: string;
  readonly standardFamily: AccountingStandardFamily;
  readonly standardTitle: string;
  readonly supersededByVersionKey?: string | null;
}
