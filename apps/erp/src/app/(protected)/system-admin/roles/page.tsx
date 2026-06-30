import { SystemAdminRolesTable } from "@/components/system-admin/system-admin-roles-table";
import { SystemAdminSectionHeader } from "@/components/system-admin/system-admin-section-header";
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
        description="Tenant role templates backed by internal v1 roles list."
        title="Roles"
      />
      <SystemAdminRolesTable roles={roles} />
    </section>
  );
}
