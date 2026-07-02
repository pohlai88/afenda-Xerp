import { adminUsersFixtures } from "./fixtures/admin-users.fixtures";

export interface AdminUsersPageModel {
  readonly page: typeof adminUsersFixtures;
}

export function loadAdminUsersPage(): AdminUsersPageModel {
  return {
    page: adminUsersFixtures,
  };
}
