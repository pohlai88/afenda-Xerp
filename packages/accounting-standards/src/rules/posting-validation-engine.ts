import { ACCOUNTING_STANDARDS_AUTHORITY_FINGERPRINT } from "../authority-fingerprint.js";
import { createAccountingStandardEvidenceSnapshot } from "../evidence/accounting-standard-evidence-snapshot.contract.js";
import { getAccountingStandardExplanation } from "../explanations/accounting-standard-explanation.registry.js";
import {
  resolveCrossRepresentationRoute,
  resolveReportingContextProcessRoute,
  resolveStandardProcessRoute,
} from "../routing/standard-process-routing.registry.js";
import { IFRS_16_LEASE_WARNING_MESSAGE } from "../standards/ifrs/ifrs-16-leases.registry.js";
import { evaluatePostingValidationCondition } from "./posting-validation-conditions.registry.js";
import type { AccountingStandardPostingValidationInput } from "./posting-validation-input.contract.js";
import type { AccountingStandardValidationReport } from "./posting-validation-report.contract.js";
import type {
  AccountingStandardValidationResult,
  ScopeGateStatus,
  ValidationResultStatus,
} from "./posting-validation-result.contract.js";
import type { AccountingStandardPostingRule } from "./posting-validation-rule.contract.js";
import {
  ACCOUNTING_STANDARD_POSTING_RULES,
  resolveStandardKeyFromRule,
} from "./posting-validation-rule.registry.js";

const STATUS_PRECEDENCE: readonly ValidationResultStatus[] = [
  "blocked",
  "warning",
  "info",
  "pass",
];

function aggregateValidationStatus(
  results: readonly AccountingStandardValidationResult[]
): ValidationResultStatus {
  for (const status of STATUS_PRECEDENCE) {
    if (results.some((result) => result.status === status)) {
      return status;
    }
  }
  return "pass";
}

function resolveScopeGateStatus(
  input: AccountingStandardPostingValidationInput,
  routedStandardKeys: readonly string[]
): ScopeGateStatus {
  if (input.accountingStandardFamily !== "IFRS") {
    return "out_of_scope";
  }
  if (routedStandardKeys.includes("LOCAL_POLICY_REVIEW")) {
    return "requires_review";
  }
  if (routedStandardKeys.length === 0) {
    return "out_of_scope";
  }
  return "in_scope";
}

function severityToStatus(
  severity: AccountingStandardPostingRule["severity"],
  triggered: boolean
): ValidationResultStatus {
  if (!triggered) {
    return "pass";
  }
  switch (severity) {
    case "blocking":
      return "blocked";
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "info";
  }
}

function buildResult(
  rule: AccountingStandardPostingRule,
  scopeGateStatus: ScopeGateStatus,
  triggered: boolean
): AccountingStandardValidationResult {
  const explanation = getAccountingStandardExplanation(rule.explanationKey);
  const status = triggered ? severityToStatus(rule.severity, true) : "pass";
  const authorityRef = rule.authorityRefs[0];
  const message =
    rule.ruleId === "IFRS16-LEASE-LESSEE-ROU-LIABILITY-001" && triggered
      ? IFRS_16_LEASE_WARNING_MESSAGE
      : (explanation?.plainLanguageSummary ??
        "Accounting standards validation completed.");

  const judgmentEscalationRequired =
    scopeGateStatus === "requires_review" ||
    (triggered &&
      (rule.severity === "warning" || rule.severity === "blocking") &&
      rule.conditionKey.includes("missing"));

  return {
    status,
    ruleId: triggered ? rule.ruleId : null,
    standardCode: triggered ? rule.standardCode : null,
    message,
    recommendedAction: explanation?.recommendedAction ?? null,
    authorityRefs: triggered ? rule.authorityRefs : [],
    evidenceSnapshot:
      triggered && authorityRef
        ? createAccountingStandardEvidenceSnapshot({
            ruleId: rule.ruleId,
            authorityRef,
            explanationKey: rule.explanationKey,
          })
        : null,
    scopeGateStatus,
    judgmentEscalationRequired,
    escalationReasonKey: (() => {
      if (!judgmentEscalationRequired) {
        return null;
      }
      if (scopeGateStatus === "requires_review") {
        return "local-policy-judgment-escalation";
      }
      return rule.explanationKey;
    })(),
  };
}

function resolveRoutedStandardKeys(
  input: AccountingStandardPostingValidationInput
): readonly string[] {
  const baseRoute = resolveStandardProcessRoute(input.eventType);
  const profileRoute =
    input.reportingPurpose === undefined
      ? baseRoute
      : resolveReportingContextProcessRoute(
          input.reportingPurpose,
          input.eventType
        );
  const crossRoute =
    input.crossRepresentationTransition === undefined
      ? []
      : resolveCrossRepresentationRoute(
          input.crossRepresentationTransition,
          input.eventType
        );

  return [...new Set<string>([...profileRoute, ...crossRoute, ...baseRoute])];
}

function ruleAppliesToRoute(
  rule: AccountingStandardPostingRule,
  routedStandardKeys: readonly string[]
): boolean {
  const standardKey = resolveStandardKeyFromRule(rule);
  return routedStandardKeys.some(
    (key) =>
      key === standardKey ||
      key === rule.standardCode.replace(/\s+/g, "_").toUpperCase()
  );
}

function buildScopePassResult(
  scopeGateStatus: ScopeGateStatus,
  message: string
): AccountingStandardValidationResult {
  return {
    status: "pass",
    ruleId: null,
    standardCode: null,
    message,
    recommendedAction: null,
    authorityRefs: [],
    evidenceSnapshot: null,
    scopeGateStatus,
    judgmentEscalationRequired: scopeGateStatus === "requires_review",
    escalationReasonKey:
      scopeGateStatus === "requires_review"
        ? "local-policy-judgment-escalation"
        : null,
  };
}

export function evaluateAccountingStandardPostingValidation(
  input: AccountingStandardPostingValidationInput
): AccountingStandardValidationReport {
  const routedStandardKeys = resolveRoutedStandardKeys(input);
  const scopeGateStatus = resolveScopeGateStatus(input, routedStandardKeys);

  if (scopeGateStatus === "out_of_scope") {
    const results = [
      buildScopePassResult(
        scopeGateStatus,
        "No in-scope IFRS routing for this event and reporting context."
      ),
    ];
    return {
      fingerprint: ACCOUNTING_STANDARDS_AUTHORITY_FINGERPRINT,
      scopeGateStatus,
      routedStandardKeys,
      aggregateStatus: "pass",
      judgmentEscalationRequired: false,
      results,
    };
  }

  const applicableRules = ACCOUNTING_STANDARD_POSTING_RULES.filter(
    (rule) =>
      rule.appliesToEvent === input.eventType &&
      (ruleAppliesToRoute(rule, routedStandardKeys) ||
        routedStandardKeys.includes("LOCAL_POLICY_REVIEW"))
  );

  const results =
    applicableRules.length === 0
      ? [
          buildScopePassResult(
            scopeGateStatus,
            "No applicable posting validation rules for this event."
          ),
        ]
      : applicableRules.map((rule) =>
          buildResult(
            rule,
            scopeGateStatus,
            evaluatePostingValidationCondition(rule.conditionKey, input)
          )
        );

  return {
    fingerprint: ACCOUNTING_STANDARDS_AUTHORITY_FINGERPRINT,
    scopeGateStatus,
    routedStandardKeys,
    aggregateStatus: aggregateValidationStatus(results),
    judgmentEscalationRequired: results.some(
      (result) => result.judgmentEscalationRequired === true
    ),
    results,
  };
}

export function validatePostingAgainstAccountingStandards(
  input: AccountingStandardPostingValidationInput
): AccountingStandardValidationReport {
  return evaluateAccountingStandardPostingValidation(input);
}
