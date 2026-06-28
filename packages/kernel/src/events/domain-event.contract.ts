import type { JsonObject } from "../contracts/json-wire.contract.js";
import type {
  CorrelationId,
  InternalEntityPk,
  TenantId,
} from "../identity/index.js";

/** Domain event envelope — dispatch/outbox/retry owned by @afenda/execution. */
export interface DomainEvent<TPayload extends JsonObject = JsonObject> {
  readonly causationId: string | null;
  readonly correlationId: CorrelationId;
  readonly eventId: string;
  readonly eventName: string;
  readonly occurredAt: string;
  readonly payload: TPayload;
  readonly schemaVersion: number;
  readonly tenantId: TenantId | null;
  readonly tenantPk?: InternalEntityPk;
}

/** JSON/wire format — plain string ids and JSON object payload. */
export interface WireDomainEvent<TPayload extends JsonObject = JsonObject> {
  readonly causationId: string | null;
  readonly correlationId: string;
  readonly eventId: string;
  readonly eventName: string;
  readonly occurredAt: string;
  readonly payload: TPayload;
  readonly schemaVersion: number;
  readonly tenantId: string | null;
  readonly tenantPk?: string;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

export function isDomainEvent(value: unknown): value is DomainEvent {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  if (
    typeof record["eventId"] !== "string" ||
    !record["eventId"].trim() ||
    typeof record["eventName"] !== "string" ||
    !record["eventName"].trim() ||
    typeof record["schemaVersion"] !== "number" ||
    !Number.isFinite(record["schemaVersion"]) ||
    typeof record["correlationId"] !== "string" ||
    !record["correlationId"].trim() ||
    !isNullableString(record["causationId"]) ||
    (record["causationId"] !== null && !record["causationId"].trim()) ||
    typeof record["occurredAt"] !== "string" ||
    !record["occurredAt"].trim() ||
    typeof record["payload"] !== "object" ||
    record["payload"] === null ||
    Array.isArray(record["payload"]) ||
    !isNullableString(record["tenantId"]) ||
    (record["tenantId"] !== null && !record["tenantId"].trim())
  ) {
    return false;
  }

  if (
    "tenantPk" in record &&
    record["tenantPk"] !== undefined &&
    (typeof record["tenantPk"] !== "string" || !record["tenantPk"].trim())
  ) {
    return false;
  }

  return true;
}
