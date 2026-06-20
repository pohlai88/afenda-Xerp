import type {
  PolicyCondition,
  PolicyEffect,
  PolicyScope,
} from "@afenda/database";
import { policyConditionMatches } from "@afenda/database";

/** Final authorization outcome after policy evaluation. */
export type PolicyDecision =
  | "allow"
  | "deny"
  | "require_approval"
  | "require_evidence"
  | "require_step_up"
  | "readonly";

export const POLICY_GATE_DECISIONS = [
  "require_approval",
  "require_evidence",
  "require_step_up",
  "readonly",
] as const;

export type PolicyGateDecision = (typeof POLICY_GATE_DECISIONS)[number];

export type PolicyStatus = "active" | "archived" | "inactive";

/** Normalized policy contract — no raw database rows. */
export interface PolicyContract {
  readonly condition: PolicyCondition;
  readonly description: string | null;
  readonly effect: PolicyEffect;
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly priority: number;
  readonly scope: PolicyScope;
  readonly status: PolicyStatus;
  readonly tenantId: string | null;
}

/** Policy rule ready for in-memory or database-backed evaluation. */
export type RegisteredPolicyRule = PolicyContract;

export interface PolicyEvaluationInput {
  readonly action: string;
  readonly permissionKey: string;
  readonly targetId?: string | null;
  readonly targetType?: string | null;
  readonly tenantId: string;
}

export interface PolicyEvaluationResult {
  readonly appliedPolicyIds: readonly string[];
  readonly decision: PolicyDecision;
  readonly reason: string;
}

export function isPolicyActive(
  policy: Pick<PolicyContract, "status">
): boolean {
  return policy.status === "active";
}

export function resolvePolicyWhenMatched(
  policy: Pick<PolicyContract, "condition" | "effect">
): PolicyDecision {
  if (policy.effect === "deny") {
    return "deny";
  }

  return policy.condition.gateDecision ?? "allow";
}

export function isExecutablePolicyDecision(
  decision: PolicyDecision
): decision is "allow" {
  return decision === "allow";
}

export function isPolicyGateDecision(
  decision: PolicyDecision
): decision is PolicyGateDecision {
  switch (decision) {
    case "require_approval":
    case "require_evidence":
    case "require_step_up":
    case "readonly":
      return true;
    default:
      return false;
  }
}

export function policyRuleMatches(
  rule: Pick<PolicyContract, "condition" | "scope" | "status" | "tenantId">,
  input: PolicyEvaluationInput
): boolean {
  if (!isPolicyActive(rule)) {
    return false;
  }

  if (rule.scope !== "platform" && rule.tenantId !== input.tenantId) {
    return false;
  }

  return policyConditionMatches(rule.condition, {
    permissionKey: input.permissionKey,
    action: input.action,
    ...(input.targetType !== undefined ? { targetType: input.targetType } : {}),
  });
}

export function sortPoliciesByPriority(
  rules: readonly PolicyContract[]
): PolicyContract[] {
  return [...rules].sort((left, right) => left.priority - right.priority);
}
