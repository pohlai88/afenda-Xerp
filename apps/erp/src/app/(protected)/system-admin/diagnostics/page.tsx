import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { ErpCardNavGrid } from "@/components/erp-card-nav-grid";
import { SystemAdminReadinessGatePanel } from "@/components/system-admin/system-admin-readiness-gate-panel";
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

  return (
    <AppShellMain
      contentLabel="System admin diagnostics"
      description="Phase 9 accounting readiness gate live status for platform administrators."
      title="Diagnostics"
    >
      <SystemAdminReadinessGatePanel
        checkedAt={liveStatus.snapshot.checkedAt}
        diagnosticsOverall={diagnosticsOverall}
        requirements={liveStatus.requirements}
        runMode={liveStatus.snapshot.runMode}
      />
      <ErpCardNavGrid items={cardNavItems} />
    </AppShellMain>
  );
}
