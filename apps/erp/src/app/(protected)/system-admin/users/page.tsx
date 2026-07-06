import { SystemAdminListToolbar } from "@/components/system-admin/system-admin-list-toolbar.client";
import { SystemAdminSectionHeader } from "@/components/system-admin/system-admin-section-header";
import { SystemAdminUsersComposer } from "@/components/system-admin/system-admin-users-composer.client";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { mapUserWireToDatatableRow } from "@/lib/system-admin/map-user-wire-to-datatable-row";
import { listSystemAdminUsers } from "@/server/system-admin/list-system-admin-users.server";

export const metadata = {
  title: "Users",
};

export default async function SystemAdminUsersPage() {
  const { operatingContext } = await loadSystemAdminSectionPage("users");
  const { users } = await listSystemAdminUsers({
    companyId: operatingContext.workspace.companyId,
    tenantId: operatingContext.workspace.tenantId,
  });

  return (
    <section className="flex flex-col gap-4">
      <SystemAdminSectionHeader
        description="System administration user directory backed by internal users list."
        title="Users"
      />
      <SystemAdminListToolbar
        createLabel="Invite user"
        searchLabel="Search users"
      />
      <SystemAdminUsersComposer
        data={users.map((user) => mapUserWireToDatatableRow(user))}
      />
    </section>
  );
}
