import {
  assertExecutionContext,
  isExecutionContext,
} from "../contracts/execution-context.policy.contract.js";
import type { AssertJsonSerializable } from "../contracts/json-wire.contract.js";
import type {
  ExecutionContextWire,
  KernelContextFrame,
  KernelContextFrameWire,
} from "./kernel-context-frame.contract.js";

type _KernelContextFrameWireSerializable =
  AssertJsonSerializable<KernelContextFrameWire>;

/** Compile-time guard — kernel context frame wire must remain JSON-serializable. */
export type assertKernelContextFrameWireSerializable =
  _KernelContextFrameWireSerializable extends true ? true : never;

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function assertExecutionContextWire(value: ExecutionContextWire): void {
  if (!isExecutionContext(value)) {
    throw new Error(
      "ExecutionContextWire is missing required PAS §4.3 fields or contains invalid values."
    );
  }
}

function assertKernelContextFrameWire(value: KernelContextFrameWire): void {
  if (!value.correlationId.trim()) {
    throw new Error("correlationId is required.");
  }

  if (!isNullableString(value.tenantId)) {
    throw new Error("tenantId must be a string or null.");
  }

  assertExecutionContextWire(value.executionContext);
}

/** Semantic guard for branded kernel context frames before ALS storage or fork merge. */
export function assertKernelContextFrame(
  frame: KernelContextFrame
): KernelContextFrame {
  if (!frame.correlationId.trim()) {
    throw new Error("correlationId is required.");
  }

  assertExecutionContext(frame.executionContext);

  if (frame.tenantId !== null && !frame.tenantId.trim()) {
    throw new Error("tenantId must be null or a non-empty branded id.");
  }

  return frame;
}

/**
 * JSON ingress guard — narrow unknown wire payloads, then run semantic asserts.
 * Fail closed before identity parse* branding.
 */
export function assertWireKernelContextFrame(
  value: unknown
): asserts value is KernelContextFrameWire {
  if (value === null || typeof value !== "object") {
    throw new Error("KernelContextFrameWire must be an object.");
  }

  const record = value as Record<string, unknown>;

  if (typeof record["correlationId"] !== "string") {
    throw new Error("correlationId must be a string.");
  }

  if (!("tenantId" in record)) {
    throw new Error("tenantId is required.");
  }

  if (!isNullableString(record["tenantId"])) {
    throw new Error("tenantId must be a string or null.");
  }

  const executionContext = record["executionContext"];
  if (executionContext === null || typeof executionContext !== "object") {
    throw new Error("executionContext must be an object.");
  }

  const executionRecord = executionContext as Record<string, unknown>;

  if (typeof executionRecord["executionId"] !== "string") {
    throw new Error("executionContext.executionId must be a string.");
  }
  if (typeof executionRecord["correlationId"] !== "string") {
    throw new Error("executionContext.correlationId must be a string.");
  }
  if (typeof executionRecord["source"] !== "string") {
    throw new Error("executionContext.source must be a string.");
  }
  if (typeof executionRecord["startedAt"] !== "string") {
    throw new Error("executionContext.startedAt must be a string.");
  }

  for (const field of [
    "actorId",
    "tenantId",
    "companyId",
    "organizationId",
    "traceId",
    "spanId",
  ] as const) {
    if (!(field in executionRecord)) {
      throw new Error(`executionContext.${field} is required.`);
    }
    if (!isNullableString(executionRecord[field])) {
      throw new Error(`executionContext.${field} must be a string or null.`);
    }
  }

  assertKernelContextFrameWire(value as KernelContextFrameWire);
}
