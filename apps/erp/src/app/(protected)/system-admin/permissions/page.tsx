import { SystemAdminPermissionsTable } from "@/components/system-admin/system-admin-permissions-table";
import { SystemAdminSectionHeader } from "@/components/system-admin/system-admin-section-header";
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
      <SystemAdminPermissionsTable permissions={permissions} />
    </section>
  );
}
