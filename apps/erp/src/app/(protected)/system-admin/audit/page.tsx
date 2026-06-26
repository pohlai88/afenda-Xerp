import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";
import { SystemAdminAuditTable } from "@/components/system-admin/system-admin-audit-table";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { listRecentAuditEvents } from "@/lib/system-admin/list-recent-audit-events.server";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminAuditPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("audit");
  applySystemAdminSectionAccessNavigation(access);

  const tenantId = access.operatingContext.permissionScope.tenantId;
  const { events: auditEvents } = await listRecentAuditEvents({ tenantId });

  return (
    <AppShellMain
      contentLabel="System admin audit viewer"
      description="Tenant-scoped read-only audit events. Search and pagination arrive in a future delivery slice."
      title="Audit"
    >
      <SystemAdminAuditTable rows={auditEvents} />
    </AppShellMain>
  );
}
