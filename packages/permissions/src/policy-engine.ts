import { type AuditResult, insertAuditEvent } from "@afenda/database";
import { createAuthorizationCorrelationId } from "./authorization-context.js";
import {
  type AuthorizationDecision,
  AuthorizationDeniedError,
  buildAuthorizationDecision,
  PolicyGateError,
} from "./authorization-error.js";
import { resolveBoundaryPermissionKey } from "./permission.contract.js";
import {
  checkPermission,
  type PermissionCheckRequest,
  type PermissionDataSource,
} from "./permission-checker.js";
import {
  isExecutablePolicyDecision,
  isPolicyGateDecision,
  type PolicyContract,
  type PolicyDecision,
  type PolicyEvaluationInput,
  type PolicyEvaluationResult,
  policyRuleMatches,
  resolvePolicyWhenMatched,
  sortPoliciesByPriority,
} from "./policy.contract.js";

export interface PolicyDataSource {
  findApplicableRules(
    input: PolicyEvaluationInput
  ): Promise<readonly PolicyContract[]>;
}

/** In-memory policy engine stub — evaluates registered policy rules. */
export class InMemoryPolicyDataSource implements PolicyDataSource {
  private readonly rules: PolicyContract[] = [];

  seedPolicy(rule: PolicyContract): this {
    this.rules.push(rule);
    return this;
  }

  findApplicableRules(
    input: PolicyEvaluationInput
  ): Promise<readonly PolicyContract[]> {
    return Promise.resolve(
      this.rules.filter((rule) => policyRuleMatches(rule, input))
    );
  }
}

function toPolicyAuditResult(decision: PolicyDecision): AuditResult {
  return decision === "deny" ? "denied" : "success";
}

async function recordPolicyEvaluationAudit(
  permissionDecision: AuthorizationDecision,
  policyResult: PolicyEvaluationResult
): Promise<void> {
  if (process.env.VITEST === "true") {
    return;
  }

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
}

export function evaluatePolicyDecision(
  permissionGranted: boolean,
  rules: readonly PolicyContract[]
): PolicyEvaluationResult {
  if (!permissionGranted) {
    return {
      decision: "deny",
      reason: "Permission was not granted.",
      appliedPolicyIds: [],
    };
  }

  const sortedRules = sortPoliciesByPriority(rules);

  for (const rule of sortedRules) {
    const whenMatched = resolvePolicyWhenMatched(rule);

    if (whenMatched === "deny") {
      return {
        decision: "deny",
        reason: `Policy "${rule.key}" denied the action.`,
        appliedPolicyIds: [rule.id],
      };
    }

    if (isPolicyGateDecision(whenMatched)) {
      return {
        decision: whenMatched,
        reason: `Policy "${rule.key}" requires "${whenMatched}".`,
        appliedPolicyIds: [rule.id],
      };
    }
  }

  return {
    decision: "allow",
    reason: "Permission granted with no blocking policies.",
    appliedPolicyIds: [],
  };
}

export async function evaluateAuthorizationPolicy(
  permissionDecision: AuthorizationDecision,
  policyDataSource: PolicyDataSource
): Promise<AuthorizationDecision> {
  const evaluationInput: PolicyEvaluationInput = {
    tenantId: permissionDecision.tenantId,
    permissionKey: permissionDecision.permissionKey,
    action: permissionDecision.action,
    targetType: permissionDecision.targetType,
    targetId: permissionDecision.targetId,
  };

  const rules = await policyDataSource.findApplicableRules(evaluationInput);
  const permissionGranted = permissionDecision.result === "allow";
  const policyResult = evaluatePolicyDecision(permissionGranted, rules);

  await recordPolicyEvaluationAudit(permissionDecision, policyResult);

  return buildAuthorizationDecision({
    ...permissionDecision,
    result: policyResult.decision,
    reason: policyResult.reason,
    correlationId: permissionDecision.correlationId,
  });
}

export async function requirePolicyDecision(
  request: PermissionCheckRequest,
  permissionDataSource: PermissionDataSource,
  policyDataSource: PolicyDataSource
): Promise<AuthorizationDecision> {
  const boundaryRequest: PermissionCheckRequest = {
    ...request,
    permissionKey: resolveBoundaryPermissionKey(request.permissionKey),
  };
  const permissionResult = await checkPermission(
    boundaryRequest,
    permissionDataSource
  );

  if (!permissionResult.allowed) {
    throw new AuthorizationDeniedError(
      permissionResult.decision,
      permissionResult.code
    );
  }

  const finalDecision = await evaluateAuthorizationPolicy(
    permissionResult.decision,
    policyDataSource
  );

  if (finalDecision.result === "deny") {
    throw new AuthorizationDeniedError(finalDecision, "policy_denied");
  }

  if (isPolicyGateDecision(finalDecision.result)) {
    throw new PolicyGateError(finalDecision);
  }

  if (!isExecutablePolicyDecision(finalDecision.result)) {
    throw new PolicyGateError(finalDecision);
  }

  return finalDecision;
}

export async function checkPolicyDecision(
  request: PermissionCheckRequest,
  permissionDataSource: PermissionDataSource,
  policyDataSource: PolicyDataSource
): Promise<AuthorizationDecision> {
  const correlationId =
    request.correlationId ?? createAuthorizationCorrelationId();
  const permissionResult = await checkPermission(
    { ...request, correlationId },
    permissionDataSource
  );

  if (!permissionResult.allowed) {
    return permissionResult.decision;
  }

  return evaluateAuthorizationPolicy(
    permissionResult.decision,
    policyDataSource
  );
}
