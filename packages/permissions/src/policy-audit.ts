import { type AuditResult, insertAuditEvent } from "@afenda/database";

import type { AuthorizationDecision } from "./authorization-error.js";
import type {
  PolicyDecision,
  PolicyEvaluationResult,
} from "./policy.contract.js";

export interface PolicyEvaluationAuditInput {
  readonly permissionDecision: AuthorizationDecision;
  readonly policyResult: PolicyEvaluationResult;
}

export type PolicyEvaluationAuditWriter = (
  input: PolicyEvaluationAuditInput
) => Promise<void>;

function toPolicyAuditResult(decision: PolicyDecision): AuditResult {
  return decision === "deny" ? "denied" : "success";
}

/** Persists policy evaluation evidence via `@afenda/database`. */
export const databasePolicyAuditWriter: PolicyEvaluationAuditWriter = async ({
  permissionDecision,
  policyResult,
}) => {
  await insertAuditEvent({
    tenantId: permissionDecision.tenantId,
    companyId: permissionDecision.companyId,
    organizationId: permissionDecision.organizationId,
    actorType: "user",
    actorUserId: permissionDecision.actorId,
    module: "authorization",
    action: "policy.evaluate",
    targetType: "authorization",
    targetId: permissionDecision.correlationId,
    result: toPolicyAuditResult(policyResult.decision),
    reason: policyResult.reason,
    permission: permissionDecision.permissionKey,
    policyId: policyResult.appliedPolicyIds[0] ?? null,
    source: "app",
    correlationId: permissionDecision.correlationId,
    metadata: {
      decision: policyResult.decision,
      appliedPolicyIds: policyResult.appliedPolicyIds.join(","),
      action: permissionDecision.action,
      targetType: permissionDecision.targetType,
      targetId: permissionDecision.targetId,
    },
  });
};

/** Skips audit persistence — use in tests and dry-run flows. */
export const noopPolicyAuditWriter: PolicyEvaluationAuditWriter = async () =>
  undefined;
