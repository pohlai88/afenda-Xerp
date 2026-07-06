import { SystemAdminListToolbar } from "@/components/system-admin/system-admin-list-toolbar.client";
import { SystemAdminPermissionsComposer } from "@/components/system-admin/system-admin-permissions-composer.client";
import { SystemAdminSectionHeader } from "@/components/system-admin/system-admin-section-header";
import { mapPermissionWireToTableRow } from "@/lib/system-admin/map-permission-wire-to-table-row";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { listSystemAdminPermissions } from "@/server/system-admin/list-system-admin-permissions.server";

export const metadata = {
  title: "Permissions",
};

export default async function SystemAdminPermissionsPage() {
  await loadSystemAdminSectionPage("permissions");
  const { permissions } = await listSystemAdminPermissions();

  return (
    <section className="flex flex-col gap-4">
      <SystemAdminSectionHeader
        description="Global permission catalog backed by internal permissions list."
        title="Permissions"
      />
      <SystemAdminListToolbar
        createLabel="Create permission"
        searchLabel="Search permissions"
      />
      <SystemAdminPermissionsComposer
        data={permissions.map(mapPermissionWireToTableRow)}
      />
    </section>
  );
}
