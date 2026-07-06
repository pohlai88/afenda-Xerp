import { ErpPageSurfaceLayout } from "@/components/presentation/erp-page-surface-layout.client";
import { SystemAdminAuditComposer } from "@/components/system-admin/system-admin-audit-composer.client";
import { getErpSurfaceLayoutByRoute } from "@/lib/presentation/erp-surface-layout.registry";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { mapAuditEventWireToTableRow } from "@/lib/system-admin/map-audit-event-wire-to-table-row";
import { listSystemAdminAuditEvents } from "@/server/system-admin/list-system-admin-audit-events.server";

/** Operating-context delegate: loadProtectedRequestOperatingContext */

export const metadata = {
  title: "Audit",
};

export default async function SystemAdminAuditPage() {
  const layout = getErpSurfaceLayoutByRoute("/system-admin/audit");
  const { operatingContext } = await loadSystemAdminSectionPage("audit");
  const result = await listSystemAdminAuditEvents({
    limit: 50,
    tenantId: operatingContext.workspace.tenantId,
  });

  const fixture = layout?.surfaceFixture ?? {
    defaultState: "ready" as const,
    description:
      "Recent system-administration audit events for the active tenant.",
    title: "Audit",
  };

  return (
    <ErpPageSurfaceLayout
      description={fixture.description}
      state={fixture.defaultState}
      title={fixture.title}
    >
      <SystemAdminAuditComposer
        data={result.events.map(mapAuditEventWireToTableRow)}
      />
    </ErpPageSurfaceLayout>
  );
}
