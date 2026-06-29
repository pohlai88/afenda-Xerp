import type { AccountingStandardPostingRule } from "../../rules/posting-validation-rule.contract.js";
import { getAccountingStandardVersionRef } from "../standard-version.registry.js";

const IAS_28_VERSION = getAccountingStandardVersionRef("IAS_28_REQUIRED_2026");

export const IAS_28_ASSOCIATES_JV_RULES: readonly AccountingStandardPostingRule[] =
  IAS_28_VERSION
    ? [
        {
          ruleId: "IAS28-ASSOCIATE-EQUITY-METHOD-001",
          standardCode: "IAS 28",
          standardVersionKey: "IAS_28_REQUIRED_2026",
          appliesToEvent: "holding_relationship_associate",
          severity: "info",
          conditionKey: "associate_equity_method",
          expectedProcessRoute: "route_to_equity_method_workflow",
          explanationKey: "ias28-associate-equity-method-info",
          authorityRefs: [IAS_28_VERSION],
        },
        {
          ruleId: "IAS28-VOTING-INTEREST-MISSING-001",
          standardCode: "IAS 28",
          standardVersionKey: "IAS_28_REQUIRED_2026",
          appliesToEvent: "holding_relationship_associate",
          severity: "warning",
          conditionKey: "associate_significant_influence_missing",
          expectedProcessRoute:
            "document_significant_influence_before_equity_method",
          explanationKey: "ias28-voting-interest-missing-warning",
          authorityRefs: [IAS_28_VERSION],
        },
      ]
    : [];
