import type { JsonObject, JsonValue } from "../contracts/json-wire.contract.js";
import type { DomainEvent, WireDomainEvent } from "./domain-event.contract.js";
import { isDomainEvent } from "./domain-event.contract.js";

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _WireDomainEventSerializable = AssertJsonSerializable<
  WireDomainEvent<{ readonly probe: string }>
>;

/** Compile-time guard — domain event wire envelope must remain JSON-serializable. */
export type assertDomainEventWireSerializable =
  _WireDomainEventSerializable extends true ? true : never;

const REQUIRED_WIRE_DOMAIN_EVENT_KEYS = [
  "causationId",
  "correlationId",
  "eventId",
  "eventName",
  "occurredAt",
  "payload",
  "schemaVersion",
  "tenantId",
] as const;

const OPTIONAL_WIRE_DOMAIN_EVENT_KEYS = ["tenantPk"] as const;

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function assertAllowedWireKeys(record: Record<string, unknown>): void {
  const allowed = [
    ...REQUIRED_WIRE_DOMAIN_EVENT_KEYS,
    ...OPTIONAL_WIRE_DOMAIN_EVENT_KEYS,
  ];
  const keys = Object.keys(record);

  for (const key of REQUIRED_WIRE_DOMAIN_EVENT_KEYS) {
    if (!(key in record)) {
      throw new Error(`${key} is required.`);
    }
  }

  for (const key of keys) {
    if (!(allowed as readonly string[]).includes(key)) {
      throw new Error(
        `WireDomainEvent has unexpected key "${key}"; allowed: ${allowed.join(", ")}.`
      );
    }
  }
}

function assertJsonValue(value: unknown): asserts value is JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      assertJsonValue(item);
    }
    return;
  }

  if (typeof value === "object") {
    for (const key of Object.keys(value)) {
      assertJsonValue((value as Record<string, unknown>)[key]);
    }
    return;
  }

  throw new Error("payload must be JSON-serializable.");
}

function assertJsonObjectPayload(value: unknown): asserts value is JsonObject {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("payload must be a JSON object.");
  }

  assertJsonValue(value);
}

function assertRequiredWireString(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function assertWireDomainEventShape(value: WireDomainEvent): void {
  assertRequiredWireString(value.eventId, "eventId");
  assertRequiredWireString(value.eventName, "eventName");

  if (!Number.isFinite(value.schemaVersion)) {
    throw new Error("schemaVersion must be a finite number.");
  }

  if (!isNullableString(value.tenantId)) {
    throw new Error("tenantId must be a string or null.");
  }

  if (value.tenantId !== null && !value.tenantId.trim()) {
    throw new Error("tenantId must be null or a non-empty string.");
  }

  assertRequiredWireString(value.correlationId, "correlationId");

  if (!isNullableString(value.causationId)) {
    throw new Error("causationId must be a string or null.");
  }

  if (value.causationId !== null && !value.causationId.trim()) {
    throw new Error("causationId must be null or a non-empty string.");
  }

  assertRequiredWireString(value.occurredAt, "occurredAt");
  assertJsonObjectPayload(value.payload);

  if (
    value.tenantPk !== undefined &&
    (typeof value.tenantPk !== "string" || !value.tenantPk.trim())
  ) {
    throw new Error("tenantPk must be a non-empty string when present.");
  }
}

/** Semantic guard for typed domain events before persistence or dispatch handoff. */
export function assertDomainEvent<TPayload extends JsonObject = JsonObject>(
  value: DomainEvent<TPayload>
): DomainEvent<TPayload> {
  if (!isDomainEvent(value)) {
    throw new Error("DomainEvent failed semantic validation.");
  }

  return value;
}

/**
 * JSON ingress guard — narrow unknown wire payloads, then run semantic asserts.
 * Fail closed before identity parse* branding.
 */
export function assertWireDomainEvent(
  value: unknown
): asserts value is WireDomainEvent {
  if (value === null || typeof value !== "object") {
    throw new Error("WireDomainEvent must be an object.");
  }

  const record = value as Record<string, unknown>;
  assertAllowedWireKeys(record);
  assertWireDomainEventShape(value as WireDomainEvent);
}
