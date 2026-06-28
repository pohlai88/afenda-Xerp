/**
 * Bridges `@afenda/execution` outbox records/envelopes to `@afenda/kernel` DomainEvent.
 *
 * Kernel owns envelope vocabulary; execution owns dispatch. This module maps persistence
 * shapes to kernel wire ingress (`parseUnknownDomainEvent`) without redefining contracts.
 */

import {
  type DomainEvent,
  isCanonicalEnterpriseId,
  type JsonObject,
  parseUnknownDomainEvent,
  type WireDomainEvent,
} from "@afenda/kernel";
import type {
  ExecutionJsonObject,
  ExecutionPayload,
} from "./execution-metadata.contract.js";
import type {
  OutboxEventEnvelope,
  OutboxEventRecord,
} from "./outbox-event.contract.js";

/** Maps outbox semver strings (e.g. `"1.0"`) to kernel `schemaVersion` major integer. */
export function parseOutboxEventSchemaVersion(eventVersion: string): number {
  const majorToken = eventVersion.trim().split(".")[0] ?? "";
  const major = Number.parseInt(majorToken, 10);

  if (!Number.isFinite(major) || major < 1) {
    throw new Error(
      `eventVersion must parse to a positive schema version: "${eventVersion}".`
    );
  }

  return major;
}

function readMetadataTenantPk(
  metadata: ExecutionJsonObject
): string | undefined {
  const value = metadata["tenantPk"];

  if (value === undefined) {
    return;
  }

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(
      "metadata.tenantPk must be a non-empty string when present."
    );
  }

  return value;
}

function resolveOutboxTenantWireFields(record: {
  readonly metadata: ExecutionJsonObject;
  readonly tenantId: string | null;
}): Pick<WireDomainEvent, "tenantId" | "tenantPk"> {
  const metadataTenantPk = readMetadataTenantPk(record.metadata);

  if (record.tenantId === null) {
    return metadataTenantPk === undefined
      ? { tenantId: null }
      : { tenantId: null, tenantPk: metadataTenantPk };
  }

  if (isCanonicalEnterpriseId(record.tenantId)) {
    return metadataTenantPk === undefined
      ? { tenantId: record.tenantId }
      : { tenantId: record.tenantId, tenantPk: metadataTenantPk };
  }

  if (metadataTenantPk !== undefined && metadataTenantPk !== record.tenantId) {
    throw new Error(
      "Outbox tenantId internal PK conflicts with metadata.tenantPk — supply one internal tenant PK source."
    );
  }

  return { tenantId: null, tenantPk: record.tenantId };
}

function toJsonObjectPayload(payload: ExecutionPayload): JsonObject {
  return payload;
}

/** Build kernel wire shape from a persisted outbox row — no branding until parse*. */
export function outboxRecordToWireDomainEvent(
  record: OutboxEventRecord
): WireDomainEvent {
  const tenantFields = resolveOutboxTenantWireFields(record);

  return {
    causationId: record.causationId,
    correlationId: record.correlationId,
    eventId: record.eventId,
    eventName: record.eventType,
    occurredAt: record.availableAt,
    payload: toJsonObjectPayload(record.payload),
    schemaVersion: parseOutboxEventSchemaVersion(record.eventVersion),
    ...tenantFields,
  };
}

/** Branded kernel domain event from an outbox persistence row. */
export function toDomainEventFromOutboxRecord(
  record: OutboxEventRecord
): DomainEvent {
  return parseUnknownDomainEvent(outboxRecordToWireDomainEvent(record));
}

/** Branded kernel domain event from a dispatch envelope. */
export function toDomainEventFromOutboxEnvelope(
  envelope: OutboxEventEnvelope
): DomainEvent {
  const tenantFields = resolveOutboxTenantWireFields({
    metadata: envelope.metadata,
    tenantId:
      envelope.executionContext.tenantId === null
        ? null
        : String(envelope.executionContext.tenantId),
  });

  return parseUnknownDomainEvent({
    causationId: envelope.causationId,
    correlationId: envelope.correlationId,
    eventId: envelope.eventId,
    eventName: envelope.eventType,
    occurredAt: envelope.executionContext.startedAt,
    payload: toJsonObjectPayload(envelope.payload),
    schemaVersion: parseOutboxEventSchemaVersion(envelope.eventVersion),
    ...tenantFields,
  });
}
