import { SystemAdminAuditEventsPanel } from "@/components/system-admin/system-admin-audit-events-panel.client";
import { SystemAdminSectionHeader } from "@/components/system-admin/system-admin-section-header";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { listSystemAdminAuditEvents } from "@/server/system-admin/list-system-admin-audit-events.server";

export const metadata = {
  title: "Audit",
};

export default async function SystemAdminAuditPage() {
  const { operatingContext } = await loadSystemAdminSectionPage("audit");
  const result = await listSystemAdminAuditEvents({
    limit: 50,
    tenantId: operatingContext.workspace.tenantId,
  });

  return (
    <section className="flex flex-col gap-4">
      <SystemAdminSectionHeader
        description="Recent system-administration audit events for the active tenant."
        title="Audit"
      />
      <SystemAdminAuditEventsPanel events={result.events} />
    </section>
  );
}
