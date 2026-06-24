"use server";

import { AppErrors } from "@afenda/kernel";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import type { ServerActionResult } from "@/lib/server-actions/server-action-result";

import { SYSTEM_ADMIN_SETTINGS_SCAFFOLD_FAILURE_MESSAGE } from "./system-admin-settings.copy.contract";
import { updateSystemAdminSettingsInputSchema } from "./system-admin-settings.schema";

const UPDATE_SYSTEM_ADMIN_SETTINGS_ACTION =
  "system_admin.settings.update" as const;

export interface UpdateSystemAdminSettingsData {
  readonly acknowledged: true;
}

export type UpdateSystemAdminSettingsActionState =
  ServerActionResult<UpdateSystemAdminSettingsData> | null;

function parseSettingsActionInput(formData: FormData): unknown {
  return {
    intent: formData.get("intent"),
  };
}

export async function updateSystemAdminSettingsAction(
  _prevState: UpdateSystemAdminSettingsActionState,
  formData: FormData
): Promise<UpdateSystemAdminSettingsActionState> {
  const parsed = parseProtectedActionInput(
    updateSystemAdminSettingsInputSchema,
    parseSettingsActionInput(formData)
  );
  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_SYSTEM_ADMIN_SETTINGS_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_SYSTEM_ADMIN_SETTINGS_ACTION,
      error: contextResult.error,
    });
  }

  const actorUserId = contextResult.session.user.userId?.trim();

  return failServerAction({
    action: UPDATE_SYSTEM_ADMIN_SETTINGS_ACTION,
    error: AppErrors.forbidden(SYSTEM_ADMIN_SETTINGS_SCAFFOLD_FAILURE_MESSAGE),
    ...(actorUserId && actorUserId.length > 0 ? { userId: actorUserId } : {}),
  });
}
