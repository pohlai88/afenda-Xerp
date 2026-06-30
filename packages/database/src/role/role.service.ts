import { and, asc, count, eq, ne } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type {
  AuditActorType,
  RoleScope,
  RoleStatus,
} from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { memberships } from "../schema/membership.schema.js";
import { roles } from "../schema/role.schema.js";
import {
  buildRoleInsertRow,
  buildRoleUpdatePatch,
  type RoleUpdatePatch,
  type RoleWriteInput,
} from "./role.contract.js";

export class RoleHasActiveMembershipsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RoleHasActiveMembershipsError";
  }
}

export interface RoleAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export type InsertRoleInput = RoleWriteInput & {
  readonly audit: RoleAuditContext;
};

export type UpdateRoleInput = RoleUpdatePatch & {
  readonly audit: RoleAuditContext;
};

export interface ArchiveRoleInput {
  readonly audit: RoleAuditContext;
  readonly reason?: string | null;
}

export interface RoleMutationResult {
  readonly id: string;
}

export interface TenantRoleListRow {
  readonly description: string | null;
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly scope: RoleScope;
  readonly status: RoleStatus;
  readonly tenantId: string | null;
}

/** Lists non-archived roles for a tenant authority directory. */
export async function listTenantRoles(
  input: {
    readonly tenantId: string;
  },
  db: AfendaDatabase = getDb()
): Promise<readonly TenantRoleListRow[]> {
  return db
    .select({
      description: roles.description,
      id: roles.id,
      key: roles.key,
      name: roles.name,
      scope: roles.scope,
      status: roles.status,
      tenantId: roles.tenantId,
    })
    .from(roles)
    .where(
      and(eq(roles.tenantId, input.tenantId), ne(roles.status, "archived"))
    )
    .orderBy(asc(roles.name), asc(roles.key));
}

async function recordRoleAuditEvent(
  action: "role.create" | "role.update" | "role.archive",
  tenantId: string | null,
  roleId: string,
  audit: RoleAuditContext,
  metadata: Record<string, string | null>,
  db: AfendaDatabase
): Promise<void> {
  await insertAuditEvent(
    {
      tenantId,
      actorType: audit.actorType,
      actorUserId: audit.actorUserId ?? null,
      module: "platform",
      action,
      targetType: "role",
      targetId: roleId,
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

/**
 * Governed role create path.
 *
 * Role is the authority template — not the grant. Do not insert into `roles`
 * directly from feature modules.
 */
export async function insertRole(
  input: InsertRoleInput,
  db: AfendaDatabase = getDb()
): Promise<RoleMutationResult> {
  const row = buildRoleInsertRow(input);

  const [inserted] = await db
    .insert(roles)
    .values(row)
    .returning({ id: roles.id });

  if (!inserted) {
    throw new Error("Role insert did not return a row id.");
  }

  await recordRoleAuditEvent(
    "role.create",
    row.tenantId,
    inserted.id,
    input.audit,
    {
      key: row.key,
      name: row.name,
      scope: row.scope,
      status: row.status,
    },
    db
  );

  return { id: inserted.id };
}

export async function updateRole(
  roleId: string,
  input: UpdateRoleInput,
  db: AfendaDatabase = getDb()
): Promise<RoleMutationResult> {
  const patch = buildRoleUpdatePatch(input);

  if (Object.keys(patch).length === 0) {
    throw new Error("Role update requires at least one field.");
  }

  const [existing] = await db
    .select({
      id: roles.id,
      tenantId: roles.tenantId,
      status: roles.status,
    })
    .from(roles)
    .where(eq(roles.id, roleId))
    .limit(1);

  if (!existing) {
    throw new Error(`Role "${roleId}" was not found.`);
  }

  const [updated] = await db
    .update(roles)
    .set(patch)
    .where(eq(roles.id, roleId))
    .returning({ id: roles.id });

  if (!updated) {
    throw new Error(`Role "${roleId}" was not found.`);
  }

  await recordRoleAuditEvent(
    "role.update",
    existing.tenantId,
    updated.id,
    input.audit,
    {
      name: patch.name ?? null,
      description: patch.description ?? null,
      status: patch.status ?? null,
    },
    db
  );

  return { id: updated.id };
}

/** Archives a role without hard delete. Normal app code must not delete roles. */
export async function archiveRole(
  roleId: string,
  input: ArchiveRoleInput,
  db: AfendaDatabase = getDb()
): Promise<RoleMutationResult> {
  const [existing] = await db
    .select({
      id: roles.id,
      tenantId: roles.tenantId,
      status: roles.status,
    })
    .from(roles)
    .where(eq(roles.id, roleId))
    .limit(1);

  if (!existing || existing.status === "archived") {
    throw new Error(`Active role "${roleId}" was not found.`);
  }

  const [membershipCount] = await db
    .select({ value: count() })
    .from(memberships)
    .where(eq(memberships.roleId, roleId));

  if ((membershipCount?.value ?? 0) > 0) {
    throw new RoleHasActiveMembershipsError(
      `Role "${roleId}" cannot be archived while memberships reference it. Deactivate memberships first or set status to inactive.`
    );
  }

  const [updated] = await db
    .update(roles)
    .set({ status: "archived" })
    .where(eq(roles.id, roleId))
    .returning({ id: roles.id });

  if (!updated) {
    throw new Error(`Role "${roleId}" was not found.`);
  }

  await recordRoleAuditEvent(
    "role.archive",
    existing.tenantId,
    updated.id,
    input.audit,
    {
      reason: input.reason ?? null,
      status: "archived",
    },
    db
  );

  return { id: updated.id };
}
