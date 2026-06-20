import { buildAuditEventRow } from "./audit-event.builder.js";
import type {
  AuditEventPersistenceAdapter,
  WriteAuditEventInput,
  WriteAuditEventResult,
} from "./contracts/audit-event.contract.js";

let defaultAuditEventAdapter: AuditEventPersistenceAdapter | null = null;

/**
 * Thrown when an audit write is attempted but no persistence adapter has been
 * configured via `configureAuditEventPersistence()`.
 *
 * Critical actions catch this specifically to fail closed.
 * Non-critical actions swallow it silently.
 */
export class AuditAdapterMissingError extends Error {
  constructor() {
    super(
      "Audit persistence adapter is not configured. " +
        "Call configureAuditEventPersistence() during server bootstrap " +
        "before protected actions run."
    );
    this.name = "AuditAdapterMissingError";
  }
}

export function configureAuditEventPersistence(
  adapter: AuditEventPersistenceAdapter
): void {
  defaultAuditEventAdapter = adapter;
}

export function resetAuditEventPersistence(): void {
  defaultAuditEventAdapter = null;
}

/**
 * Returns true when a persistence adapter is ready.
 * Use in bootstrap health checks to assert readiness before serving traffic.
 */
export function isAuditPersistenceConfigured(): boolean {
  return defaultAuditEventAdapter !== null;
}

/**
 * Single audit writer authority for TIP-010.
 *
 * Packages may call this function, but persistence remains delegated to a
 * database-owned adapter so observability does not import database internals.
 *
 * @throws {AuditAdapterMissingError} When no adapter is configured and none is passed.
 */
export async function writeAuditEvent(
  input: WriteAuditEventInput,
  adapter: AuditEventPersistenceAdapter | null = defaultAuditEventAdapter
): Promise<WriteAuditEventResult> {
  if (!adapter) {
    throw new AuditAdapterMissingError();
  }

  return await adapter.write(buildAuditEventRow(input));
}
