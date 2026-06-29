import { ACCOUNTING_STANDARD_EXPLANATIONS } from "../explanations/accounting-standard-explanation.registry.js";
import { POSTING_VALIDATION_CONDITION_KEYS } from "../rules/posting-validation-conditions.registry.js";
import {
  ACCOUNTING_STANDARD_POSTING_RULES,
  resolveStandardKeyFromRule,
} from "../rules/posting-validation-rule.registry.js";
import { ACCOUNTING_STANDARD_VERSION_REGISTRY } from "../standards/standard-version.registry.js";

export function validateAccountingStandardRuleEvidence(): readonly string[] {
  const errors: string[] = [];
  const seenRuleIds = new Set<string>();

  for (const rule of ACCOUNTING_STANDARD_POSTING_RULES) {
    if (seenRuleIds.has(rule.ruleId)) {
      errors.push(`duplicate ruleId: ${rule.ruleId}`);
    }
    seenRuleIds.add(rule.ruleId);

    if (rule.authorityRefs.length === 0) {
      errors.push(`${rule.ruleId}: missing authorityRefs`);
    }

    if (!(rule.standardVersionKey in ACCOUNTING_STANDARD_VERSION_REGISTRY)) {
      errors.push(
        `${rule.ruleId}: unknown standardVersionKey ${rule.standardVersionKey}`
      );
    }

    if (!(rule.explanationKey in ACCOUNTING_STANDARD_EXPLANATIONS)) {
      errors.push(
        `${rule.ruleId}: missing explanation registry entry ${rule.explanationKey}`
      );
    }

    if (
      !(POSTING_VALIDATION_CONDITION_KEYS as readonly string[]).includes(
        rule.conditionKey
      )
    ) {
      errors.push(`${rule.ruleId}: unknown conditionKey ${rule.conditionKey}`);
    }

    const resolvedKey = resolveStandardKeyFromRule(rule);
    if (!rule.standardVersionKey.startsWith(resolvedKey)) {
      errors.push(
        `${rule.ruleId}: standardVersionKey ${rule.standardVersionKey} does not match resolved key ${resolvedKey}`
      );
    }
  }

  return errors;
}
