import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { users } from "../schema/user.schema.js";
import {
  buildUserInsertRow,
  buildUserUpdatePatch,
  type PlatformUserUpdatePatch,
  type PlatformUserWriteInput,
} from "./user.contract.js";

export interface UserAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertUserInput = PlatformUserWriteInput & {
  readonly audit: UserAuditContext;
};

export type UpdateUserInput = PlatformUserUpdatePatch & {
  readonly audit: UserAuditContext;
};

export interface DeactivateUserInput {
  readonly audit: UserAuditContext;
  readonly reason?: string | null;
}

export interface UserMutationResult {
  readonly id: string;
}

async function recordUserAuditEvent(
  action: "user.create" | "user.update" | "user.deactivate",
  userId: string,
  audit: UserAuditContext,
  metadata: Record<string, string | null>
): Promise<void> {
  await insertAuditEvent({
    actorType: audit.actorType,
    actorUserId: audit.actorUserId ?? null,
    module: "platform",
    action,
    targetType: "user",
    targetId: userId,
    result: "success",
    source: audit.source ?? "app",
    correlationId: audit.correlationId,
    ipAddress: audit.ipAddress ?? null,
    userAgent: audit.userAgent ?? null,
    metadata,
  });
}

/**
 * Governed platform user create path.
 *
 * `users` is the Afenda platform actor — not Better Auth login identity.
 * Do not insert into `users` directly from feature modules.
 */
export async function insertUser(
  input: InsertUserInput,
  db: AfendaDatabase = getDb()
): Promise<UserMutationResult> {
  const row = buildUserInsertRow(input);

  const [inserted] = await db
    .insert(users)
    .values(row)
    .returning({ id: users.id });

  if (!inserted) {
    throw new Error("User insert did not return a row id.");
  }

  await recordUserAuditEvent("user.create", inserted.id, input.audit, {
    email: row.email,
    displayName: row.displayName,
    status: row.status,
  });

  return { id: inserted.id };
}

/** Governed platform user update path. */
export async function updateUser(
  userId: string,
  input: UpdateUserInput,
  db: AfendaDatabase = getDb()
): Promise<UserMutationResult> {
  const patch = buildUserUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("User update requires at least one field.");
  }

  const [updated] = await db
    .update(users)
    .set(patch)
    .where(eq(users.id, userId))
    .returning({ id: users.id });

  if (!updated) {
    throw new Error(`User "${userId}" was not found.`);
  }

  await recordUserAuditEvent("user.update", updated.id, input.audit, {
    email: patch.email ?? null,
    displayName: patch.displayName ?? null,
    status: patch.status ?? null,
  });

  return { id: updated.id };
}

/** Deactivates a platform actor without deleting audit history. */
export async function deactivateUser(
  userId: string,
  input: DeactivateUserInput,
  db: AfendaDatabase = getDb()
): Promise<UserMutationResult> {
  const [existing] = await db
    .select({ id: users.id, status: users.status })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (existing?.status !== "active") {
    throw new Error(`Active user "${userId}" was not found.`);
  }

  const [updated] = await db
    .update(users)
    .set({ status: "deactivated" })
    .where(eq(users.id, userId))
    .returning({ id: users.id });

  if (!updated) {
    throw new Error(`User "${userId}" was not found.`);
  }

  await recordUserAuditEvent("user.deactivate", updated.id, input.audit, {
    reason: input.reason ?? null,
    status: "deactivated",
  });

  return { id: updated.id };
}
