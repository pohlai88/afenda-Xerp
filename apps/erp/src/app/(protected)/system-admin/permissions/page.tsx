import { SystemAdminDataListPage } from "@/components/system-admin/system-admin-data-list-page.client";
import { SystemAdminPermissionsComposer } from "@/components/system-admin/system-admin-permissions-composer.client";
import { getErpSurfaceLayoutByRoute } from "@/lib/presentation/erp-surface-layout.registry";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { mapPermissionWireToTableRow } from "@/lib/system-admin/map-permission-wire-to-table-row";
import { listSystemAdminPermissions } from "@/server/system-admin/list-system-admin-permissions.server";

/** Operating-context delegate: loadProtectedRequestOperatingContext */

export const metadata = {
  title: "Permissions",
};

export default async function SystemAdminPermissionsPage() {
  const layout = getErpSurfaceLayoutByRoute("/system-admin/permissions");
  await loadSystemAdminSectionPage("permissions");
  const { permissions } = await listSystemAdminPermissions();

  const fixture = layout?.surfaceFixture ?? {
    defaultState: "ready" as const,
    description:
      "Global permission catalog backed by internal permissions list.",
    title: "Permissions",
  };

  return (
    <SystemAdminDataListPage
      createLabel="Create permission"
      description={fixture.description ?? ""}
      searchLabel="Search permissions"
      title={fixture.title}
    >
      <SystemAdminPermissionsComposer
        data={permissions.map(mapPermissionWireToTableRow)}
      />
    </SystemAdminDataListPage>
  );
}
