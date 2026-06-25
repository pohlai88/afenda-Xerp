"use server";

import {
  executeTenantSettingsSectionUpdate,
  type TenantSettingsSectionUpdateData,
  type TenantSettingsSectionUpdateState,
} from "./execute-tenant-settings-section-update.server";
import { updateNotificationsSettingsInputSchema } from "./system-admin-settings.schema";

const UPDATE_NOTIFICATIONS_SETTINGS_ACTION =
  "system_admin.settings.notifications.update" as const;

export type UpdateNotificationsSettingsData = TenantSettingsSectionUpdateData;

export type UpdateNotificationsSettingsActionState =
  TenantSettingsSectionUpdateState;

export async function updateNotificationsSettingsAction(
  _prevState: UpdateNotificationsSettingsActionState,
  formData: FormData
): Promise<UpdateNotificationsSettingsActionState> {
  return executeTenantSettingsSectionUpdate({
    action: UPDATE_NOTIFICATIONS_SETTINGS_ACTION,
    schema: updateNotificationsSettingsInputSchema,
    formData,
    section: "notifications",
    settingsPath: "/system-admin/settings/notifications",
  });
}
