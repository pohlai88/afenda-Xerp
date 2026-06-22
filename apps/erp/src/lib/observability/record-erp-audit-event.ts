import {
  AuditAdapterMissingError,
  writeAuditEvent,
  type AuditActorType,
  type AuditResult,
  type AuditSource,
  type LogMetadata,
} from "@afenda/observability";
import { headers } from "next/headers";

import { createErpLogger } from "./create-erp-logger";
import { toErpCorrelationId } from "./erp-correlation-id";
import { resolveCorrelationIdFromHeaders } from "./resolve-correlation-id";

export interface RecordErpAuditInput {
  readonly action: string;
  readonly actorType?: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId?: string;
  readonly fallbackMetadata?: LogMetadata;
  readonly module: string;
  readonly result: AuditResult;
  readonly source?: AuditSource;
  readonly targetId?: string | null;
  readonly targetType: string;
}

export async function recordErpAuditEvent(
  input: RecordErpAuditInput
): Promise<void> {
  const correlationId =
    input.correlationId ??
    resolveCorrelationIdFromHeaders(await headers());

  try {
    await writeAuditEvent({
      action: input.action,
      actorType: input.actorType ?? "user",
      actorUserId: input.actorUserId ?? null,
      correlationId,
      module: input.module,
      result: input.result,
      source: input.source ?? "app",
      targetId: input.targetId ?? null,
      targetType: input.targetType,
    });
  } catch (error: unknown) {
    if (!(error instanceof AuditAdapterMissingError)) {
      throw error;
    }

    createErpLogger({
      correlationId: toErpCorrelationId(correlationId),
      module: input.module,
    }).warn("audit.skipped", {
      action: input.action,
      reason: "audit_adapter_missing",
      ...(input.fallbackMetadata ?? {}),
    });
  }
}
