import type {
  EntitlementAuditContract,
  EntitlementAuditEvidence,
} from "../contracts/entitlement-audit.contract";
import type { EntitlementContextContract } from "../contracts/entitlement-context.contract";
import type { EntitlementDecisionResult } from "../contracts/entitlement-decision.contract";

export interface CreateEntitlementAuditInput {
  readonly context: EntitlementContextContract;
  readonly correlationId: string;
  readonly evaluatedAt: string;
  readonly evidence: readonly EntitlementAuditEvidence[];
  readonly reason: string;
  readonly result: EntitlementDecisionResult;
}

export function createEntitlementAuditEvent(
  input: CreateEntitlementAuditInput
): EntitlementAuditContract {
  return {
    tenantId: input.context.tenantId,
    companyId: input.context.companyId,
    organizationId: input.context.organizationId,
    feature: input.context.feature,
    reason: input.reason,
    result: input.result,
    evaluatedAt: input.evaluatedAt,
    correlationId: input.correlationId,
    evidence: input.evidence,
  };
}
