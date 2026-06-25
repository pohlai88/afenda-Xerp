"use server";

import {
  executeTenantSettingsSectionUpdate,
  type TenantSettingsSectionUpdateData,
  type TenantSettingsSectionUpdateState,
} from "./execute-tenant-settings-section-update.server";
import { updateWorkspaceSettingsInputSchema } from "./system-admin-settings.schema";

const UPDATE_WORKSPACE_SETTINGS_ACTION =
  "system_admin.settings.workspace.update" as const;

export type UpdateWorkspaceSettingsData = TenantSettingsSectionUpdateData;

export type UpdateWorkspaceSettingsActionState =
  TenantSettingsSectionUpdateState;

export async function updateWorkspaceSettingsAction(
  _prevState: UpdateWorkspaceSettingsActionState,
  formData: FormData
): Promise<UpdateWorkspaceSettingsActionState> {
  return executeTenantSettingsSectionUpdate({
    action: UPDATE_WORKSPACE_SETTINGS_ACTION,
    schema: updateWorkspaceSettingsInputSchema,
    formData,
    section: "workspace",
    settingsPath: "/system-admin/settings/workspace",
  });
}
