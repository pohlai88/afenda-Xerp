import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

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
  const auditEvents = await listRecentAuditEvents({ tenantId });

  return (
    <AppShellMain
      contentLabel="System admin audit viewer"
      description="Tenant-scoped read-only audit events. Search and pagination arrive in a future delivery slice."
      title="Audit"
    >
      {auditEvents.length === 0 ? (
        <p>No audit events recorded for this tenant yet.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            Recent audit events for the current tenant
          </caption>
          <thead>
            <tr>
              <th className="border-b px-3 py-2 text-left" scope="col">
                Time
              </th>
              <th className="border-b px-3 py-2 text-left" scope="col">
                Module
              </th>
              <th className="border-b px-3 py-2 text-left" scope="col">
                Action
              </th>
              <th className="border-b px-3 py-2 text-left" scope="col">
                Target
              </th>
              <th className="border-b px-3 py-2 text-left" scope="col">
                Result
              </th>
              <th className="border-b px-3 py-2 text-left" scope="col">
                Correlation
              </th>
            </tr>
          </thead>
          <tbody>
            {auditEvents.map((event) => (
              <tr key={event.id}>
                <td className="border-b px-3 py-2">
                  <time dateTime={event.createdAt}>{event.createdAt}</time>
                </td>
                <td className="border-b px-3 py-2">{event.module}</td>
                <td className="border-b px-3 py-2">{event.action}</td>
                <td className="border-b px-3 py-2">
                  {event.targetType}
                  {event.targetId ? ` / ${event.targetId}` : ""}
                </td>
                <td className="border-b px-3 py-2">{event.result}</td>
                <td className="border-b px-3 py-2">
                  <code>{event.correlationId}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </AppShellMain>
  );
}
