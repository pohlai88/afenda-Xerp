/**
 * Role-permission grant governance — types and pure boundary checks (no I/O).
 *
 * Table: `schema/role-permission.schema.ts`
 * Writes: `role-permission.service.ts`
 */
import type { RoleScope, RoleStatus } from "../database.types.js";

export class RolePermissionGrantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RolePermissionGrantError";
  }
}

export class RolePermissionTenantMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RolePermissionTenantMismatchError";
  }
}

export interface RolePermissionGrantRoleSnapshot {
  readonly id: string;
  readonly scope: RoleScope;
  readonly status: RoleStatus;
  readonly tenantId: string | null;
}

export interface RolePermissionGrantPermissionSnapshot {
  readonly id: string;
}

export interface RolePermissionGrantBoundaryInput {
  readonly permissionId: string;
  readonly roleId: string;
  readonly tenantId: string | null;
}

/**
 * Validates role and permission existence plus tenant alignment before grant.
 */
export function assertRolePermissionGrantBoundaries(
  input: RolePermissionGrantBoundaryInput,
  role: RolePermissionGrantRoleSnapshot | undefined,
  permission: RolePermissionGrantPermissionSnapshot | undefined
): void {
  if (!role) {
    throw new RolePermissionGrantError(`Role "${input.roleId}" was not found.`);
  }

  if (role.status !== "active") {
    throw new RolePermissionGrantError(
      "Only active roles can receive permission grants."
    );
  }

  if (!permission) {
    throw new RolePermissionGrantError(
      `Permission "${input.permissionId}" was not found.`
    );
  }

  if (role.scope === "platform") {
    if (input.tenantId !== null) {
      throw new RolePermissionTenantMismatchError(
        "Platform role grants require null tenantId."
      );
    }

    if (role.tenantId !== null) {
      throw new RolePermissionTenantMismatchError(
        "Platform role tenantId must remain null."
      );
    }

    return;
  }

  if (!input.tenantId) {
    throw new RolePermissionTenantMismatchError(
      "Tenant-scoped role grants require tenantId."
    );
  }

  if (role.tenantId !== input.tenantId) {
    throw new RolePermissionTenantMismatchError(
      "Role tenant must match grant tenantId."
    );
  }
}
