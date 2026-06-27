import type { AuditEventPersistenceAdapter } from "@afenda/observability";
import { writeAuditEvent } from "@afenda/observability";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { createEnterpriseId } from "../enterprise-id/index.js";
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
  db: AfendaDatabase
): Promise<InsertAuditEventResult> {
  const [inserted] = await db
    .insert(auditEvents)
    .values({
      ...row,
      enterpriseId: createEnterpriseId("auditEvent"),
    })
    .returning({ id: auditEvents.id });

  if (!inserted) {
    throw new Error("Audit insert did not return a row id.");
  }

  return { id: inserted.id };
}

/**
 * Creates a database-backed `AuditEventPersistenceAdapter` for use with
 * `configureAuditEventPersistence()` in server bootstrap.
 *
 * @example
 * ```ts
 * // apps/erp/instrumentation.ts
 * import { configureAuditEventPersistence } from "@afenda/observability";
 * import { createDatabaseAuditAdapter } from "@afenda/database";
 *
 * export async function register() {
 *   if (process.env.NEXT_RUNTIME === "nodejs") {
 *     configureAuditEventPersistence(createDatabaseAuditAdapter());
 *   }
 * }
 * ```
 */
export function createDatabaseAuditAdapter(
  db: AfendaDatabase = getDb()
): AuditEventPersistenceAdapter {
  return {
    write: (row) => persistAuditEventRow(row, db),
  };
}

/**
 * Backward-compatible audit writer for the TIP-010 authority.
 *
 * New code should use `withAuditEvidence()` from `@afenda/observability`.
 */
export async function insertAuditEvent(
  input: InsertAuditEventInput,
  db: AfendaDatabase = getDb()
): Promise<InsertAuditEventResult> {
  return await writeAuditEvent(input, createDatabaseAuditAdapter(db));
}
