import { buildAuditEventRow } from "./audit-event.builder.js";
import type {
  AuditEventPersistenceAdapter,
  WriteAuditEventInput,
  WriteAuditEventResult,
} from "./contracts/audit-event.contract.js";

let defaultAuditEventAdapter: AuditEventPersistenceAdapter | null = null;

export function configureAuditEventPersistence(
  adapter: AuditEventPersistenceAdapter
): void {
  defaultAuditEventAdapter = adapter;
}

export function resetAuditEventPersistence(): void {
  defaultAuditEventAdapter = null;
}

/**
 * Single audit writer authority for TIP-010.
 *
 * Packages may call this function, but persistence remains delegated to a
 * database-owned adapter so observability does not import database internals.
 */
export async function writeAuditEvent(
  input: WriteAuditEventInput,
  adapter: AuditEventPersistenceAdapter | null = defaultAuditEventAdapter
): Promise<WriteAuditEventResult> {
  if (!adapter) {
    throw new Error("Audit event persistence adapter is not configured.");
  }

  return await adapter.write(buildAuditEventRow(input));
}
