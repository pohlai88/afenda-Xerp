import {
  SystemAdminListToolbarBlock as SystemAdminListToolbar,
  SystemAdminPermissionsTableBlock as SystemAdminPermissionsTable,
  SystemAdminSectionHeaderBlock as SystemAdminSectionHeader,
} from "@afenda/shadcn-studio";
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
        description="Global permission catalog backed by internal v1 permissions list."
        title="Permissions"
      />
      <SystemAdminListToolbar
        createLabel="Create permission"
        searchLabel="Search permissions"
      />
      <SystemAdminPermissionsTable permissions={permissions} />
    </section>
  );
}
