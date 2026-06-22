import { unbrand } from "@afenda/kernel";

import { recordErpAuditEvent } from "@/lib/observability/record-erp-audit-event";

import type { ApiAuditPolicy } from "../contracts/api-contract";
import type { ApiRequestContext } from "./api-request-context";

export async function emitApiDeniedAuditEvidence(
  audit: ApiAuditPolicy | undefined,
  context: {
    readonly correlationId: string;
    readonly requestId: string;
    readonly userId: string | null;
  }
): Promise<void> {
  if (audit === undefined || !audit.enabled) {
    return;
  }

  await recordErpAuditEvent({
    action: audit.action,
    actorType: context.userId === null ? "system" : "user",
    actorUserId: context.userId,
    correlationId: context.correlationId,
    fallbackMetadata: { requestId: context.requestId },
    module: "@afenda/erp",
    result: "denied",
    source: "api",
    targetType: audit.targetType,
  });
}

export async function emitApiAuditEvidence(
  audit: ApiAuditPolicy | undefined,
  context: ApiRequestContext<unknown>
): Promise<void> {
  if (audit === undefined || !audit.enabled) {
    return;
  }

  await recordErpAuditEvent({
    action: audit.action,
    actorType: context.userId === null ? "system" : "user",
    actorUserId:
      context.userId === null ? null : unbrand(context.userId),
    correlationId: context.correlationId,
    fallbackMetadata: { requestId: context.requestId },
    module: "@afenda/erp",
    result: "success",
    source: "api",
    targetType: audit.targetType,
  });
}
