import { ACCOUNTING_STANDARDS_AUTHORITY_FINGERPRINT } from "../authority-fingerprint.js";
import { createAccountingStandardEvidenceSnapshot } from "../evidence/accounting-standard-evidence-snapshot.contract.js";
import { getAccountingStandardExplanation } from "../explanations/accounting-standard-explanation.registry.js";
import {
  buildPrecedenceConflictValidationResult,
  detectAuthorityPrecedenceConflicts,
} from "../policy/conflict-precedence.policy.js";
import {
  resolveAuthorityEditionForTransactionDate,
  resolveAuthorityEditionsForStandardCodes,
} from "../policy/transaction-date-edition-resolution.policy.js";
import type { JurisdictionCode } from "../routing/jurisdiction-profile.contract.js";
import {
  isJurisdictionCode,
  normalizeCountryCodeToJurisdiction,
  resolveJurisdictionProcessRoute,
  resolveJurisdictionReportingProfile,
} from "../routing/jurisdiction-profile.registry.js";
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

function resolveInputJurisdictionCode(
  input: AccountingStandardPostingValidationInput
): JurisdictionCode | null {
  if (
    input.jurisdictionCode !== undefined &&
    isJurisdictionCode(input.jurisdictionCode)
  ) {
    return input.jurisdictionCode;
  }
  const countryCode = input.transactionFacts["countryCode"];
  if (typeof countryCode === "string") {
    return normalizeCountryCodeToJurisdiction(countryCode);
  }
  return null;
}

function resolveScopeGateStatus(
  input: AccountingStandardPostingValidationInput,
  routedStandardKeys: readonly string[],
  jurisdictionCode: JurisdictionCode | null
): ScopeGateStatus {
  if (input.accountingStandardFamily !== "IFRS") {
    if (
      jurisdictionCode !== null &&
      resolveJurisdictionReportingProfile(jurisdictionCode)
        .mandatoryReportingFamily !== input.accountingStandardFamily
    ) {
      return "requires_review";
    }
    return "out_of_scope";
  }
  if (routedStandardKeys.includes("LOCAL_POLICY_REVIEW")) {
    return "requires_review";
  }
  if (routedStandardKeys.length === 0) {
    return "out_of_scope";
  }
  if (
    jurisdictionCode !== null &&
    resolveJurisdictionReportingProfile(jurisdictionCode)
      .mandatoryReportingFamily !== "IFRS"
  ) {
    return "requires_review";
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

function resolveEditionAwareAuthorityRef(
  rule: AccountingStandardPostingRule,
  transactionDate: string | null
) {
  if (transactionDate === null) {
    return rule.authorityRefs[0];
  }
  const resolved = resolveAuthorityEditionForTransactionDate(
    rule.standardCode,
    transactionDate,
    rule.standardVersionKey
  );
  if (resolved === null) {
    return rule.authorityRefs[0];
  }
  return (
    rule.authorityRefs.find(
      (authorityRef) => authorityRef.edition === resolved.edition
    ) ?? rule.authorityRefs[0]
  );
}

function buildResult(
  rule: AccountingStandardPostingRule,
  scopeGateStatus: ScopeGateStatus,
  triggered: boolean,
  transactionDate: string | null
): AccountingStandardValidationResult {
  const explanation = getAccountingStandardExplanation(rule.explanationKey);
  const status = triggered ? severityToStatus(rule.severity, true) : "pass";
  const authorityRef = resolveEditionAwareAuthorityRef(rule, transactionDate);
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
  input: AccountingStandardPostingValidationInput,
  jurisdictionCode: JurisdictionCode | null
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
  const jurisdictionRoute =
    jurisdictionCode === null
      ? []
      : resolveJurisdictionProcessRoute(
          jurisdictionCode,
          input.reportingPurpose,
          input.eventType
        );

  return [
    ...new Set<string>([
      ...profileRoute,
      ...crossRoute,
      ...jurisdictionRoute,
      ...baseRoute,
    ]),
  ];
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

function appendPrecedenceConflictResults(
  results: AccountingStandardValidationResult[],
  scopeGateStatus: ScopeGateStatus
): {
  results: AccountingStandardValidationResult[];
  conflictDetected: boolean;
} {
  let conflictDetected = false;
  const augmented = [...results];

  for (const result of results) {
    if (result.authorityRefs.length < 2) {
      continue;
    }
    const conflicts = detectAuthorityPrecedenceConflicts(result.authorityRefs);
    for (const conflict of conflicts) {
      conflictDetected = true;
      augmented.push(
        buildPrecedenceConflictValidationResult(conflict, scopeGateStatus)
      );
    }
  }

  return { results: augmented, conflictDetected };
}

function resolveStandardCodesFromRoutes(
  routedStandardKeys: readonly string[]
): readonly string[] {
  return routedStandardKeys.map((key) => key.replace(/_/g, " "));
}

export function evaluateAccountingStandardPostingValidation(
  input: AccountingStandardPostingValidationInput
): AccountingStandardValidationReport {
  const jurisdictionCode = resolveInputJurisdictionCode(input);
  const transactionDate = input.transactionDate ?? null;
  const routedStandardKeys = resolveRoutedStandardKeys(input, jurisdictionCode);
  const scopeGateStatus = resolveScopeGateStatus(
    input,
    routedStandardKeys,
    jurisdictionCode
  );

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
      jurisdictionCode,
      transactionDate,
      resolvedAuthorityEditions:
        transactionDate === null
          ? []
          : resolveAuthorityEditionsForStandardCodes(
              resolveStandardCodesFromRoutes(routedStandardKeys),
              transactionDate
            ),
      precedenceConflictDetected: false,
      results,
    };
  }

  const applicableRules = ACCOUNTING_STANDARD_POSTING_RULES.filter(
    (rule) =>
      rule.appliesToEvent === input.eventType &&
      (ruleAppliesToRoute(rule, routedStandardKeys) ||
        routedStandardKeys.includes("LOCAL_POLICY_REVIEW"))
  );

  const baseResults =
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
            evaluatePostingValidationCondition(rule.conditionKey, input),
            transactionDate
          )
        );

  const { results, conflictDetected } = appendPrecedenceConflictResults(
    [...baseResults],
    scopeGateStatus
  );

  const resolvedAuthorityEditions =
    transactionDate === null
      ? []
      : resolveAuthorityEditionsForStandardCodes(
          [...new Set(applicableRules.map((rule) => rule.standardCode))],
          transactionDate
        );

  return {
    fingerprint: ACCOUNTING_STANDARDS_AUTHORITY_FINGERPRINT,
    scopeGateStatus,
    routedStandardKeys,
    aggregateStatus: aggregateValidationStatus(results),
    judgmentEscalationRequired: results.some(
      (result) => result.judgmentEscalationRequired === true
    ),
    jurisdictionCode,
    transactionDate,
    resolvedAuthorityEditions,
    precedenceConflictDetected: conflictDetected,
    results,
  };
}

export function validatePostingAgainstAccountingStandards(
  input: AccountingStandardPostingValidationInput
): AccountingStandardValidationReport {
  return evaluateAccountingStandardPostingValidation(input);
}
