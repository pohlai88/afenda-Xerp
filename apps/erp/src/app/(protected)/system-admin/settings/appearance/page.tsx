import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { resolveAppearanceSettings } from "@/lib/system-admin/resolve-appearance-settings.server";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";
import { SystemAdminAppearanceSettingsPanel } from "@/lib/system-admin/system-admin-appearance-settings-panel";
import { resolveAppearanceLogoPreviewUrl } from "@/lib/system-admin/tenant-brand-logo-storage.server";

export default async function SystemAdminSettingsAppearancePage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("settings");
  applySystemAdminSectionAccessNavigation(access);

  const fallbackProductLabel =
    access.kind === "allowed" ? access.operatingContext.tenant.displayName : "";

  const initialSettings = await resolveAppearanceSettings({
    fallbackProductLabel,
  });

  const initialLogoPreviewUrl =
    access.kind === "allowed" && initialSettings.logoObjectId
      ? await resolveAppearanceLogoPreviewUrl({
          logoObjectId: initialSettings.logoObjectId,
          tenantId: access.operatingContext.tenant.tenantId,
        })
      : null;

  return (
    <AppShellMain
      contentLabel="Appearance settings"
      description="Auth shell branding for tenant-hosted sign-in routes."
      title="Appearance"
    >
      <SystemAdminAppearanceSettingsPanel
        initialLogoPreviewUrl={initialLogoPreviewUrl}
        initialSettings={initialSettings}
      />
    </AppShellMain>
  );
}
