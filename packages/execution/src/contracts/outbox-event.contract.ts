import type { ExecutionOutboxEnvelope } from "./execution.contract.js";
import {
  createExecutionContext,
  type ExecutionContext,
} from "./execution-context.contract.js";
import {
  type ExecutionJsonObject,
  type ExecutionPayload,
  isExecutionPayload,
} from "./execution-metadata.contract.js";

export const OUTBOX_EVENT_VERSION = "1.0" as const;

/** Mirrors `@afenda/database` `outbox_status` — duplicated here to avoid a package edge. */
export const OUTBOX_STATUSES = [
  "pending",
  "processing",
  "published",
  "failed",
  "dead_letter",
] as const;

export type OutboxStatus = (typeof OUTBOX_STATUSES)[number];

export interface OutboxEventRecord {
  readonly actorId: string | null;
  readonly actorType: string | null;
  readonly attempts: number;
  readonly availableAt: string;
  readonly causationId: string | null;
  readonly companyId: string | null;
  readonly correlationId: string;
  readonly eventId: string;
  readonly eventType: string;
  readonly eventVersion: string;
  readonly executionRunId: string | null;
  readonly id: string;
  readonly lockedAt: string | null;
  readonly lockedBy: string | null;
  readonly maxAttempts: number;
  readonly metadata: ExecutionJsonObject;
  readonly organizationId: string | null;
  readonly payload: ExecutionPayload;
  readonly reason: string | null;
  readonly status: OutboxStatus;
  readonly summary: string | null;
  readonly tenantId: string | null;
}

export interface OutboxEventEnvelope extends ExecutionOutboxEnvelope {
  readonly causationId: string | null;
  readonly eventId: string;
  readonly eventVersion: string;
  readonly metadata: ExecutionJsonObject;
}

export interface ClaimOutboxEventsInput {
  readonly limit: number;
  readonly lockedBy: string;
  readonly nowIso: string;
  readonly tenantId?: string | null;
}

export interface MarkOutboxPublishedInput {
  readonly id: string;
  readonly publishedAt: string;
}

export interface MarkOutboxFailedInput {
  readonly attempts: number;
  readonly availableAt: string;
  readonly failedAt: string;
  readonly id: string;
  readonly lastError: string;
}

export interface MarkOutboxDeadLetterInput {
  readonly failedAt: string;
  readonly id: string;
  readonly lastError: string;
}

export interface ReleaseOutboxClaimInput {
  readonly availableAt: string;
  readonly id: string;
}

export interface OutboxPersistencePort {
  claimPending(
    input: ClaimOutboxEventsInput
  ): Promise<readonly OutboxEventRecord[]>;
  markDeadLetter(input: MarkOutboxDeadLetterInput): Promise<void>;
  markFailed(input: MarkOutboxFailedInput): Promise<void>;
  markPublished(input: MarkOutboxPublishedInput): Promise<void>;
  releaseClaim(input: ReleaseOutboxClaimInput): Promise<void>;
}

export interface OutboxDispatchResult {
  readonly error?: string;
  readonly ok: boolean;
}

export interface OutboxEventDispatcher {
  dispatch(envelope: OutboxEventEnvelope): Promise<OutboxDispatchResult>;
}

export function isOutboxStatus(value: unknown): value is OutboxStatus {
  return (
    typeof value === "string" &&
    (OUTBOX_STATUSES as readonly string[]).includes(value)
  );
}

export function toOutboxEventEnvelope(
  record: OutboxEventRecord
): OutboxEventEnvelope {
  const executionContext: ExecutionContext = createExecutionContext({
    actorId: record.actorId,
    companyId: record.companyId,
    correlationId: record.correlationId,
    ...(record.executionRunId === null
      ? {}
      : { executionId: record.executionRunId }),
    organizationId: record.organizationId,
    source: "outbox",
    tenantId: record.tenantId,
  });

  return {
    causationId: record.causationId,
    correlationId: record.correlationId,
    eventId: record.eventId,
    eventType: record.eventType,
    eventVersion: record.eventVersion,
    executionContext,
    metadata: record.metadata,
    payload: record.payload,
  };
}

export function assertOutboxRecordTenantScope(
  record: OutboxEventRecord,
  tenantId: string | null | undefined
): void {
  if (tenantId === undefined || tenantId === null) {
    return;
  }

  if (record.tenantId !== tenantId) {
    throw new Error(
      `Outbox event "${record.eventId}" is not scoped to tenant "${tenantId}".`
    );
  }
}

export function validateOutboxPayload(
  record: OutboxEventRecord
): ExecutionPayload | null {
  if (!isExecutionPayload(record.payload)) {
    return null;
  }

  return record.payload;
}
