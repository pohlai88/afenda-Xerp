/**
 * Permission catalog write path — global capability registry (no I/O in contract).
 *
 * Contract: `permission.contract.ts`
 * Table: `schema/permission.schema.ts`
 */
import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { permissions } from "../schema/permission.schema.js";
import {
  buildPermissionInsertRow,
  buildPermissionUpdatePatch,
  type PermissionCatalogWriteInput,
  type PermissionUpdatePatch,
} from "./permission.contract.js";

export interface PermissionAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertPermissionInput = PermissionCatalogWriteInput & {
  readonly audit: PermissionAuditContext;
};

export type UpdatePermissionInput = PermissionUpdatePatch & {
  readonly audit: PermissionAuditContext;
};

export interface PermissionMutationResult {
  readonly id: string;
}

async function recordPermissionAuditEvent(
  action: "permission.create" | "permission.update",
  permissionId: string,
  audit: PermissionAuditContext,
  metadata: Record<string, string | null>,
  db: AfendaDatabase
): Promise<void> {
  await insertAuditEvent(
    {
      actorType: audit.actorType,
      actorUserId: audit.actorUserId ?? null,
      module: "platform",
      action,
      targetType: "permission",
      targetId: permissionId,
      result: "success",
      source: audit.source ?? "app",
      correlationId: audit.correlationId,
      ipAddress: audit.ipAddress ?? null,
      userAgent: audit.userAgent ?? null,
      metadata,
    },
    db
  );
}

/** Governed permission catalog create path. Do not insert into `permissions` directly. */
export async function insertPermission(
  input: InsertPermissionInput,
  db: AfendaDatabase = getDb()
): Promise<PermissionMutationResult> {
  const row = buildPermissionInsertRow(input);

  const [inserted] = await db
    .insert(permissions)
    .values(row)
    .returning({ id: permissions.id });

  if (!inserted) {
    throw new Error("Permission insert did not return a row id.");
  }

  await recordPermissionAuditEvent(
    "permission.create",
    inserted.id,
    input.audit,
    {
      key: row.key,
      name: row.name,
      domain: row.domain,
      action: row.action,
    },
    db
  );

  return { id: inserted.id };
}

export async function updatePermission(
  permissionId: string,
  input: UpdatePermissionInput,
  db: AfendaDatabase = getDb()
): Promise<PermissionMutationResult> {
  const patch = buildPermissionUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Permission update requires at least one field.");
  }

  const [updated] = await db
    .update(permissions)
    .set(patch)
    .where(eq(permissions.id, permissionId))
    .returning({ id: permissions.id });

  if (!updated) {
    throw new Error(`Permission "${permissionId}" was not found.`);
  }

  await recordPermissionAuditEvent(
    "permission.update",
    updated.id,
    input.audit,
    {
      name: patch.name ?? null,
      description: patch.description ?? null,
    },
    db
  );

  return { id: updated.id };
}
