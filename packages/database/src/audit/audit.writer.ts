import { writeAuditEvent } from "@afenda/observability";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { auditEvents } from "../schema/audit.schema.js";
import type {
  AuditEventInsertRow,
  InsertAuditEventInput,
} from "./audit-event.contract.js";

export interface InsertAuditEventResult {
  readonly id: string;
}

async function persistAuditEventRow(
  row: AuditEventInsertRow,
  db: AfendaDatabase = getDb()
): Promise<InsertAuditEventResult> {
  const [inserted] = await db
    .insert(auditEvents)
    .values(row)
    .returning({ id: auditEvents.id });

  if (!inserted) {
    throw new Error("Audit insert did not return a row id.");
  }

  return { id: inserted.id };
}

/**
 * Backward-compatible database adapter for the TIP-010 audit writer authority.
 *
 * New code should import `writeAuditEvent()` from `@afenda/observability`.
 */
export async function insertAuditEvent(
  input: InsertAuditEventInput,
  db: AfendaDatabase = getDb()
): Promise<InsertAuditEventResult> {
  return await writeAuditEvent(input, {
    write: (row) => persistAuditEventRow(row, db),
  });
}
