import type { AuditResult } from "@afenda/observability";

import { recordErpAuditEvent } from "@/lib/observability/record-erp-audit-event";

interface RecordActionAuditInput {
  readonly action: string;
  readonly actorUserId: string;
  readonly module: string;
  readonly result: AuditResult;
  readonly targetId?: string | null;
  readonly targetType: string;
}

export async function recordActionAudit(
  input: RecordActionAuditInput
): Promise<void> {
  await recordErpAuditEvent({
    action: input.action,
    actorUserId: input.actorUserId,
    module: input.module,
    result: input.result,
    targetId: input.targetId ?? null,
    targetType: input.targetType,
  });
}
