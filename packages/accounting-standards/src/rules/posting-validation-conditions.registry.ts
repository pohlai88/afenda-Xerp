import type { AccountingStandardPostingValidationInput } from "./posting-validation-input.contract.js";

export const POSTING_VALIDATION_CONDITION_KEYS = [
  "lease_term_gt_12_months_and_not_low_value",
  "lease_short_term_exemption_applies",
  "lease_low_value_exemption_applies",
  "minority_investment_classification",
  "financial_instrument_fv_oci_review",
  "subsidiary_control_assessment",
  "subsidiary_control_percentage_missing",
  "joint_arrangement_classification",
  "joint_operation_vs_joint_venture_review",
  "disclosure_interests_required",
  "associate_equity_method",
  "associate_significant_influence_missing",
  "presentation_disclosure_review",
  "presentation_category_mapping_missing",
] as const;

export type PostingValidationConditionKey =
  (typeof POSTING_VALIDATION_CONDITION_KEYS)[number];

function readNumericFact(
  facts: Readonly<Record<string, unknown>>,
  key: string
): number | undefined {
  const value = facts[key];
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function readBooleanFact(
  facts: Readonly<Record<string, unknown>>,
  key: string
): boolean | undefined {
  const value = facts[key];
  return typeof value === "boolean" ? value : undefined;
}

function readStringFact(
  facts: Readonly<Record<string, unknown>>,
  key: string
): string | undefined {
  const value = facts[key];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function isSimpleRentExpensePosting(
  postingDraft: AccountingStandardPostingValidationInput["postingDraft"]
): boolean {
  if (postingDraft === null) {
    return false;
  }

  const accountKeys = [
    ...postingDraft.debitAccountKeys,
    ...postingDraft.creditAccountKeys,
  ].map((accountKey) => accountKey.toLowerCase());

  const hasLeaseAccounts = accountKeys.some(
    (accountKey) =>
      accountKey.includes("right_of_use") ||
      accountKey.includes("rou_asset") ||
      accountKey.includes("lease_liability")
  );

  const hasRentExpense = accountKeys.some(
    (accountKey) =>
      accountKey.includes("rent_expense") ||
      accountKey.includes("operating_lease_expense")
  );

  return hasRentExpense && !hasLeaseAccounts;
}

export type PostingValidationConditionEvaluator = (
  input: AccountingStandardPostingValidationInput
) => boolean;

export const POSTING_VALIDATION_CONDITION_EVALUATORS: Readonly<
  Record<PostingValidationConditionKey, PostingValidationConditionEvaluator>
> = {
  lease_term_gt_12_months_and_not_low_value: (input) => {
    const facts = input.transactionFacts as Readonly<Record<string, unknown>>;
    const leaseTermMonths = readNumericFact(facts, "leaseTermMonths");
    const isLowValue = readBooleanFact(facts, "isLowValue") ?? false;
    if (leaseTermMonths === undefined || leaseTermMonths <= 12 || isLowValue) {
      return false;
    }
    return isSimpleRentExpensePosting(input.postingDraft);
  },
  lease_short_term_exemption_applies: (input) => {
    const facts = input.transactionFacts as Readonly<Record<string, unknown>>;
    const leaseTermMonths = readNumericFact(facts, "leaseTermMonths");
    return leaseTermMonths !== undefined && leaseTermMonths <= 12;
  },
  lease_low_value_exemption_applies: (input) => {
    const facts = input.transactionFacts as Readonly<Record<string, unknown>>;
    return readBooleanFact(facts, "isLowValue") === true;
  },
  minority_investment_classification: (input) =>
    input.eventType === "holding_relationship_minority_investment",
  financial_instrument_fv_oci_review: (input) => {
    const facts = input.transactionFacts as Readonly<Record<string, unknown>>;
    const instrumentType = readStringFact(facts, "instrumentType");
    return (
      input.eventType === "holding_relationship_minority_investment" &&
      (instrumentType === "equity_instrument" ||
        instrumentType === "debt_instrument")
    );
  },
  subsidiary_control_assessment: (input) =>
    input.eventType === "holding_relationship_subsidiary",
  subsidiary_control_percentage_missing: (input) => {
    const facts = input.transactionFacts as Readonly<Record<string, unknown>>;
    return (
      input.eventType === "holding_relationship_subsidiary" &&
      readNumericFact(facts, "controlPercentage") === undefined
    );
  },
  joint_arrangement_classification: (input) =>
    input.eventType === "holding_relationship_joint_venture",
  joint_operation_vs_joint_venture_review: (input) => {
    const facts = input.transactionFacts as Readonly<Record<string, unknown>>;
    return (
      input.eventType === "holding_relationship_joint_venture" &&
      readStringFact(facts, "jointArrangementType") === undefined
    );
  },
  disclosure_interests_required: (input) =>
    input.eventType === "holding_relationship_subsidiary",
  associate_equity_method: (input) =>
    input.eventType === "holding_relationship_associate",
  associate_significant_influence_missing: (input) => {
    const facts = input.transactionFacts as Readonly<Record<string, unknown>>;
    return (
      input.eventType === "holding_relationship_associate" &&
      readNumericFact(facts, "votingInterestPercentage") === undefined
    );
  },
  presentation_disclosure_review: (input) =>
    input.eventType === "financial_statement_presentation",
  presentation_category_mapping_missing: (input) => {
    const facts = input.transactionFacts as Readonly<Record<string, unknown>>;
    return (
      input.eventType === "financial_statement_presentation" &&
      readStringFact(facts, "presentationCategory") === undefined
    );
  },
};

export function evaluatePostingValidationCondition(
  conditionKey: string,
  input: AccountingStandardPostingValidationInput
): boolean {
  if (!(conditionKey in POSTING_VALIDATION_CONDITION_EVALUATORS)) {
    return false;
  }
  return POSTING_VALIDATION_CONDITION_EVALUATORS[
    conditionKey as PostingValidationConditionKey
  ](input);
}
