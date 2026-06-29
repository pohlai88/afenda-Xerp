/**
 * PAS-003 — metadata consumer proof for @afenda/accounting-standards.
 *
 * Metadata surfaces resolve validation status labels and cited explanations
 * from the standards authority package — they must not fork rule text locally.
 */
import {
  type AccountingStandardValidationResult,
  getAccountingStandardExplanation,
  type ValidationResultStatus,
} from "@afenda/accounting-standards";

export const ACCOUNTING_STANDARD_VALIDATION_STATUS_KEYS = [
  "pass",
  "info",
  "warning",
  "blocked",
] as const satisfies readonly ValidationResultStatus[];

export type AccountingStandardValidationStatusKey =
  (typeof ACCOUNTING_STANDARD_VALIDATION_STATUS_KEYS)[number];

const VALIDATION_STATUS_LABELS: Readonly<
  Record<AccountingStandardValidationStatusKey, string>
> = {
  pass: "Passed standards check",
  info: "Standards information",
  warning: "Standards warning",
  blocked: "Blocked by standards rule",
};

export function resolveAccountingStandardValidationStatusLabel(
  status: ValidationResultStatus
): string {
  if (status in VALIDATION_STATUS_LABELS) {
    return VALIDATION_STATUS_LABELS[
      status as AccountingStandardValidationStatusKey
    ];
  }
  return "Standards validation";
}

export function resolveAccountingStandardValidationExplanationTitle(
  result: Pick<AccountingStandardValidationResult, "evidenceSnapshot">
): string {
  const explanationKey = result.evidenceSnapshot?.explanationKey;
  if (explanationKey === undefined) {
    return "";
  }
  return getAccountingStandardExplanation(explanationKey)?.title ?? "";
}

export function resolveAccountingStandardValidationExplanationSummary(
  result: Pick<
    AccountingStandardValidationResult,
    "message" | "evidenceSnapshot"
  >
): string {
  const explanationKey = result.evidenceSnapshot?.explanationKey;
  if (explanationKey !== undefined) {
    const explanation = getAccountingStandardExplanation(explanationKey);
    if (explanation !== undefined) {
      return explanation.plainLanguageSummary;
    }
  }
  return result.message;
}

export function resolveAccountingStandardValidationRecommendedAction(
  result: Pick<
    AccountingStandardValidationResult,
    "recommendedAction" | "evidenceSnapshot"
  >
): string {
  if (result.recommendedAction !== null) {
    return result.recommendedAction;
  }
  const explanationKey = result.evidenceSnapshot?.explanationKey;
  if (explanationKey === undefined) {
    return "";
  }
  return (
    getAccountingStandardExplanation(explanationKey)?.recommendedAction ?? ""
  );
}
