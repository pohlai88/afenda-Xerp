/**
 * PAS-001 §4.3 — execution context policy registry.
 *
 * Single source for required field vocabulary, source allow-list parity with PAS,
 * and boundary-safe structural guards. Runtime minting stays in
 * `execution-context.contract.ts`.
 */

import {
  EXECUTION_CONTEXT_SOURCES,
  type ExecutionContext,
  type ExecutionContextSource,
} from "./execution-context.contract.js";

/** PAS §4.3 required concepts — additive trace/span fields are optional on the interface. */
export const EXECUTION_CONTEXT_REQUIRED_FIELDS = [
  "executionId",
  "correlationId",
  "source",
  "startedAt",
  "actorId",
  "tenantId",
  "companyId",
  "organizationId",
] as const;

export type ExecutionContextRequiredField =
  (typeof EXECUTION_CONTEXT_REQUIRED_FIELDS)[number];

export const EXECUTION_CONTEXT_POLICY = {
  pasSection: "4.3",
  requiredFields: EXECUTION_CONTEXT_REQUIRED_FIELDS,
  approvedSources: EXECUTION_CONTEXT_SOURCES,
  additiveFields: ["traceId", "spanId"] as const,
  rules: [
    "correlationId follows a request, event, job, action, or execution chain",
    "executionId identifies one execution attempt",
    "traceId and spanId are plain strings",
    "kernel must not import OpenTelemetry",
    "observability may enrich trace/span behavior outside kernel",
  ] as const,
} as const;

const EXECUTION_CONTEXT_SOURCE_SET = new Set<string>(EXECUTION_CONTEXT_SOURCES);

export function isExecutionContextSource(
  value: unknown
): value is ExecutionContextSource {
  return typeof value === "string" && EXECUTION_CONTEXT_SOURCE_SET.has(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

/** Structural guard for wire-safe, serializable execution context payloads. */
export function isExecutionContext(value: unknown): value is ExecutionContext {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  for (const field of EXECUTION_CONTEXT_REQUIRED_FIELDS) {
    if (!(field in record)) {
      return false;
    }
  }

  if (
    typeof record["executionId"] !== "string" ||
    record["executionId"].trim() === ""
  ) {
    return false;
  }

  if (
    typeof record["correlationId"] !== "string" ||
    record["correlationId"].trim() === ""
  ) {
    return false;
  }

  if (!isExecutionContextSource(record["source"])) {
    return false;
  }

  if (
    typeof record["startedAt"] !== "string" ||
    record["startedAt"].trim() === ""
  ) {
    return false;
  }

  if (
    !(
      isNullableString(record["actorId"]) &&
      isNullableString(record["tenantId"]) &&
      isNullableString(record["companyId"]) &&
      isNullableString(record["organizationId"]) &&
      isNullableString(record["traceId"]) &&
      isNullableString(record["spanId"])
    )
  ) {
    return false;
  }

  return true;
}

export function assertExecutionContext(
  context: ExecutionContext
): ExecutionContext {
  if (!isExecutionContext(context)) {
    throw new Error(
      "ExecutionContext is missing required PAS §4.3 fields or contains invalid values."
    );
  }

  return context;
}
