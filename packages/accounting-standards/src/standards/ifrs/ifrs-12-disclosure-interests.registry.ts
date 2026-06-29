import type { AccountingStandardPostingRule } from "../../rules/posting-validation-rule.contract.js";
import { getAccountingStandardVersionRef } from "../standard-version.registry.js";

const IFRS_12_VERSION = getAccountingStandardVersionRef(
  "IFRS_12_REQUIRED_2026"
);

export const IFRS_12_DISCLOSURE_INTERESTS_RULES: readonly AccountingStandardPostingRule[] =
  IFRS_12_VERSION
    ? [
        {
          ruleId: "IFRS12-DISCLOSURE-INTERESTS-001",
          standardCode: "IFRS 12",
          standardVersionKey: "IFRS_12_REQUIRED_2026",
          appliesToEvent: "holding_relationship_subsidiary",
          severity: "info",
          conditionKey: "disclosure_interests_required",
          expectedProcessRoute: "route_to_disclosure_workflow",
          explanationKey: "ifrs12-disclosure-interests-info",
          authorityRefs: [IFRS_12_VERSION],
        },
      ]
    : [];
