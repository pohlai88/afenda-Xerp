import { SystemAdminDataListPage } from "@/components/system-admin/system-admin-data-list-page.client";
import { SystemAdminUsersComposer } from "@/components/system-admin/system-admin-users-composer.client";
import { getErpSurfaceLayoutByRoute } from "@/lib/presentation/erp-surface-layout.registry";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { mapUserWireToDatatableRow } from "@/lib/system-admin/map-user-wire-to-datatable-row";
import { listSystemAdminUsers } from "@/server/system-admin/list-system-admin-users.server";

/** Operating-context delegate: loadProtectedRequestOperatingContext */

export const metadata = {
  title: "Users",
};

export default async function SystemAdminUsersPage() {
  const layout = getErpSurfaceLayoutByRoute("/system-admin/users");
  const { operatingContext } = await loadSystemAdminSectionPage("users");
  const { users } = await listSystemAdminUsers({
    companyId: operatingContext.workspace.companyId,
    tenantId: operatingContext.workspace.tenantId,
  });

  const fixture = layout?.surfaceFixture ?? {
    defaultState: "ready" as const,
    description:
      "System administration user directory backed by internal users list.",
    title: "Users",
  };

  return (
    <SystemAdminDataListPage
      createLabel="Invite user"
      description={fixture.description ?? ""}
      searchLabel="Search users"
      title={fixture.title}
    >
      <SystemAdminUsersComposer
        data={users.map((user) => mapUserWireToDatatableRow(user))}
      />
    </SystemAdminDataListPage>
  );
}
