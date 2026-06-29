import { IAS_28_ASSOCIATES_JV_RULES } from "../standards/ifrs/ias-28-associates-jv.registry.js";
import { IFRS_9_FINANCIAL_INSTRUMENTS_RULES } from "../standards/ifrs/ifrs-9-financial-instruments.registry.js";
import { IFRS_10_CONSOLIDATION_RULES } from "../standards/ifrs/ifrs-10-consolidation.registry.js";
import { IFRS_11_JOINT_ARRANGEMENTS_RULES } from "../standards/ifrs/ifrs-11-joint-arrangements.registry.js";
import { IFRS_12_DISCLOSURE_INTERESTS_RULES } from "../standards/ifrs/ifrs-12-disclosure-interests.registry.js";
import { IFRS_16_LEASE_POSTING_RULES } from "../standards/ifrs/ifrs-16-leases.registry.js";
import { IFRS_18_PRESENTATION_DISCLOSURE_RULES } from "../standards/ifrs/ifrs-18-presentation-disclosure.registry.js";
import type { AccountingStandardPostingRule } from "./posting-validation-rule.contract.js";

export const ACCOUNTING_STANDARD_POSTING_RULES: readonly AccountingStandardPostingRule[] =
  [
    ...IFRS_9_FINANCIAL_INSTRUMENTS_RULES,
    ...IFRS_10_CONSOLIDATION_RULES,
    ...IFRS_11_JOINT_ARRANGEMENTS_RULES,
    ...IFRS_12_DISCLOSURE_INTERESTS_RULES,
    ...IAS_28_ASSOCIATES_JV_RULES,
    ...IFRS_16_LEASE_POSTING_RULES,
    ...IFRS_18_PRESENTATION_DISCLOSURE_RULES,
  ] as const;

export function getPostingValidationRule(
  ruleId: string
): AccountingStandardPostingRule | undefined {
  return ACCOUNTING_STANDARD_POSTING_RULES.find(
    (rule) => rule.ruleId === ruleId
  );
}

export function getPostingValidationRulesForEvent(
  eventType: string
): readonly AccountingStandardPostingRule[] {
  return ACCOUNTING_STANDARD_POSTING_RULES.filter(
    (rule) => rule.appliesToEvent === eventType
  );
}

export function resolveStandardKeyFromRule(
  rule: AccountingStandardPostingRule
): string {
  return rule.standardVersionKey.replace(/_REQUIRED_\d+$/, "");
}
