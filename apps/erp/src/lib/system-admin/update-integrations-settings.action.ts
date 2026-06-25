"use server";

import {
  executeTenantSettingsSectionUpdate,
  type TenantSettingsSectionUpdateData,
  type TenantSettingsSectionUpdateState,
} from "./execute-tenant-settings-section-update.server";
import { updateIntegrationsSettingsInputSchema } from "./system-admin-settings.schema";

const UPDATE_INTEGRATIONS_SETTINGS_ACTION =
  "system_admin.settings.integrations.update" as const;

export type UpdateIntegrationsSettingsData = TenantSettingsSectionUpdateData;

export type UpdateIntegrationsSettingsActionState =
  TenantSettingsSectionUpdateState;

export async function updateIntegrationsSettingsAction(
  _prevState: UpdateIntegrationsSettingsActionState,
  formData: FormData
): Promise<UpdateIntegrationsSettingsActionState> {
  return executeTenantSettingsSectionUpdate({
    action: UPDATE_INTEGRATIONS_SETTINGS_ACTION,
    schema: updateIntegrationsSettingsInputSchema,
    formData,
    section: "integrations",
    settingsPath: "/system-admin/settings/integrations",
  });
}
