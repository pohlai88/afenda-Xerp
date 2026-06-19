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

export type RoleScope = "platform" | "tenant" | "company" | "organization";

export type RoleStatus = "active" | "archived" | "inactive";

export function isRoleActive(role: Pick<RoleContract, "status">): boolean {
  return role.status === "active";
}
