import {
  AUDIT_EVENT_VERSION,
  type AuditActorType,
  type InsertAuditEventInput,
  insertAuditEvent,
} from "@afenda/database";

import type {
  AuthAuditRecordInput,
  AuthEventContext,
} from "./auth.contract.js";

export type AuthAuditInsertPayload = InsertAuditEventInput & {
  readonly module: "auth";
  readonly source: "auth";
};

interface AuthAuditWriter {
  write(record: AuthAuditRecordInput): Promise<void>;
}

function resolveAuthActorType(context?: AuthEventContext): AuditActorType {
  return context?.authUserId ? "user" : "system";
}

/** Builds the governed audit insert payload without performing I/O (testable). */
export function buildAuthAuditPayload(
  record: AuthAuditRecordInput
): AuthAuditInsertPayload {
  const correlationId =
    record.context?.correlationId ?? `auth-${crypto.randomUUID()}`;

  return {
    actorType: resolveAuthActorType(record.context),
    actorUserId: null,
    module: "auth",
    action: record.event,
    targetType: "auth_session",
    targetId: record.context?.sessionId ?? record.context?.authUserId ?? null,
    result: record.result,
    reason: record.reason ?? record.context?.reason ?? null,
    correlationId,
    source: "auth",
    eventVersion: AUDIT_EVENT_VERSION,
    ipAddress: record.context?.ipAddress ?? null,
    userAgent: record.context?.userAgent ?? null,
    metadata: {
      /** Better Auth login identity — not platform `users.id`. */
      authUserId: record.context?.authUserId ?? null,
      email: record.context?.email ?? null,
    },
  };
}

function createDatabaseAuthAuditWriter(): AuthAuditWriter {
  return {
    async write(record) {
      try {
        const payload = buildAuthAuditPayload(record);
        await insertAuditEvent(payload);
      } catch {
        // Audit must not block auth flows; failures are swallowed intentionally.
      }
    },
  };
}

const defaultAuditWriter = createDatabaseAuthAuditWriter();

export function recordAuthAuditEvent(
  record: AuthAuditRecordInput,
  writer: AuthAuditWriter = defaultAuditWriter
): void {
  writer.write(record).catch(() => undefined);
}
