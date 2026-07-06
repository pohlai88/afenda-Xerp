import { SystemAdminDataListPage } from "@/components/system-admin/system-admin-data-list-page.client";
import { SystemAdminRolesComposer } from "@/components/system-admin/system-admin-roles-composer.client";
import { getErpSurfaceLayoutByRoute } from "@/lib/presentation/erp-surface-layout.registry";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { mapRoleWireToTableRow } from "@/lib/system-admin/map-role-wire-to-table-row";
import { listSystemAdminRoles } from "@/server/system-admin/list-system-admin-roles.server";

/** Operating-context delegate: loadProtectedRequestOperatingContext */

export const metadata = {
  title: "Roles",
};

export default async function SystemAdminRolesPage() {
  const layout = getErpSurfaceLayoutByRoute("/system-admin/roles");
  const { operatingContext } = await loadSystemAdminSectionPage("roles");
  const { roles } = await listSystemAdminRoles({
    tenantId: operatingContext.workspace.tenantId,
  });

  const fixture = layout?.surfaceFixture ?? {
    defaultState: "ready" as const,
    description: "Tenant role templates backed by internal roles list.",
    title: "Roles",
  };

  return (
    <SystemAdminDataListPage
      createLabel="Create role"
      description={fixture.description ?? ""}
      searchLabel="Search roles"
      title={fixture.title}
    >
      <SystemAdminRolesComposer data={roles.map(mapRoleWireToTableRow)} />
    </SystemAdminDataListPage>
  );
}
