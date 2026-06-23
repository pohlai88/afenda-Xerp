import {
  configurePublishOutboxEventsTask,
  createExecutionRegistry,
  createExecutionService,
  createOutboxPublishService,
  createTriggerExecutionProvider,
  isExecutionSuccess,
  registerPublishOutboxEventsWorkflow,
  runPublishOutboxEventsJob,
} from "@afenda/execution";

import { createApiHandlerLogger } from "@/server/api/runtime/api-handler-logging";

import { createDrizzleOutboxPersistenceAdapter } from "./drizzle-outbox-persistence.adapter.js";
import {
  assertSchedulerStartupPolicy,
  readExecutionSpinePolicy,
  readTriggerSecretKeyConfigured,
} from "./execution-spine-policy.server.js";
import {
  getExecutionSpineRegistrationState,
  markOutboxFoundationRegistered,
} from "./execution-spine-state.server.js";
import { createLoggingOutboxEventDispatcher } from "./logging-outbox-dispatcher.server.js";
import { registerOutboxSchedule } from "./register-outbox-schedule.server.js";
import { verifyOutboxWorkerRelease } from "./verify-outbox-worker-release.server.js";

const outboxFoundationLogger = createApiHandlerLogger("outbox-foundation");

let outboxFoundationRegistered = false;

export async function registerOutboxFoundation(): Promise<void> {
  if (outboxFoundationRegistered) {
    return;
  }

  const policy = readExecutionSpinePolicy();
  const triggerSecretKeyConfigured = readTriggerSecretKeyConfigured();

  const publishService = createOutboxPublishService({
    dispatcher: createLoggingOutboxEventDispatcher(),
    persistence: createDrizzleOutboxPersistenceAdapter(),
  });

  configurePublishOutboxEventsTask(async () => {
    const result = await runPublishOutboxEventsJob(publishService, {});

    if (!isExecutionSuccess(result)) {
      throw new Error(result.error.message);
    }

    return result.value;
  });

  const registry = createExecutionRegistry();
  registerPublishOutboxEventsWorkflow(registry);

  const executionService = createExecutionService({
    provider: createTriggerExecutionProvider(),
    registry,
  });

  await registerOutboxSchedule({
    executionService,
    schedulerRequired: policy.schedulerRequired,
    triggerSecretKeyConfigured,
  });

  const registrationState = getExecutionSpineRegistrationState();

  assertSchedulerStartupPolicy({
    policy,
    scheduleErrorMessage: registrationState.lastScheduleRegistrationError,
    scheduleRegistered: registrationState.outboxScheduleRegistered,
    triggerSecretKeyConfigured,
  });

  await verifyOutboxWorkerRelease({
    policy,
    triggerSecretKeyConfigured,
  });

  if (
    policy.allowDegradedExecution &&
    policy.schedulerRequired &&
    !registrationState.outboxScheduleRegistered
  ) {
    outboxFoundationLogger.error("outbox.foundation.degraded_override", {
      critical: true,
      reason: registrationState.lastScheduleRegistrationError,
    });
  }

  markOutboxFoundationRegistered();
  outboxFoundationRegistered = true;
}
