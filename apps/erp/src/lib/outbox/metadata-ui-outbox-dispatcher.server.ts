import {
  type OutboxDispatchResult,
  type OutboxEventDispatcher,
  type OutboxEventEnvelope,
  toDomainEventFromOutboxEnvelope,
} from "@afenda/execution";
import { resolveMetadataUiRenderRefreshHint } from "@afenda/metadata-ui/server";
import { revalidatePath } from "next/cache";

import { createApiHandlerLogger } from "@/server/api/runtime/api-handler-logging";

import { createLoggingOutboxEventDispatcher } from "./logging-outbox-dispatcher.server.js";

const metadataUiOutboxLogger = createApiHandlerLogger(
  "outbox-metadata-ui-dispatch"
);

function revalidateMetadataUiSurface(
  surface: NonNullable<
    ReturnType<typeof resolveMetadataUiRenderRefreshHint>
  >["surface"]
): void {
  switch (surface) {
    case "workspace":
      revalidatePath("/workspace", "layout");
      return;
    case "module":
      revalidatePath("/workspace", "page");
      return;
    case "page":
      revalidatePath("/workspace", "page");
      return;
    default: {
      const _exhaustive: never = surface;
      throw new Error(`Unknown metadata-ui surface: ${String(_exhaustive)}`);
    }
  }
}

export function createMetadataUiOutboxEventDispatcher(
  inner: OutboxEventDispatcher = createLoggingOutboxEventDispatcher()
): OutboxEventDispatcher {
  return {
    async dispatch(
      envelope: OutboxEventEnvelope
    ): Promise<OutboxDispatchResult> {
      const domainEvent = toDomainEventFromOutboxEnvelope(envelope);
      const refreshHint = resolveMetadataUiRenderRefreshHint(
        domainEvent.eventName
      );

      const result = await inner.dispatch(envelope);

      if (result.ok && refreshHint !== null) {
        revalidateMetadataUiSurface(refreshHint.surface);
        metadataUiOutboxLogger.info("outbox.metadata-ui.refresh", {
          correlationId: domainEvent.correlationId,
          eventId: domainEvent.eventId,
          eventName: domainEvent.eventName,
          surface: refreshHint.surface,
        });
      }

      return result;
    },
  };
}
