import { AppShellMain } from "@afenda/appshell";
import { PERMISSION_REGISTRY } from "@afenda/permissions";
import { connection } from "next/server";

import { ErpCardNavGrid } from "@/components/erp-card-nav-grid";
import { SystemAdminReadinessGatePanel } from "@/components/system-admin/system-admin-readiness-gate-panel";
import { SystemAdminDiagnosticsMetadataSurface } from "@/components/system-admin-diagnostics-metadata-surface";
import { resolveMetadataAuthorizationFromOperatingContext } from "@/lib/metadata/resolve-metadata-authorization.server";
import { resolveMetadataUiRenderContextFromOperatingContext } from "@/lib/metadata/resolve-metadata-ui-render-context.server";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { listVisibleSystemAdminSections } from "@/lib/system-admin/list-visible-system-admin-sections.server";
import { resolveAccountingReadinessDiagnosticsOverall } from "@/lib/system-admin/resolve-accounting-readiness-gate-presentation.server";
import { resolveAccountingReadinessGateLiveStatus } from "@/lib/system-admin/resolve-accounting-readiness-gate-status.server";
import { resolveSystemAdminCardNavItems } from "@/lib/system-admin/resolve-system-admin-card-nav";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";

export default async function SystemAdminDiagnosticsPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("diagnostics");
  applySystemAdminSectionAccessNavigation(access);

  const visibleSections = await listVisibleSystemAdminSections();
  const cardNavItems = resolveSystemAdminCardNavItems({
    currentSectionId: "diagnostics",
    visibleSections,
  });
  const liveStatus = resolveAccountingReadinessGateLiveStatus();
  const diagnosticsOverall = resolveAccountingReadinessDiagnosticsOverall({
    snapshot: liveStatus.snapshot,
    requirements: liveStatus.requirements,
  });
  const sectionAccessAllowed = access.kind === "allowed";
  const metadataContext = sectionAccessAllowed
    ? resolveMetadataUiRenderContextFromOperatingContext({
        operatingContext: access.operatingContext,
        authorization: await resolveMetadataAuthorizationFromOperatingContext({
          operatingContext: access.operatingContext,
          boundaryPermissionKey: PERMISSION_REGISTRY.systemAdmin.audit.read,
        }),
        diagnosticsNamespace: "erp.system-admin.diagnostics",
      })
    : null;

  return (
    <AppShellMain
      contentLabel="System admin diagnostics"
      description="Phase 9 accounting readiness gate live status for platform administrators."
      title="Diagnostics"
    >
      {metadataContext ? (
        <SystemAdminDiagnosticsMetadataSurface
          checkedAt={liveStatus.snapshot.checkedAt}
          context={metadataContext}
          diagnosticsOverall={diagnosticsOverall}
          runMode={liveStatus.snapshot.runMode}
          sectionAccessAllowed={sectionAccessAllowed}
        />
      ) : null}
      <SystemAdminReadinessGatePanel
        checkedAt={liveStatus.snapshot.checkedAt}
        diagnosticsOverall={diagnosticsOverall}
        requirements={liveStatus.requirements}
        runMode={liveStatus.snapshot.runMode}
        showRefreshForm={metadataContext === null}
      />
      <ErpCardNavGrid items={cardNavItems} />
    </AppShellMain>
  );
}
