import {
  SystemAdminListToolbarBlock as SystemAdminListToolbar,
  SystemAdminMembershipsTableBlock as SystemAdminMembershipsTable,
  SystemAdminSectionHeaderBlock as SystemAdminSectionHeader,
} from "@afenda/shadcn-studio";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { listSystemAdminMemberships } from "@/server/system-admin/list-system-admin-memberships.server";

export const metadata = {
  title: "Memberships",
};

export default async function SystemAdminMembershipsPage() {
  const { operatingContext } = await loadSystemAdminSectionPage("memberships");
  const { memberships } = await listSystemAdminMemberships({
    companyId: operatingContext.workspace.companyId,
    tenantId: operatingContext.workspace.tenantId,
  });

  return (
    <section className="flex flex-col gap-4">
      <SystemAdminSectionHeader
        description="Company-scoped memberships with role assignments for the active legal entity."
        title="Memberships"
      />
      <SystemAdminListToolbar
        createLabel="Create membership"
        searchLabel="Search memberships"
      />
      <SystemAdminMembershipsTable memberships={memberships} />
    </section>
  );
}
