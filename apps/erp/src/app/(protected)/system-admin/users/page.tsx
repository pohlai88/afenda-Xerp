import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminUsersPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("users");
  applySystemAdminSectionAccessNavigation(access);

  return (
    <AppShellMain
      contentLabel="System admin users"
      description="User directory and invite flows arrive in a future delivery slice."
      title="Users"
    >
      <p>
        System Admin user management is scaffolded. Invite and membership
        mutation APIs will connect here after admin API contracts land.
      </p>
    </AppShellMain>
  );
}
