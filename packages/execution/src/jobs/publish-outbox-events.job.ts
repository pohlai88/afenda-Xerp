import type { ExecutionResult } from "../contracts/execution-result.contract.js";
import { DEFAULT_RETRY_POLICY } from "../contracts/retry-policy.contract.js";
import type { ScheduleDefinition } from "../contracts/schedule.contract.js";
import type { ExecutionRegistry } from "../registry/execution-registry.js";
import type {
  OutboxPublishService,
  PublishOutboxBatchResult,
} from "../services/outbox-publish.service.js";

export const PUBLISH_OUTBOX_EVENTS_WORKFLOW_ID =
  "foundation.publish-outbox-events" as const;

export const PUBLISH_OUTBOX_EVENTS_TRIGGER_TASK_ID =
  "foundation.publish-outbox-events" as const;

export const PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID =
  "foundation.publish-outbox-events.poll" as const;

/** Poll interval for pending outbox rows (every 5 minutes). */
export const PUBLISH_OUTBOX_EVENTS_CRON = "*/5 * * * *" as const;

export interface RunPublishOutboxEventsJobInput {
  readonly limit?: number;
  readonly lockedBy?: string;
  readonly tenantId?: string | null;
}

export function registerPublishOutboxEventsWorkflow(
  registry: ExecutionRegistry
) {
  return registry.registerWorkflow({
    description: "Poll pending outbox rows and dispatch governed events.",
    kind: "job",
    retryPolicy: DEFAULT_RETRY_POLICY,
    triggerTaskId: PUBLISH_OUTBOX_EVENTS_TRIGGER_TASK_ID,
    workflowId: PUBLISH_OUTBOX_EVENTS_WORKFLOW_ID,
  });
}

export function runPublishOutboxEventsJob(
  service: OutboxPublishService,
  input: RunPublishOutboxEventsJobInput = {}
): Promise<ExecutionResult<PublishOutboxBatchResult>> {
  // Batch-completion audit evidence is emitted by OutboxPublishService when
  // createOutboxPublishService({ auditAdapter, ... }) wires an adapter.
  return service.publishBatch({
    ...(input.limit === undefined ? {} : { limit: input.limit }),
    lockedBy: input.lockedBy ?? PUBLISH_OUTBOX_EVENTS_WORKFLOW_ID,
    ...(input.tenantId === undefined ? {} : { tenantId: input.tenantId }),
  });
}

export function createPublishOutboxEventsScheduleDefinition(): ScheduleDefinition {
  return {
    cron: PUBLISH_OUTBOX_EVENTS_CRON,
    deduplicationKey: PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID,
    scheduleId: PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID,
    scheduleKind: "cron",
    workflowId: PUBLISH_OUTBOX_EVENTS_WORKFLOW_ID,
  };
}
