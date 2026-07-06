export type SystemAdminRoleTableStatus = "active" | "inactive" | "pending";

export interface SystemAdminRoleTableRow {
  readonly id: string;
  readonly key: string;
  readonly name: string;
  readonly scope: string;
  readonly status: SystemAdminRoleTableStatus;
}
