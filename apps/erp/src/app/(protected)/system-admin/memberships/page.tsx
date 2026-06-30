import { SystemAdminMembershipsTable } from "@/components/system-admin/system-admin-memberships-table";
import { SystemAdminSectionHeader } from "@/components/system-admin/system-admin-section-header";
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
      <SystemAdminMembershipsTable memberships={memberships} />
    </section>
  );
}
