import type { AccountingStandardVersionRef } from "../standards/standard-version.contract.js";

export const POSTING_VALIDATION_SEVERITIES = [
  "info",
  "warning",
  "blocking",
] as const;

export type PostingValidationSeverity =
  (typeof POSTING_VALIDATION_SEVERITIES)[number];

export interface AccountingStandardPostingRule {
  readonly appliesToEvent: string;
  readonly authorityRefs: readonly AccountingStandardVersionRef[];
  readonly conditionKey: string;
  readonly expectedProcessRoute: string;
  readonly explanationKey: string;
  readonly ruleId: string;
  readonly severity: PostingValidationSeverity;
  readonly standardCode: string;
  readonly standardVersionKey: string;
}
