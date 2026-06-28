import { serializeExecutionContext } from "../contracts/execution-context.policy.contract.js";
import {
  normalizeCorrelationIdForWire,
  normalizeTenantIdForWire,
} from "../identity/index.js";
import { assertWireKernelContextFrame } from "./kernel-context-frame.assert.js";
import type {
  KernelContextFrame,
  KernelContextFrameWire,
} from "./kernel-context-frame.contract.js";

function normalizeOptionalTenantIdForWire(
  value: KernelContextFrame["tenantId"]
): string | null {
  return value === null ? null : normalizeTenantIdForWire(value);
}

export function normalizeKernelContextFrameForWire(
  value: KernelContextFrame
): KernelContextFrameWire {
  return {
    correlationId: normalizeCorrelationIdForWire(value.correlationId),
    executionContext: serializeExecutionContext(value.executionContext),
    tenantId: normalizeOptionalTenantIdForWire(value.tenantId),
  };
}

/** Wire egress alias — same contract as `normalizeKernelContextFrameForWire`. */
export function serializeKernelContextFrame(
  value: KernelContextFrame
): KernelContextFrameWire {
  const wire = normalizeKernelContextFrameForWire(value);
  assertWireKernelContextFrame(wire);
  return wire;
}
