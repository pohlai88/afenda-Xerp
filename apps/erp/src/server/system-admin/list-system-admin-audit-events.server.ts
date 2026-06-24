import {
  type AdminAuditEventRow,
  listRecentAuditEvents,
} from "@/lib/system-admin/list-recent-audit-events.server";
import type { SystemAdminAuditEventRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

function toAuditEventDto(row: AdminAuditEventRow): SystemAdminAuditEventRowDto {
  return {
    action: row.action,
    correlationId: row.correlationId,
    createdAt: row.createdAt,
    id: row.id,
    module: row.module,
    result: row.result,
    targetId: row.targetId,
    targetType: row.targetType,
  };
}

export async function listSystemAdminAuditEvents(input: {
  readonly limit?: number;
  readonly tenantId: string;
}): Promise<{ readonly events: readonly SystemAdminAuditEventRowDto[] }> {
  const events =
    input.limit === undefined
      ? await listRecentAuditEvents({ tenantId: input.tenantId })
      : await listRecentAuditEvents({
          limit: input.limit,
          tenantId: input.tenantId,
        });

  return {
    events: events.map(toAuditEventDto),
  };
}
