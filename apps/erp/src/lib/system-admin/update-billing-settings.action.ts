"use server";

import {
  executeTenantSettingsSectionUpdate,
  type TenantSettingsSectionUpdateData,
  type TenantSettingsSectionUpdateState,
} from "./execute-tenant-settings-section-update.server";
import { updateBillingSettingsInputSchema } from "./system-admin-settings.schema";

const UPDATE_BILLING_SETTINGS_ACTION =
  "system_admin.settings.billing.update" as const;

export type UpdateBillingSettingsData = TenantSettingsSectionUpdateData;

export type UpdateBillingSettingsActionState = TenantSettingsSectionUpdateState;

export async function updateBillingSettingsAction(
  _prevState: UpdateBillingSettingsActionState,
  formData: FormData
): Promise<UpdateBillingSettingsActionState> {
  return executeTenantSettingsSectionUpdate({
    action: UPDATE_BILLING_SETTINGS_ACTION,
    schema: updateBillingSettingsInputSchema,
    formData,
    section: "billing",
    settingsPath: "/system-admin/settings/billing",
  });
}
