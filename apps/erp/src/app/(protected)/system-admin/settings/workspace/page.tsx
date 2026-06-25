import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { SystemAdminWorkspaceSettingsPanel } from "@/components/system-admin/system-admin-workspace-settings-panel";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";
import { resolveWorkspaceSettings } from "@/lib/system-admin/resolve-workspace-settings.server";

export default async function SystemAdminSettingsWorkspacePage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("settings");
  applySystemAdminSectionAccessNavigation(access);

  const workspaceName =
    access.kind === "allowed" ? access.operatingContext.tenant.displayName : "";
  const appId =
    access.kind === "allowed"
      ? access.operatingContext.legalEntity.companyId
      : "";

  const initialSettings = await resolveWorkspaceSettings({
    fallbackTimezone: "UTC",
    fallbackWorkspaceName: workspaceName,
  });

  return (
    <AppShellMain
      contentLabel="Workspace settings"
      description="Workspace layout, defaults, and module configuration."
      title="Workspace"
    >
      <SystemAdminWorkspaceSettingsPanel
        appId={appId}
        initialSettings={initialSettings}
        urlPrefix="https://"
      />
    </AppShellMain>
  );
}
