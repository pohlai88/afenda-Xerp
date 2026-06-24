import { AppShellMain } from "@afenda/appshell";
import { connection } from "next/server";

import { ErpCardNavGrid } from "@/components/erp-card-nav-grid";
import { SystemAdminSettingsForm } from "@/components/system-admin/system-admin-settings-form";
import { requiresProtectedLayoutConnection } from "@/lib/security/csp-strategy";
import { applySystemAdminSectionAccessNavigation } from "@/lib/system-admin/apply-system-admin-section-access-navigation";
import { listVisibleSystemAdminSections } from "@/lib/system-admin/list-visible-system-admin-sections.server";
import { resolveSystemAdminCardNavItems } from "@/lib/system-admin/resolve-system-admin-card-nav";
import { resolveSystemAdminSectionAccess } from "@/lib/system-admin/resolve-system-admin-section-access.server";
import { resolveSystemAdminSettingsFormValues } from "@/lib/system-admin/resolve-system-admin-settings-form-values";

export default async function SystemAdminSettingsPage() {
  if (requiresProtectedLayoutConnection()) {
    await connection();
  }

  const access = await resolveSystemAdminSectionAccess("settings");
  applySystemAdminSectionAccessNavigation(access);

  const { operatingContext } = access;
  const visibleSections = await listVisibleSystemAdminSections();
  const cardNavItems = resolveSystemAdminCardNavItems({
    currentSectionId: "settings",
    visibleSections,
  });
  const formValues = resolveSystemAdminSettingsFormValues(operatingContext);

  return (
    <AppShellMain
      contentLabel="System admin settings"
      description="Read-only organization and platform configuration scaffold. Mutations arrive in a future delivery slice."
      title="Settings"
    >
      {/*
        No accounting settings are exposed on this scaffold until Phase 9 gate passes.
      */}
      <SystemAdminSettingsForm formValues={formValues} />
      <ErpCardNavGrid items={cardNavItems} />
    </AppShellMain>
  );
}
