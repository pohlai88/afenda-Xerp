import { ErpPageSurfaceLayout } from "@/components/presentation/erp-page-surface-layout.client";
import { SystemAdminSettingsPanel } from "@/components/system-admin/system-admin-settings-panel.client";
import { getErpSurfaceLayoutByRoute } from "@/lib/presentation/erp-surface-layout.registry";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { listSystemAdminSettings } from "@/server/system-admin/list-system-admin-settings.server";

/** Operating-context delegate: loadProtectedRequestOperatingContext */

export const metadata = {
  title: "Settings",
};

export default async function SystemAdminSettingsPage() {
  const layout = getErpSurfaceLayoutByRoute("/system-admin/settings");
  await loadSystemAdminSectionPage("settings");
  const { modules } = await listSystemAdminSettings();

  const fixture = layout?.surfaceFixture ?? {
    defaultState: "ready" as const,
    description:
      "Module domain summaries derived from the governed permission catalog.",
    title: "Settings",
  };

  return (
    <ErpPageSurfaceLayout
      description={fixture.description}
      state={fixture.defaultState}
      title={fixture.title}
    >
      <SystemAdminSettingsPanel modules={modules} />
    </ErpPageSurfaceLayout>
  );
}
