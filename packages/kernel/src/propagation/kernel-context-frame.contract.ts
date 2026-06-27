import type { ExecutionContext } from "../contracts/execution-context.contract.js";
import type { CorrelationId, TenantId } from "../identity/index.js";

/** Serializable async propagation frame — no persistence, request, permission, or domain runtime objects. */
export interface KernelContextFrame {
  readonly correlationId: CorrelationId;
  readonly executionContext: ExecutionContext;
  readonly tenantId: TenantId | null;
}
