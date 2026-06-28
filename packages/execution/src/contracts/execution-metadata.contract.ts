/**
 * JSON-serializable value types for execution payloads and outbox envelopes.
 *
 * Keeps public contracts boundary-safe for persistence, queues, and Foundation phase 23 outbox.
 */

export type ExecutionJsonPrimitive = string | number | boolean | null;

export interface ExecutionJsonObject {
  readonly [key: string]: ExecutionJsonValue;
}

export type ExecutionJsonValue =
  | ExecutionJsonPrimitive
  | readonly ExecutionJsonValue[]
  | ExecutionJsonObject;

/** Workflow input payload — must round-trip through JSON. */
export type ExecutionPayload = Readonly<Record<string, ExecutionJsonValue>>;

export function isExecutionJsonValue(
  value: unknown
): value is ExecutionJsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isExecutionJsonValue);
  }

  if (typeof value === "object") {
    return Object.values(value).every(isExecutionJsonValue);
  }

  return false;
}

export function isExecutionPayload(value: unknown): value is ExecutionPayload {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(isExecutionJsonValue);
}

export function isExecutionJsonObject(
  value: unknown
): value is ExecutionJsonObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(isExecutionJsonValue);
}
