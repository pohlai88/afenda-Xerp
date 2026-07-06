import { SystemAdminDataListPage } from "@/components/system-admin/system-admin-data-list-page.client";
import { SystemAdminMembershipsComposer } from "@/components/system-admin/system-admin-memberships-composer.client";
import { getErpSurfaceLayoutByRoute } from "@/lib/presentation/erp-surface-layout.registry";
import { loadSystemAdminSectionPage } from "@/lib/system-admin/load-system-admin-section-page.server";
import { mapMembershipWireToTableRow } from "@/lib/system-admin/map-membership-wire-to-table-row";
import { listSystemAdminMemberships } from "@/server/system-admin/list-system-admin-memberships.server";

/** Operating-context delegate: loadProtectedRequestOperatingContext */

export const metadata = {
  title: "Memberships",
};

export default async function SystemAdminMembershipsPage() {
  const layout = getErpSurfaceLayoutByRoute("/system-admin/memberships");
  const { operatingContext } = await loadSystemAdminSectionPage("memberships");
  const { memberships } = await listSystemAdminMemberships({
    companyId: operatingContext.workspace.companyId,
    tenantId: operatingContext.workspace.tenantId,
  });

  const fixture = layout?.surfaceFixture ?? {
    defaultState: "ready" as const,
    description:
      "Company-scoped memberships with role assignments for the active legal entity.",
    title: "Memberships",
  };

  return (
    <SystemAdminDataListPage
      createLabel="Create membership"
      description={fixture.description ?? ""}
      searchLabel="Search memberships"
      title={fixture.title}
    >
      <SystemAdminMembershipsComposer
        data={memberships.map(mapMembershipWireToTableRow)}
      />
    </SystemAdminDataListPage>
  );
}
