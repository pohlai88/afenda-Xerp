import type { ExecutionContext } from "../contracts/execution-context.contract.js";
import type { ExecutionContextWire } from "../contracts/execution-context.policy.contract.js";
import type { CorrelationId, TenantId } from "../identity/index.js";

export type { ExecutionContextWire } from "../contracts/execution-context.policy.contract.js";

/** Serializable async propagation frame — no persistence, request, permission, or domain runtime objects. */
export interface KernelContextFrame {
  readonly correlationId: CorrelationId;
  readonly executionContext: ExecutionContext;
  readonly tenantId: TenantId | null;
}

/** JSON/wire format for kernel context frame — telemetry and logging egress only. */
export interface KernelContextFrameWire {
  readonly correlationId: string;
  readonly executionContext: ExecutionContextWire;
  readonly tenantId: string | null;
}
