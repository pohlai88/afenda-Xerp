import { eq } from "drizzle-orm";

import { insertAuditEvent } from "../audit/audit.writer.js";
import type { AuditActorType } from "../database.types.js";
import type { AfendaDatabase } from "../db.js";
import { getDb } from "../db.js";
import { permissions } from "../schema/permission.schema.js";
import { roles } from "../schema/role.schema.js";
import { rolePermissions } from "../schema/role-permission.schema.js";
import {
  assertRolePermissionGrantBoundaries,
  type RolePermissionGrantPermissionSnapshot,
  type RolePermissionGrantRoleSnapshot,
} from "./role-permission.contract.js";

export interface RolePermissionAuditContext {
  readonly actorType: AuditActorType;
  readonly actorUserId?: string | null;
  readonly correlationId: string;
  readonly ipAddress?: string | null;
  readonly reason?: string | null;
  readonly source?: "app" | "api" | "system";
  readonly userAgent?: string | null;
}

export interface GrantPermissionToRoleInput {
  readonly audit: RolePermissionAuditContext;
  readonly permissionId: string;
  readonly reason?: string | null;
  readonly roleId: string;
  readonly tenantId: string | null;
}

export interface GrantPermissionToRoleResult {
  readonly permissionId: string;
  readonly roleId: string;
}

async function loadRoleForGrant(
  roleId: string,
  db: AfendaDatabase
): Promise<RolePermissionGrantRoleSnapshot | undefined> {
  const [role] = await db
    .select({
      id: roles.id,
      scope: roles.scope,
      status: roles.status,
      tenantId: roles.tenantId,
    })
    .from(roles)
    .where(eq(roles.id, roleId))
    .limit(1);

  return role;
}

async function loadPermissionForGrant(
  permissionId: string,
  db: AfendaDatabase
): Promise<RolePermissionGrantPermissionSnapshot | undefined> {
  const [permission] = await db
    .select({ id: permissions.id })
    .from(permissions)
    .where(eq(permissions.id, permissionId))
    .limit(1);

  return permission;
}

async function recordRolePermissionGrantAuditEvent(
  input: GrantPermissionToRoleInput,
  audit: RolePermissionAuditContext,
  db: AfendaDatabase
): Promise<void> {
  const reason = input.reason ?? audit.reason ?? null;

  await insertAuditEvent(
    {
      tenantId: input.tenantId,
      actorType: audit.actorType,
      actorUserId: audit.actorUserId ?? null,
      module: "platform",
      action: "role.permission.grant",
      targetType: "role_permission",
      targetId: input.roleId,
      result: "success",
      reason,
      source: audit.source ?? "app",
      correlationId: audit.correlationId,
      ipAddress: audit.ipAddress ?? null,
      userAgent: audit.userAgent ?? null,
      metadata: {
        roleId: input.roleId,
        permissionId: input.permissionId,
        reason,
      },
    },
    db
  );
}

/**
 * Governed role-to-permission grant path.
 *
 * Role is the authority template; this binds capabilities to roles.
 * Do not insert into `role_permissions` directly from feature modules.
 */
export async function grantPermissionToRole(
  input: GrantPermissionToRoleInput,
  db: AfendaDatabase = getDb()
): Promise<GrantPermissionToRoleResult> {
  const role = await loadRoleForGrant(input.roleId, db);
  const permission = await loadPermissionForGrant(input.permissionId, db);

  assertRolePermissionGrantBoundaries(
    {
      tenantId: input.tenantId,
      roleId: input.roleId,
      permissionId: input.permissionId,
    },
    role,
    permission
  );

  const [inserted] = await db
    .insert(rolePermissions)
    .values({
      roleId: input.roleId,
      permissionId: input.permissionId,
    })
    .onConflictDoNothing()
    .returning({
      roleId: rolePermissions.roleId,
      permissionId: rolePermissions.permissionId,
    });

  if (inserted) {
    await recordRolePermissionGrantAuditEvent(input, input.audit, db);
  }

  return {
    roleId: input.roleId,
    permissionId: input.permissionId,
  };
}
