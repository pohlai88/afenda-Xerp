import type {
  SystemAdminUserTableRole,
  SystemAdminUserTableStatus,
} from "./system-admin-user-table-row";

/**
 * ERP-owned row shape for system-admin membership tables (B-07 composer).
 */
export interface SystemAdminMembershipTableRow {
  readonly email: string;
  readonly id: string;
  readonly role: SystemAdminUserTableRole;
  readonly status: SystemAdminUserTableStatus;
  readonly user: string;
}
