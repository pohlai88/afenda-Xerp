import type { AccountingStandardPostingRule } from "../../rules/posting-validation-rule.contract.js";
import { getAccountingStandardVersionRef } from "../standard-version.registry.js";

const IFRS_11_VERSION = getAccountingStandardVersionRef(
  "IFRS_11_REQUIRED_2026"
);

export const IFRS_11_JOINT_ARRANGEMENTS_RULES: readonly AccountingStandardPostingRule[] =
  IFRS_11_VERSION
    ? [
        {
          ruleId: "IFRS11-JV-CLASSIFICATION-001",
          standardCode: "IFRS 11",
          standardVersionKey: "IFRS_11_REQUIRED_2026",
          appliesToEvent: "holding_relationship_joint_venture",
          severity: "info",
          conditionKey: "joint_arrangement_classification",
          expectedProcessRoute: "route_to_joint_arrangement_workflow",
          explanationKey: "ifrs11-jv-classification-info",
          authorityRefs: [IFRS_11_VERSION],
        },
        {
          ruleId: "IFRS11-JOINT-TYPE-MISSING-001",
          standardCode: "IFRS 11",
          standardVersionKey: "IFRS_11_REQUIRED_2026",
          appliesToEvent: "holding_relationship_joint_venture",
          severity: "warning",
          conditionKey: "joint_operation_vs_joint_venture_review",
          expectedProcessRoute: "classify_joint_operation_or_joint_venture",
          explanationKey: "ifrs11-joint-type-missing-warning",
          authorityRefs: [IFRS_11_VERSION],
        },
      ]
    : [];
