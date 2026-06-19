import { auditEvents, createDb } from "@afenda/database";

import type { AuthEventContext, AuthEventName } from "./auth.events.js";

export type AuthAuditResult = "success" | "failure" | "denied";

export interface AuthAuditRecordInput {
  readonly context?: AuthEventContext;
  readonly event: AuthEventName;
  readonly reason?: string;
  readonly result: AuthAuditResult;
}

export interface AuthAuditWriter {
  write(record: AuthAuditRecordInput): Promise<void>;
}

export interface AuthAuditInsertPayload {
  readonly action: AuthEventName;
  readonly actorUserId: string | null;
  readonly correlationId: string;
  readonly metadata: {
    readonly authUserId: string | null;
    readonly email: string | null;
    readonly ipAddress: string | null;
    readonly userAgent: string | null;
  };
  readonly module: "auth";
  readonly reason: string | null;
  readonly result: AuthAuditResult;
  readonly targetId: string | null;
  readonly targetType: "auth_session";
}

/** Builds the audit_events row payload without performing I/O (testable). */
export function buildAuthAuditPayload(
  record: AuthAuditRecordInput
): AuthAuditInsertPayload {
  const correlationId =
    record.context?.correlationId ?? `auth-${crypto.randomUUID()}`;

  return {
    actorUserId: null,
    module: "auth",
    action: record.event,
    targetType: "auth_session",
    targetId: record.context?.sessionId ?? record.context?.authUserId ?? null,
    result: record.result,
    reason: record.reason ?? record.context?.reason ?? null,
    correlationId,
    metadata: {
      authUserId: record.context?.authUserId ?? null,
      email: record.context?.email ?? null,
      ipAddress: record.context?.ipAddress ?? null,
      userAgent: record.context?.userAgent ?? null,
    },
  };
}

export function createDatabaseAuthAuditWriter(): AuthAuditWriter {
  return {
    async write(record) {
      try {
        const db = createDb();
        const payload = buildAuthAuditPayload(record);

        await db.insert(auditEvents).values(payload);
      } catch {
        // Audit must not block auth flows; failures are swallowed intentionally.
      }
    },
  };
}

export async function recordAuthAuditEvent(
  record: AuthAuditRecordInput,
  writer: AuthAuditWriter = createDatabaseAuthAuditWriter()
): Promise<void> {
  await writer.write(record);
}
