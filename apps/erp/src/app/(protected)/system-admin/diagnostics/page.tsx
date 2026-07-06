import { ErpPageSurfaceLayout } from "@/components/presentation/erp-page-surface-layout.client";
import { SystemAdminDiagnosticsPanel } from "@/components/system-admin/system-admin-diagnostics-panel.client";
import { getErpSurfaceLayoutByRoute } from "@/lib/presentation/erp-surface-layout.registry";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { buildSystemAdminDiagnosticsSnapshot } from "@/server/system-admin/build-system-admin-diagnostics-snapshot.server";

/** Operating-context delegate: loadProtectedRequestOperatingContext */

export const metadata = {
  title: "Diagnostics",
};

export default async function SystemAdminDiagnosticsPage() {
  const layout = getErpSurfaceLayoutByRoute("/system-admin/diagnostics");
  const { operatingContext } = await loadSystemAdminSectionPage("diagnostics");
  const snapshot = await buildSystemAdminDiagnosticsSnapshot({
    operatingContext,
  });

  const fixture = layout?.surfaceFixture ?? {
    defaultState: "ready" as const,
    description:
      "Operator diagnostics for operating scope, API contracts, and spine delegates.",
    title: "Diagnostics",
  };

  return (
    <ErpPageSurfaceLayout
      description={fixture.description}
      state={fixture.defaultState}
      title={fixture.title}
    >
      <SystemAdminDiagnosticsPanel snapshot={snapshot} />
    </ErpPageSurfaceLayout>
  );
}
