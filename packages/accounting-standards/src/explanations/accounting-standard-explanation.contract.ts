import type { AccountingStandardVersionRef } from "../standards/standard-version.contract.js";

export interface AccountingStandardExplanation {
  readonly authorityRefs: readonly AccountingStandardVersionRef[];
  readonly boundaryStatement: string;
  readonly explanationKey: string;
  readonly plainLanguageSummary: string;
  readonly recommendedAction: string;
  readonly title: string;
  readonly whyItMatters: readonly string[];
}
