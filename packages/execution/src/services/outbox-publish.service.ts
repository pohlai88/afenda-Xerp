import type { AuditEventPersistenceAdapter } from "@afenda/observability";
import { withAuditEvidence } from "@afenda/observability";
import { OUTBOX_AUDIT_ACTIONS } from "../contracts/execution.contract.js";
import {
  createExecutionFailure,
  createExecutionSuccess,
  type ExecutionResult,
} from "../contracts/execution-result.contract.js";
import type {
  ClaimOutboxEventsInput,
  OutboxEventDispatcher,
  OutboxEventRecord,
  OutboxPersistencePort,
} from "../contracts/outbox-event.contract.js";
import {
  assertOutboxRecordTenantScope,
  toOutboxEventEnvelope,
  validateOutboxPayload,
} from "../contracts/outbox-event.contract.js";
import {
  computeRetryDelayMs,
  DEFAULT_RETRY_POLICY,
} from "../contracts/retry-policy.contract.js";

export interface OutboxPublishServiceDependencies {
  readonly auditAdapter?: AuditEventPersistenceAdapter | null;
  readonly dispatcher: OutboxEventDispatcher;
  readonly nowIso?: () => string;
  readonly persistence?: OutboxPersistencePort | null;
}

export interface PublishOutboxBatchInput {
  readonly limit?: number;
  readonly lockedBy: string;
  readonly tenantId?: string | null;
}

export interface PublishOutboxBatchResult {
  readonly claimed: number;
  readonly deadLetter: number;
  readonly failed: number;
  readonly published: number;
  readonly skipped: number;
}

export interface OutboxPublishService {
  publishBatch(
    input: PublishOutboxBatchInput
  ): Promise<ExecutionResult<PublishOutboxBatchResult>>;
}

const DEFAULT_BATCH_LIMIT = 25;

const persistenceUnavailableMessage =
  "Outbox persistence is unavailable. Wire an OutboxPersistencePort adapter.";

async function protectPublishCall<TValue>(
  operation: () => Promise<ExecutionResult<TValue>>
): Promise<ExecutionResult<TValue>> {
  try {
    return await operation();
  } catch (error: unknown) {
    return createExecutionFailure(
      "provider_error",
      error instanceof Error
        ? error.message
        : "Outbox publish operation failed."
    );
  }
}

async function publishSingleEvent(
  record: OutboxEventRecord,
  dependencies: {
    dispatcher: OutboxEventDispatcher;
    nowIso: () => string;
    persistence: OutboxPersistencePort;
    tenantId: string | null | undefined;
  }
): Promise<"dead_letter" | "failed" | "published" | "skipped"> {
  const { dispatcher, nowIso, persistence, tenantId } = dependencies;

  try {
    assertOutboxRecordTenantScope(record, tenantId);
  } catch {
    await persistence.releaseClaim({
      availableAt: nowIso(),
      id: record.id,
    });
    return "skipped";
  }

  const payload = validateOutboxPayload(record);

  if (!payload) {
    await persistence.markFailed({
      attempts: record.attempts + 1,
      availableAt: nowIso(),
      failedAt: nowIso(),
      id: record.id,
      lastError: "Outbox payload is not JSON-serializable.",
    });
    return "failed";
  }

  const envelope = toOutboxEventEnvelope({ ...record, payload });
  const dispatchResult = await dispatcher.dispatch(envelope);

  if (dispatchResult.ok) {
    await persistence.markPublished({
      id: record.id,
      publishedAt: nowIso(),
    });
    return "published";
  }

  const nextAttempts = record.attempts + 1;
  const errorMessage = dispatchResult.error ?? "Outbox dispatch failed.";

  if (nextAttempts >= record.maxAttempts) {
    await persistence.markDeadLetter({
      failedAt: nowIso(),
      id: record.id,
      lastError: errorMessage,
    });
    return "dead_letter";
  }

  const delayMs = computeRetryDelayMs(DEFAULT_RETRY_POLICY, nextAttempts);
  const nextAvailableAt = new Date(Date.now() + delayMs).toISOString();

  await persistence.markFailed({
    attempts: nextAttempts,
    availableAt: nextAvailableAt,
    failedAt: nowIso(),
    id: record.id,
    lastError: errorMessage,
  });

  return "failed";
}

function buildOutboxBatchAuditEvidence(
  input: PublishOutboxBatchInput,
  batchResult: PublishOutboxBatchResult
) {
  return {
    action: OUTBOX_AUDIT_ACTIONS.OUTBOX_BATCH_COMPLETED,
    actorId: input.lockedBy,
    actorType: "system" as const,
    correlationId: input.lockedBy,
    metadata: {
      claimed: batchResult.claimed,
      deadLetter: batchResult.deadLetter,
      failed: batchResult.failed,
      published: batchResult.published,
      skipped: batchResult.skipped,
    },
    module: "execution",
    source: "job" as const,
    targetId: input.lockedBy,
    targetType: "outbox_batch",
    ...(input.tenantId === undefined ? {} : { tenantId: input.tenantId }),
  };
}

export function createOutboxPublishService(
  dependencies: OutboxPublishServiceDependencies
): OutboxPublishService {
  const persistence = dependencies.persistence ?? null;
  const auditAdapter = dependencies.auditAdapter ?? null;
  const nowIso = dependencies.nowIso ?? (() => new Date().toISOString());

  return {
    publishBatch(input: PublishOutboxBatchInput) {
      return protectPublishCall(async () => {
        if (!persistence) {
          return createExecutionFailure(
            "provider_unavailable",
            persistenceUnavailableMessage
          );
        }

        const claimInput: ClaimOutboxEventsInput = {
          limit: input.limit ?? DEFAULT_BATCH_LIMIT,
          lockedBy: input.lockedBy,
          nowIso: nowIso(),
          ...(input.tenantId === undefined ? {} : { tenantId: input.tenantId }),
        };

        const claimed = await persistence.claimPending(claimInput);

        let published = 0;
        let failed = 0;
        let deadLetter = 0;
        let skipped = 0;

        for (const record of claimed) {
          const outcome = await publishSingleEvent(record, {
            dispatcher: dependencies.dispatcher,
            nowIso,
            persistence,
            tenantId: input.tenantId,
          });

          switch (outcome) {
            case "published":
              published += 1;
              break;
            case "failed":
              failed += 1;
              break;
            case "dead_letter":
              deadLetter += 1;
              break;
            case "skipped":
              skipped += 1;
              break;
            default: {
              const _exhaustive: never = outcome;
              return createExecutionFailure(
                "provider_error",
                `Unexpected publish outcome: ${String(_exhaustive)}`
              );
            }
          }
        }

        const batchResult: PublishOutboxBatchResult = {
          claimed: claimed.length,
          deadLetter,
          failed,
          published,
          skipped,
        };

        const { value } = await withAuditEvidence(
          buildOutboxBatchAuditEvidence(input, batchResult),
          async () => batchResult,
          auditAdapter
        );

        return createExecutionSuccess(value);
      });
    },
  };
}

export const unavailableOutboxDispatcher: OutboxEventDispatcher = {
  dispatch() {
    return Promise.resolve({
      error: persistenceUnavailableMessage,
      ok: false,
    });
  },
};

export const outboxPublishService = createOutboxPublishService({
  dispatcher: unavailableOutboxDispatcher,
  persistence: null,
});
