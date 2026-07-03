import {
  SystemAdminListToolbarBlock as SystemAdminListToolbar,
  SystemAdminRolesTableBlock as SystemAdminRolesTable,
  SystemAdminSectionHeaderBlock as SystemAdminSectionHeader,
} from "@afenda/shadcn-studio";
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
      <SystemAdminListToolbar
        createLabel="Create role"
        searchLabel="Search roles"
      />
      <SystemAdminRolesTable roles={roles} />
    </section>
  );
}
