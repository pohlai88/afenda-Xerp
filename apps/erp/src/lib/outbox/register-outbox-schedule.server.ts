import type { ExecutionService } from "@afenda/execution";
import {
  createExecutionContext,
  createPublishOutboxEventsScheduleDefinition,
  isExecutionSuccess,
  PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID,
} from "@afenda/execution";

import { createApiHandlerLogger } from "@/server/api/runtime/api-handler-logging";

import {
  recordScheduleRegistrationFailure,
  recordScheduleRegistrationSkipped,
  recordScheduleRegistrationSuccess,
} from "./execution-spine-state.server.js";

const outboxFoundationLogger = createApiHandlerLogger("outbox-foundation");

export async function registerOutboxSchedule(input: {
  readonly executionService: ExecutionService;
  readonly schedulerRequired: boolean;
  readonly triggerSecretKeyConfigured: boolean;
}): Promise<void> {
  if (!input.schedulerRequired) {
    recordScheduleRegistrationSkipped();
    outboxFoundationLogger.info("outbox.foundation.schedule_skipped", {
      reason: "OUTBOX_SCHEDULER_REQUIRED is false",
      triggerProviderState: input.triggerSecretKeyConfigured
        ? "active"
        : "degraded",
    });
    return;
  }

  if (input.triggerSecretKeyConfigured) {
    const scheduleResult = await input.executionService.schedule({
      context: createExecutionContext({
        correlationId: `outbox-foundation-${crypto.randomUUID()}`,
        source: "system",
      }),
      schedule: createPublishOutboxEventsScheduleDefinition(),
    });

    if (isExecutionSuccess(scheduleResult)) {
      recordScheduleRegistrationSuccess(PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID);
      outboxFoundationLogger.info("outbox.foundation.schedule_registered", {
        scheduleId: PUBLISH_OUTBOX_EVENTS_SCHEDULE_ID,
      });
      return;
    }

    recordScheduleRegistrationFailure(scheduleResult.error.message);
    outboxFoundationLogger.error("outbox.foundation.schedule_failed", {
      critical: true,
      reason: scheduleResult.error.message,
    });
    return;
  }

  recordScheduleRegistrationFailure("TRIGGER_SECRET_KEY is not configured");
  outboxFoundationLogger.error("outbox.foundation.schedule_failed", {
    critical: true,
    reason: "TRIGGER_SECRET_KEY is not configured",
  });
}
