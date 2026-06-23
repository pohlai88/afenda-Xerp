import type {
  OutboxEventDispatcher,
  OutboxEventEnvelope,
} from "@afenda/execution";

import { createApiHandlerLogger } from "@/server/api/runtime/api-handler-logging";

const outboxDispatchLogger = createApiHandlerLogger("outbox-dispatch");

export function createLoggingOutboxEventDispatcher(): OutboxEventDispatcher {
  return {
    dispatch(envelope: OutboxEventEnvelope) {
      outboxDispatchLogger.info("outbox.event.dispatched", {
        correlationId: envelope.correlationId,
        eventId: envelope.eventId,
        eventType: envelope.eventType,
        tenantId: envelope.executionContext.tenantId,
      });

      return Promise.resolve({ ok: true as const });
    },
  };
}
