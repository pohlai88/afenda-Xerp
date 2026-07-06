import { SystemAdminListToolbar } from "@/components/system-admin/system-admin-list-toolbar.client";
import { SystemAdminRolesComposer } from "@/components/system-admin/system-admin-roles-composer.client";
import { SystemAdminSectionHeader } from "@/components/system-admin/system-admin-section-header";
import { mapRoleWireToTableRow } from "@/lib/system-admin/map-role-wire-to-table-row";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { listSystemAdminRoles } from "@/server/system-admin/list-system-admin-roles.server";

export const metadata = {
  title: "Roles",
};

export default async function SystemAdminRolesPage() {
  const { operatingContext } = await loadSystemAdminSectionPage("roles");
  const { roles } = await listSystemAdminRoles({
    tenantId: operatingContext.workspace.tenantId,
  });

  return (
    <section className="flex flex-col gap-4">
      <SystemAdminSectionHeader
        description="Tenant role templates backed by internal roles list."
        title="Roles"
      />
      <SystemAdminListToolbar
        createLabel="Create role"
        searchLabel="Search roles"
      />
      <SystemAdminRolesComposer data={roles.map(mapRoleWireToTableRow)} />
    </section>
  );
}
