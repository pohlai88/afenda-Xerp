import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminRolesPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("roles");
  applySystemAdminSectionAccessNavigation(access);

  return (
    <AppShellMain
      contentLabel="System admin roles"
      description="Role assignment and company-scoped role administration arrive in a future delivery slice."
      title="Roles"
    >
      <p>
        Role management is scaffolded. Role assignment mutation APIs will
        connect here after admin API contracts land.
      </p>
    </AppShellMain>
  );
}
