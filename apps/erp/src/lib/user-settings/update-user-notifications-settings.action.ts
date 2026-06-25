"use server";

import {
  upsertUserPreferencesSection,
  userNotificationsPreferencesSchema,
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

import {
  USER_SETTINGS_AUDIT_EVENTS,
  USER_SETTINGS_MUTATION_AUDIT_MODULE,
} from "./user-settings-audit.registry";

export const UPDATE_USER_NOTIFICATIONS_SETTINGS_INTENT =
  "update-user-notifications" as const;

const UPDATE_USER_NOTIFICATIONS_SETTINGS_ACTION =
  "user.settings.notifications.update" as const;

const updateUserNotificationsSettingsInputSchema = z.object({
  intent: z.literal(UPDATE_USER_NOTIFICATIONS_SETTINGS_INTENT),
  payload: userNotificationsPreferencesSchema,
});

export interface UpdateUserNotificationsSettingsData {
  readonly acknowledged: true;
  readonly userId: string;
}

export type UpdateUserNotificationsSettingsActionState =
  ServerActionResult<UpdateUserNotificationsSettingsData> | null;

function parseNotificationsActionInput(formData: FormData): unknown {
  const payloadRaw = formData.get("payload");
  let payload: unknown;

  if (typeof payloadRaw === "string" && payloadRaw.length > 0) {
    try {
      payload = JSON.parse(payloadRaw) as unknown;
    } catch {
      payload = undefined;
    }
  }

  return {
    intent: formData.get("intent"),
    payload,
  };
}

export async function updateUserNotificationsSettingsAction(
  _prevState: UpdateUserNotificationsSettingsActionState,
  formData: FormData
): Promise<UpdateUserNotificationsSettingsActionState> {
  const parsed = parseProtectedActionInput(
    updateUserNotificationsSettingsInputSchema,
    parseNotificationsActionInput(formData)
  );
  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_USER_NOTIFICATIONS_SETTINGS_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_USER_NOTIFICATIONS_SETTINGS_ACTION,
      error: contextResult.error,
    });
  }

  const { operatingContext } = contextResult;
  const actorUserId = operatingContext.actor.userId;

  await upsertUserPreferencesSection({
    userId: actorUserId,
    section: "notifications",
    value: parsed.value.payload,
    audit: {
      actorType: "user",
      actorUserId,
      correlationId: operatingContext.correlationId,
      source: "app",
    },
  });

  revalidatePath("/settings/notifications");

  await recordActionAudit({
    action: USER_SETTINGS_AUDIT_EVENTS.notificationsUpdated,
    actorUserId,
    module: USER_SETTINGS_MUTATION_AUDIT_MODULE,
    result: "success",
    targetId: actorUserId,
    targetType: "user_notifications_preferences",
  });

  return serverActionSuccess({
    acknowledged: true,
    userId: actorUserId,
  });
}
