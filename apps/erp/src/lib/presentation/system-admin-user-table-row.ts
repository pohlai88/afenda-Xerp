export type SystemAdminUserTableRole =
  | "admin"
  | "author"
  | "editor"
  | "maintainer"
  | "subscriber";

export type SystemAdminUserTableStatus = "active" | "inactive" | "pending";

/**
 * ERP-owned row shape for system-admin user tables (B-05 composer pilot).
 * B-07 maps API/wire data into this type when replacing v1 DatatableUserBlock.
 */
export interface SystemAdminUserTableRow {
  readonly email: string;
  readonly id: string;
  readonly role: SystemAdminUserTableRole;
  readonly status: SystemAdminUserTableStatus;
  readonly user: string;
}
