import type { SystemAdminAuditTableRow } from "@/lib/presentation/system-admin-audit-table-row";
import type { SystemAdminAuditEventRowDto } from "@/server/api/contracts/system-admin/system-admin.api-contract";

export function mapAuditEventWireToTableRow(
  event: SystemAdminAuditEventRowDto
): SystemAdminAuditTableRow {
  const target =
    event.targetId === null
      ? event.targetType
      : `${event.targetType} · ${event.targetId}`;

  return {
    action: event.action,
    correlationId: event.correlationId,
    createdAt: event.createdAt,
    id: event.id,
    result: event.result,
    target,
  };
}
