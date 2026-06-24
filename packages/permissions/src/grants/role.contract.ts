import type { PermissionKey, RoleStatus } from "@afenda/database";

import type { RoleScope } from "../scope/role-scope.contract.js";

export type { RoleStatus } from "@afenda/database";
export type { RoleScope } from "../scope/role-scope.contract.js";

/** Normalized role contract — no raw database rows. */
export interface RoleContract {
  readonly description: string | null;
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly scope: RoleScope;
  readonly status: RoleStatus;
  readonly tenantId: string | null;
}

export interface RolePermissionAssignment {
  readonly permissionKey: PermissionKey;
  readonly roleId: string;
}

export function isRoleActive(role: Pick<RoleContract, "status">): boolean {
  return role.status === "active";
}
