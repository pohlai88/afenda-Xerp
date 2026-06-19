import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { auditEvents } from "../schema/audit.schema.js";
import { buildAuditEventRow } from "./audit-event.builder.js";
import type { InsertAuditEventInput } from "./audit-event.contract.js";

export interface InsertAuditEventResult {
  readonly id: string;
}

/**
 * Append-only audit writer.
 *
 * This is the only supported write path for `audit_events`.
 * Do not call `db.insert(auditEvents)`, `db.update(auditEvents)`,
 * or `db.delete(auditEvents)` from feature modules.
 */
export async function insertAuditEvent(
  input: InsertAuditEventInput,
  db: AfendaDatabase = getDb()
): Promise<InsertAuditEventResult> {
  const row = buildAuditEventRow(input);

  const [inserted] = await db
    .insert(auditEvents)
    .values(row)
    .returning({ id: auditEvents.id });

  if (!inserted) {
    throw new Error("Audit insert did not return a row id.");
  }

  return { id: inserted.id };
}
