import {
  AUDIT_EVENT_VERSION,
  type AuditActorType,
  findPlatformUserIdByAuthUserId,
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
  record: AuthAuditRecordInput,
  actorUserId: string | null = null
): AuthAuditInsertPayload {
  const correlationId =
    record.context?.correlationId ?? `auth-${crypto.randomUUID()}`;

  return {
    actorType: resolveAuthActorType(record.context),
    actorUserId,
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
      platformUserId: actorUserId,
    },
  };
}

async function buildResolvedAuthAuditPayload(
  record: AuthAuditRecordInput
): Promise<AuthAuditInsertPayload> {
  const authUserId = record.context?.authUserId;
  const platformUserId = authUserId
    ? await findPlatformUserIdByAuthUserId(authUserId)
    : null;

  return buildAuthAuditPayload(record, platformUserId);
}

function createDatabaseAuthAuditWriter(): AuthAuditWriter {
  return {
    async write(record) {
      try {
        const payload = await buildResolvedAuthAuditPayload(record);
        await insertAuditEvent(payload);
      } catch {
        // Audit must not block auth flows; failures are swallowed intentionally.
      }
    },
  };
}

const defaultAuditWriter = createDatabaseAuthAuditWriter();

export async function persistAuthAuditEvent(
  record: AuthAuditRecordInput,
  writer: AuthAuditWriter = defaultAuditWriter
): Promise<void> {
  await writer.write(record);
}

export function recordAuthAuditEvent(
  record: AuthAuditRecordInput,
  writer: AuthAuditWriter = defaultAuditWriter
): void {
  persistAuthAuditEvent(record, writer).catch(() => undefined);
}
