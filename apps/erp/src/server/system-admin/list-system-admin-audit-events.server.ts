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
  readonly cursor?: string;
  readonly limit: number;
  readonly tenantId: string;
}): Promise<{
  readonly events: readonly SystemAdminAuditEventRowDto[];
  readonly hasMore: boolean;
  readonly nextCursor: string | null;
}> {
  const result = await listRecentAuditEvents({
    limit: input.limit,
    tenantId: input.tenantId,
    ...(input.cursor === undefined ? {} : { cursor: input.cursor }),
  });

  return {
    events: result.events.map(toAuditEventDto),
    hasMore: result.hasMore,
    nextCursor: result.nextCursor,
  };
}
