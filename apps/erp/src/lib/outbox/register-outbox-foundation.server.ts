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
import { persistenceCanonicalIdBodyGenerator } from "@/lib/identity/persistence-canonical-id-body-generator.server";
import { createDrizzleOutboxPersistenceAdapter } from "@/lib/outbox/drizzle-outbox-persistence.adapter";
import {
  assertSchedulerStartupPolicy,
  readExecutionSpinePolicy,
  readTriggerSecretKeyConfigured,
} from "@/lib/outbox/execution-spine-policy.server";
import {
  getExecutionSpineRegistrationState,
  markOutboxFoundationRegistered,
} from "@/lib/outbox/execution-spine-state.server";
import { createLoggingOutboxEventDispatcher } from "@/lib/outbox/logging-outbox-dispatcher.server";
import { registerOutboxSchedule } from "@/lib/outbox/register-outbox-schedule.server";
import { verifyOutboxWorkerRelease } from "@/lib/outbox/verify-outbox-worker-release.server";
import { createApiHandlerLogger } from "@/server/api/runtime/api-handler-logging";

const outboxFoundationLogger = createApiHandlerLogger("outbox-foundation");

let outboxFoundationRegistered = false;

export async function registerOutboxFoundation(): Promise<void> {
  if (outboxFoundationRegistered) {
    return;
  }

  const policy = readExecutionSpinePolicy();
  const triggerSecretKeyConfigured = readTriggerSecretKeyConfigured();

  const publishService = createOutboxPublishService({
    canonicalIdBodyGenerator: persistenceCanonicalIdBodyGenerator,
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
