import type { AccountingStandardPostingRule } from "../../rules/posting-validation-rule.contract.js";
import { getAccountingStandardVersionRef } from "../standard-version.registry.js";

const IFRS_18_VERSION = getAccountingStandardVersionRef(
  "IFRS_18_REQUIRED_2026"
);
const IFRS_18_GROUP_PRESENTATION_POLICY = getAccountingStandardVersionRef(
  "IFRS_18_GROUP_PRESENTATION_POLICY"
);

export const IFRS_18_PRESENTATION_DISCLOSURE_RULES: readonly AccountingStandardPostingRule[] =
  IFRS_18_VERSION
    ? [
        {
          ruleId: "IFRS18-PRESENTATION-DISCLOSURE-001",
          standardCode: "IFRS 18",
          standardVersionKey: "IFRS_18_REQUIRED_2026",
          appliesToEvent: "financial_statement_presentation",
          severity: "info",
          conditionKey: "presentation_disclosure_review",
          expectedProcessRoute: "route_to_presentation_disclosure_workflow",
          explanationKey: "ifrs18-presentation-disclosure-info",
          authorityRefs: [IFRS_18_VERSION],
        },
        {
          ruleId: "IFRS18-PRESENTATION-CATEGORY-MISSING-001",
          standardCode: "IFRS 18",
          standardVersionKey: "IFRS_18_REQUIRED_2026",
          appliesToEvent: "financial_statement_presentation",
          severity: "warning",
          conditionKey: "presentation_category_mapping_missing",
          expectedProcessRoute: "map_presentation_category_before_disclosure",
          explanationKey: "ifrs18-presentation-category-missing-warning",
          authorityRefs:
            IFRS_18_GROUP_PRESENTATION_POLICY === undefined
              ? [IFRS_18_VERSION]
              : [IFRS_18_VERSION, IFRS_18_GROUP_PRESENTATION_POLICY],
        },
      ]
    : [];
