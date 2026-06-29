import type { AccountingStandardVersionRef } from "../standards/standard-version.contract.js";

export interface AccountingStandardEvidenceSnapshot {
  readonly authorityStatus: string;
  readonly edition: string;
  readonly effectiveFrom: string;
  readonly explanationKey: string;
  readonly retrievedAt: string;
  readonly ruleId: string;
  readonly sourceUrl: string;
  readonly standardCode: string;
  readonly standardTitle: string;
}

export function createAccountingStandardEvidenceSnapshot(params: {
  readonly ruleId: string;
  readonly authorityRef: AccountingStandardVersionRef;
  readonly explanationKey: string;
}): AccountingStandardEvidenceSnapshot {
  return {
    ruleId: params.ruleId,
    standardCode: params.authorityRef.standardCode,
    standardTitle: params.authorityRef.standardTitle,
    edition: params.authorityRef.edition,
    effectiveFrom:
      params.authorityRef.effectiveForAnnualPeriodsBeginningOnOrAfter,
    retrievedAt: params.authorityRef.retrievedAt,
    sourceUrl: params.authorityRef.sourceUrl,
    authorityStatus: params.authorityRef.authorityStatus,
    explanationKey: params.explanationKey,
  };
}
