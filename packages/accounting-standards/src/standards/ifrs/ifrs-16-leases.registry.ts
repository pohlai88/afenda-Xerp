import type { AccountingStandardPostingRule } from "../../rules/posting-validation-rule.contract.js";
import { getAccountingStandardVersionRef } from "../standard-version.registry.js";

const IFRS_16_VERSION = getAccountingStandardVersionRef(
  "IFRS_16_REQUIRED_2026"
);

export const IFRS_16_LEASE_POSTING_RULES: readonly AccountingStandardPostingRule[] =
  IFRS_16_VERSION
    ? [
        {
          ruleId: "IFRS16-LEASE-LESSEE-ROU-LIABILITY-001",
          standardCode: "IFRS 16",
          standardVersionKey: "IFRS_16_REQUIRED_2026",
          appliesToEvent: "lease_contract_recognition",
          severity: "warning",
          conditionKey: "lease_term_gt_12_months_and_not_low_value",
          expectedProcessRoute:
            "route_to_lease_accounting_workflow_before_simple_rent_expense_posting",
          explanationKey: "ifrs16-lessee-rou-liability-warning",
          authorityRefs: [IFRS_16_VERSION],
        },
        {
          ruleId: "IFRS16-LEASE-SHORT-TERM-EXEMPTION-001",
          standardCode: "IFRS 16",
          standardVersionKey: "IFRS_16_REQUIRED_2026",
          appliesToEvent: "lease_contract_recognition",
          severity: "info",
          conditionKey: "lease_short_term_exemption_applies",
          expectedProcessRoute: "confirm_short_term_lease_exemption",
          explanationKey: "ifrs16-short-term-exemption-info",
          authorityRefs: [IFRS_16_VERSION],
        },
        {
          ruleId: "IFRS16-LEASE-LOW-VALUE-EXEMPTION-001",
          standardCode: "IFRS 16",
          standardVersionKey: "IFRS_16_REQUIRED_2026",
          appliesToEvent: "lease_contract_recognition",
          severity: "info",
          conditionKey: "lease_low_value_exemption_applies",
          expectedProcessRoute: "confirm_low_value_lease_exemption",
          explanationKey: "ifrs16-low-value-exemption-info",
          authorityRefs: [IFRS_16_VERSION],
        },
      ]
    : [];

export const IFRS_16_LEASE_WARNING_MESSAGE =
  "This posting may not follow IFRS 16. A qualifying lessee lease normally requires right-of-use asset and lease liability recognition, not simple rent expense only. Route this transaction through the lease accounting workflow." as const;
