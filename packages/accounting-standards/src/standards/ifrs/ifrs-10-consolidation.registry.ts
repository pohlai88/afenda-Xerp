import type { AccountingStandardPostingRule } from "../../rules/posting-validation-rule.contract.js";
import { getAccountingStandardVersionRef } from "../standard-version.registry.js";

const IFRS_10_VERSION = getAccountingStandardVersionRef(
  "IFRS_10_REQUIRED_2026"
);

export const IFRS_10_CONSOLIDATION_RULES: readonly AccountingStandardPostingRule[] =
  IFRS_10_VERSION
    ? [
        {
          ruleId: "IFRS10-SUBSIDIARY-CONSOLIDATION-001",
          standardCode: "IFRS 10",
          standardVersionKey: "IFRS_10_REQUIRED_2026",
          appliesToEvent: "holding_relationship_subsidiary",
          severity: "info",
          conditionKey: "subsidiary_control_assessment",
          expectedProcessRoute: "route_to_consolidation_workflow",
          explanationKey: "ifrs10-subsidiary-consolidation-info",
          authorityRefs: [IFRS_10_VERSION],
        },
        {
          ruleId: "IFRS10-CONTROL-PERCENTAGE-MISSING-001",
          standardCode: "IFRS 10",
          standardVersionKey: "IFRS_10_REQUIRED_2026",
          appliesToEvent: "holding_relationship_subsidiary",
          severity: "warning",
          conditionKey: "subsidiary_control_percentage_missing",
          expectedProcessRoute:
            "complete_control_assessment_before_consolidation",
          explanationKey: "ifrs10-control-percentage-missing-warning",
          authorityRefs: [IFRS_10_VERSION],
        },
      ]
    : [];
