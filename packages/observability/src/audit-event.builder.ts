import { parseWriteAuditEventInput } from "./audit-event.validation.js";
import type {
  AuditEventInsertRow,
  WriteAuditEventInput,
} from "./contracts/audit-event.contract.js";

/** Normalizes and validates caller input into the governed audit row shape. */
export function buildAuditEventRow(
  input: WriteAuditEventInput
): AuditEventInsertRow {
  return parseWriteAuditEventInput(input);
}
