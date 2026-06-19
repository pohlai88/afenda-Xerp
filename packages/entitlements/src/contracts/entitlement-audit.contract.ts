import type { EntitlementDecisionResult } from "./entitlement-decision.contract";
import type { JsonValue } from "./shared.contract";

export interface EntitlementAuditEvidence {
  readonly actual: JsonValue;
  readonly expected: JsonValue;
  readonly key: string;
}

export interface EntitlementAuditContract {
  readonly companyId: string;
  readonly correlationId: string;
  readonly evaluatedAt: string;
  readonly evidence: readonly EntitlementAuditEvidence[];
  readonly feature: string;
  readonly organizationId: string;
  readonly reason: string;
  readonly result: EntitlementDecisionResult;
  readonly tenantId: string;
}
