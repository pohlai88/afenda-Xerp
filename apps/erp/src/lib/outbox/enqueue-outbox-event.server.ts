import { randomUUID } from "node:crypto";
import { type AfendaDatabase, getDb, outboxEvents } from "@afenda/database";
import type { ExecutionJsonObject, ExecutionPayload } from "@afenda/execution";
import { isExecutionJsonObject, isExecutionPayload } from "@afenda/execution";
import { isCanonicalEnterpriseId } from "@afenda/kernel";

import { ApiRouteError } from "@/server/api/runtime/api-validation";

export interface EnqueueOutboxEventInput {
  readonly actorId: string;
  readonly actorType?:
    | "cron"
    | "import"
    | "integration"
    | "service"
    | "system"
    | "user";
  readonly causationId?: string | null;
  readonly companyId: string;
  readonly correlationId: string;
  readonly eventId?: string;
  readonly eventType: string;
  readonly eventVersion?: string;
  readonly executionRunId?: string | null;
  readonly metadata?: ExecutionJsonObject;
  readonly organizationId?: string | null;
  readonly payload: ExecutionPayload;
  readonly reason?: string | null;
  readonly summary?: string | null;
  readonly tenantId: string;
}

export interface EnqueueOutboxEventResult {
  readonly id: string;
}

function assertScopedOutboxWrite(input: EnqueueOutboxEventInput): void {
  if (input.tenantId.trim().length === 0) {
    throw new ApiRouteError(
      "internal_error",
      "Outbox enqueue requires tenantId."
    );
  }

  if (input.companyId.trim().length === 0) {
    throw new ApiRouteError(
      "internal_error",
      "Outbox enqueue requires companyId."
    );
  }

  if (input.correlationId.trim().length === 0) {
    throw new ApiRouteError(
      "internal_error",
      "Outbox enqueue requires correlationId."
    );
  }

  if (!isExecutionPayload(input.payload)) {
    throw new ApiRouteError(
      "validation_failed",
      "Outbox payload must be JSON-serializable."
    );
  }

  if (input.metadata !== undefined && !isExecutionJsonObject(input.metadata)) {
    throw new ApiRouteError(
      "validation_failed",
      "Outbox metadata must be JSON-serializable."
    );
  }
}

function buildOutboxMetadata(
  metadata: ExecutionJsonObject | undefined,
  tenantId: string
): ExecutionJsonObject {
  const base = metadata ?? {};

  if (isCanonicalEnterpriseId(tenantId)) {
    return base;
  }

  return {
    ...base,
    tenantPk: tenantId,
  };
}

export async function enqueueOutboxEvent(
  input: EnqueueOutboxEventInput,
  db?: AfendaDatabase
): Promise<EnqueueOutboxEventResult> {
  assertScopedOutboxWrite(input);

  const database = db ?? getDb();

  const [row] = await database
    .insert(outboxEvents)
    .values({
      actorId: input.actorId,
      actorType: input.actorType ?? "user",
      causationId: input.causationId ?? null,
      companyId: input.companyId,
      correlationId: input.correlationId,
      eventId: input.eventId ?? randomUUID(),
      eventType: input.eventType,
      eventVersion: input.eventVersion ?? "1.0",
      executionRunId: input.executionRunId ?? null,
      metadata: buildOutboxMetadata(input.metadata, input.tenantId),
      organizationId: input.organizationId ?? null,
      payload: input.payload,
      reason: input.reason ?? null,
      summary: input.summary ?? null,
      tenantId: input.tenantId,
    })
    .returning({ id: outboxEvents.id });

  if (row === undefined) {
    throw new ApiRouteError("internal_error", "Outbox enqueue failed.");
  }

  return { id: row.id };
}
