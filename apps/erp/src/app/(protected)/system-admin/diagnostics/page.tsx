import {
  SystemAdminDiagnosticsPanelBlock as SystemAdminDiagnosticsPanel,
  SystemAdminSectionHeaderBlock as SystemAdminSectionHeader,
} from "@afenda/shadcn-studio";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { buildSystemAdminDiagnosticsSnapshot } from "@/server/system-admin/build-system-admin-diagnostics-snapshot.server";

export const metadata = {
  title: "Diagnostics",
};

export default async function SystemAdminDiagnosticsPage() {
  const { operatingContext } = await loadSystemAdminSectionPage("diagnostics");
  const snapshot = await buildSystemAdminDiagnosticsSnapshot({
    operatingContext,
  });

  return (
    <section className="flex flex-col gap-4">
      <SystemAdminSectionHeader
        description="Operator diagnostics for operating scope, API contracts, and spine delegates."
        title="Diagnostics"
      />
      <SystemAdminDiagnosticsPanel snapshot={snapshot} />
    </section>
  );
}
