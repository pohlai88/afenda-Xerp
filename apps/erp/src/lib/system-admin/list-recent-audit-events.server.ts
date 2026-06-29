import { type AuditResult, auditEvents, getDb } from "@afenda/database";
import { and, desc, eq, lt, or, type SQL } from "drizzle-orm";

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

export interface ListRecentAuditEventsResult {
  readonly events: readonly AdminAuditEventRow[];
  readonly hasMore: boolean;
  readonly nextCursor: string | null;
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

const auditEventSelection = {
  id: auditEvents.id,
  action: auditEvents.action,
  module: auditEvents.module,
  targetType: auditEvents.targetType,
  targetId: auditEvents.targetId,
  result: auditEvents.result,
  correlationId: auditEvents.correlationId,
  createdAt: auditEvents.createdAt,
} as const;

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

async function resolveCursorAuditEvent(input: {
  readonly cursor: string;
  readonly tenantId: string;
}): Promise<AuditEventDbRow | null> {
  const db = getDb();
  const [row] = await db
    .select(auditEventSelection)
    .from(auditEvents)
    .where(
      and(
        eq(auditEvents.tenantId, input.tenantId),
        eq(auditEvents.id, input.cursor)
      )
    )
    .limit(1);

  return row ?? null;
}

function buildCursorFilter(tenantId: string, cursorRow: AuditEventDbRow): SQL {
  return and(
    eq(auditEvents.tenantId, tenantId),
    or(
      lt(auditEvents.createdAt, cursorRow.createdAt),
      and(
        eq(auditEvents.createdAt, cursorRow.createdAt),
        lt(auditEvents.id, cursorRow.id)
      )
    )
  ) as SQL;
}

export async function listRecentAuditEvents(input: {
  readonly cursor?: string;
  readonly limit?: number;
  readonly tenantId: string;
}): Promise<ListRecentAuditEventsResult> {
  const limit = input.limit ?? DEFAULT_AUDIT_EVENT_LIMIT;
  const fetchLimit = limit + 1;
  const db = getDb();

  let whereCondition: SQL = eq(auditEvents.tenantId, input.tenantId);

  if (input.cursor !== undefined) {
    const cursorRow = await resolveCursorAuditEvent({
      cursor: input.cursor,
      tenantId: input.tenantId,
    });

    if (cursorRow === null) {
      return {
        events: [],
        hasMore: false,
        nextCursor: null,
      };
    }

    whereCondition = buildCursorFilter(input.tenantId, cursorRow);
  }

  const rows = await db
    .select(auditEventSelection)
    .from(auditEvents)
    .where(whereCondition)
    .orderBy(desc(auditEvents.createdAt), desc(auditEvents.id))
    .limit(fetchLimit);

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const events = pageRows.map(mapAuditEventRow);
  const lastEvent = events.at(-1);

  return {
    events,
    hasMore,
    nextCursor: hasMore && lastEvent !== undefined ? lastEvent.id : null,
  };
}
