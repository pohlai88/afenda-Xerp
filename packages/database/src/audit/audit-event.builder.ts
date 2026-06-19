import type {
  AuditEventInsertRow,
  InsertAuditEventInput,
} from "./audit-event.contract.js";
import { parseInsertAuditEventInput } from "./audit-event.validation.js";

/** Normalizes and validates caller input into the governed audit row shape (no I/O). */
export function buildAuditEventRow(
  input: InsertAuditEventInput
): AuditEventInsertRow {
  return parseInsertAuditEventInput(input);
}
