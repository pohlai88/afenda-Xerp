import type { JsonObject } from "../contracts/json-wire.contract.js";
import {
  normalizeCorrelationIdForWire,
  parseCorrelationId,
} from "../identity/families/audit-execution-id.contract.js";
import {
  normalizeTenantIdForWire,
  parseTenantId,
} from "../identity/families/tenant-hierarchy-id.contract.js";
import {
  parseInternalEntityPk,
  toInternalEntityPk,
} from "../identity/wire/internal-entity-pk.contract.js";
import {
  assertDomainEvent,
  assertWireDomainEvent,
} from "./domain-event.assert.js";
import type { DomainEvent, WireDomainEvent } from "./domain-event.contract.js";

function parseOptionalTenantId(value: string | null): DomainEvent["tenantId"] {
  return value === null ? null : parseTenantId(value);
}

function parseValidatedDomainEvent<TPayload extends JsonObject = JsonObject>(
  value: WireDomainEvent<TPayload>
): DomainEvent<TPayload> {
  const event: DomainEvent<TPayload> = {
    causationId: value.causationId,
    correlationId: parseCorrelationId(value.correlationId),
    eventId: value.eventId,
    eventName: value.eventName,
    occurredAt: value.occurredAt,
    payload: value.payload,
    schemaVersion: value.schemaVersion,
    tenantId: parseOptionalTenantId(value.tenantId),
  };

  if (value.tenantPk !== undefined) {
    return {
      ...event,
      tenantPk: parseInternalEntityPk(value.tenantPk, "TenantPk"),
    };
  }

  return event;
}

/** JSON/API ingress — assert unknown wire, then narrow to typed domain event. */
export function parseUnknownDomainEvent<
  TPayload extends JsonObject = JsonObject,
>(value: unknown): DomainEvent<TPayload> {
  assertWireDomainEvent(value);
  return parseValidatedDomainEvent(value as WireDomainEvent<TPayload>);
}

export function normalizeDomainEventForWire<
  TPayload extends JsonObject = JsonObject,
>(value: DomainEvent<TPayload>): WireDomainEvent<TPayload> {
  const validated = assertDomainEvent(value);

  const wire: WireDomainEvent<TPayload> = {
    causationId: validated.causationId,
    correlationId: normalizeCorrelationIdForWire(validated.correlationId),
    eventId: validated.eventId,
    eventName: validated.eventName,
    occurredAt: validated.occurredAt,
    payload: validated.payload,
    schemaVersion: validated.schemaVersion,
    tenantId:
      validated.tenantId === null
        ? null
        : normalizeTenantIdForWire(validated.tenantId),
  };

  if (validated.tenantPk !== undefined) {
    return {
      ...wire,
      tenantPk: toInternalEntityPk(validated.tenantPk),
    };
  }

  return wire;
}

/** Wire egress alias — same contract as `normalizeDomainEventForWire`. */
export function serializeDomainEvent<TPayload extends JsonObject = JsonObject>(
  value: DomainEvent<TPayload>
): WireDomainEvent<TPayload> {
  return normalizeDomainEventForWire(value);
}
