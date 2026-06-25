"use server";

import {
  upsertUserPreferencesSection,
  userDisplayPreferencesSchema,
} from "@afenda/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { failServerAction } from "@/lib/server-actions/fail-server-action";
import { parseProtectedActionInput } from "@/lib/server-actions/parse-protected-action-input";
import { recordActionAudit } from "@/lib/server-actions/record-action-audit";
import { resolveActionOperatingContext } from "@/lib/server-actions/resolve-action-operating-context.server";
import {
  type ServerActionResult,
  serverActionSuccess,
} from "@/lib/server-actions/server-action-result";

import { parseFormDataJsonField } from "./parse-user-settings-form-payload";
import {
  USER_SETTINGS_AUDIT_EVENTS,
  USER_SETTINGS_MUTATION_AUDIT_MODULE,
} from "./user-settings-audit.registry";

export const UPDATE_USER_PREFERENCES_SETTINGS_INTENT =
  "update-user-preferences" as const;

const UPDATE_USER_PREFERENCES_SETTINGS_ACTION =
  "user.settings.preferences.update" as const;

const updateUserPreferencesSettingsInputSchema = z.object({
  intent: z.literal(UPDATE_USER_PREFERENCES_SETTINGS_INTENT),
  payload: userDisplayPreferencesSchema,
});

export interface UpdateUserPreferencesSettingsData {
  readonly acknowledged: true;
  readonly userId: string;
}

export type UpdateUserPreferencesSettingsActionState =
  ServerActionResult<UpdateUserPreferencesSettingsData> | null;

function parsePreferencesActionInput(formData: FormData): unknown {
  return {
    intent: formData.get("intent"),
    payload: parseFormDataJsonField(formData, "payload"),
  };
}

export async function updateUserPreferencesSettingsAction(
  _prevState: UpdateUserPreferencesSettingsActionState,
  formData: FormData
): Promise<UpdateUserPreferencesSettingsActionState> {
  const parsed = parseProtectedActionInput(
    updateUserPreferencesSettingsInputSchema,
    parsePreferencesActionInput(formData)
  );
  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_USER_PREFERENCES_SETTINGS_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_USER_PREFERENCES_SETTINGS_ACTION,
      error: contextResult.error,
    });
  }

  const { operatingContext } = contextResult;
  const actorUserId = operatingContext.actor.userId;

  await upsertUserPreferencesSection({
    userId: actorUserId,
    section: "display",
    value: parsed.value.payload,
    audit: {
      actorType: "user",
      actorUserId,
      correlationId: operatingContext.correlationId,
      source: "app",
    },
  });

  revalidatePath("/settings/preferences");

  await recordActionAudit({
    action: USER_SETTINGS_AUDIT_EVENTS.preferencesUpdated,
    actorUserId,
    module: USER_SETTINGS_MUTATION_AUDIT_MODULE,
    result: "success",
    targetId: actorUserId,
    targetType: "user_display_preferences",
  });

  return serverActionSuccess({
    acknowledged: true,
    userId: actorUserId,
  });
}
