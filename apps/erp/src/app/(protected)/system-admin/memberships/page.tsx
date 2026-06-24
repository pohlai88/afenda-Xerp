import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminMembershipsPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("memberships");
  applySystemAdminSectionAccessNavigation(access);

  return (
    <AppShellMain
      contentLabel="System admin memberships"
      description="Company-scoped membership administration arrives in a future delivery slice."
      title="Memberships"
    >
      <p>
        Membership directory is scaffolded for company-scoped read access.
        Assignment and revocation APIs will connect here after admin API
        contracts land.
      </p>
    </AppShellMain>
  );
}
