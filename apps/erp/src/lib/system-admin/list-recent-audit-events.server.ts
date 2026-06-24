import { type AuditResult, auditEvents, getDb } from "@afenda/database";
import { desc, eq } from "drizzle-orm";

const DEFAULT_AUDIT_EVENT_LIMIT = 50;

export interface AdminAuditEventRow {
  readonly action: string;
  readonly correlationId: string;
  readonly createdAt: string;
  readonly id: string;
  readonly module: string;
  readonly result: AuditResult;
  readonly targetId: string | null;
  readonly targetType: string;
}

type AuditEventDbRow = Pick<
  typeof auditEvents.$inferSelect,
  | "id"
  | "action"
  | "module"
  | "targetType"
  | "targetId"
  | "result"
  | "correlationId"
  | "createdAt"
>;

export function mapAuditEventRow(row: AuditEventDbRow): AdminAuditEventRow {
  return {
    id: row.id,
    action: row.action,
    module: row.module,
    targetType: row.targetType,
    targetId: row.targetId,
    result: row.result,
    correlationId: row.correlationId,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listRecentAuditEvents(input: {
  readonly tenantId: string;
  readonly limit?: number;
}): Promise<AdminAuditEventRow[]> {
  const limit = input.limit ?? DEFAULT_AUDIT_EVENT_LIMIT;
  const db = getDb();

  const rows = await db
    .select({
      id: auditEvents.id,
      action: auditEvents.action,
      module: auditEvents.module,
      targetType: auditEvents.targetType,
      targetId: auditEvents.targetId,
      result: auditEvents.result,
      correlationId: auditEvents.correlationId,
      createdAt: auditEvents.createdAt,
    })
    .from(auditEvents)
    .where(eq(auditEvents.tenantId, input.tenantId))
    .orderBy(desc(auditEvents.createdAt))
    .limit(limit);

  return rows.map(mapAuditEventRow);
}
