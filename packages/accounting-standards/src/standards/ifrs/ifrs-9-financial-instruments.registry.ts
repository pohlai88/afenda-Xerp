import type { AccountingStandardPostingRule } from "../../rules/posting-validation-rule.contract.js";
import { getAccountingStandardVersionRef } from "../standard-version.registry.js";

const IFRS_9_VERSION = getAccountingStandardVersionRef("IFRS_9_REQUIRED_2026");

export const IFRS_9_FINANCIAL_INSTRUMENTS_RULES: readonly AccountingStandardPostingRule[] =
  IFRS_9_VERSION
    ? [
        {
          ruleId: "IFRS9-MINORITY-INVESTMENT-REVIEW-001",
          standardCode: "IFRS 9",
          standardVersionKey: "IFRS_9_REQUIRED_2026",
          appliesToEvent: "holding_relationship_minority_investment",
          severity: "info",
          conditionKey: "minority_investment_classification",
          expectedProcessRoute: "review_financial_instrument_classification",
          explanationKey: "ifrs9-minority-investment-info",
          authorityRefs: [IFRS_9_VERSION],
        },
        {
          ruleId: "IFRS9-FV-OCI-CLASSIFICATION-001",
          standardCode: "IFRS 9",
          standardVersionKey: "IFRS_9_REQUIRED_2026",
          appliesToEvent: "holding_relationship_minority_investment",
          severity: "warning",
          conditionKey: "financial_instrument_fv_oci_review",
          expectedProcessRoute: "review_fv_oci_classification_before_posting",
          explanationKey: "ifrs9-fv-oci-classification-warning",
          authorityRefs: [IFRS_9_VERSION],
        },
      ]
    : [];
