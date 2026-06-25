"use server";

import { syncAuthMirrorUser } from "@afenda/auth";
import { getDb, updateUser, users } from "@afenda/database";
import { AppErrors } from "@afenda/kernel";
import { eq } from "drizzle-orm";
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

export const UPDATE_USER_PROFILE_SETTINGS_INTENT =
  "update-user-profile" as const;

const UPDATE_USER_PROFILE_SETTINGS_ACTION =
  "user.settings.profile.update" as const;

const updateUserProfileSettingsInputSchema = z.object({
  intent: z.literal(UPDATE_USER_PROFILE_SETTINGS_INTENT),
  displayName: z.string().trim().min(1).max(255),
});

export interface UpdateUserProfileSettingsData {
  readonly acknowledged: true;
  readonly userId: string;
}

export type UpdateUserProfileSettingsActionState =
  ServerActionResult<UpdateUserProfileSettingsData> | null;

function parseProfileActionInput(formData: FormData): unknown {
  return {
    intent: formData.get("intent"),
    displayName: formData.get("displayName") ?? undefined,
  };
}

export async function updateUserProfileSettingsAction(
  _prevState: UpdateUserProfileSettingsActionState,
  formData: FormData
): Promise<UpdateUserProfileSettingsActionState> {
  const parsed = parseProtectedActionInput(
    updateUserProfileSettingsInputSchema,
    parseProfileActionInput(formData)
  );
  if (!parsed.ok) {
    return failServerAction({
      action: UPDATE_USER_PROFILE_SETTINGS_ACTION,
      error: parsed.error,
    });
  }

  const contextResult = await resolveActionOperatingContext();
  if (!contextResult.ok) {
    return failServerAction({
      action: UPDATE_USER_PROFILE_SETTINGS_ACTION,
      error: contextResult.error,
    });
  }

  const { operatingContext } = contextResult;
  const actorUserId = operatingContext.actor.userId;

  const [existingUser] = await getDb()
    .select({
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, actorUserId))
    .limit(1);

  if (!existingUser) {
    return failServerAction({
      action: UPDATE_USER_PROFILE_SETTINGS_ACTION,
      error: AppErrors.notFound("Profile not found."),
      userId: actorUserId,
    });
  }

  await updateUser(actorUserId, {
    displayName: parsed.value.displayName,
    audit: {
      actorType: "user",
      actorUserId,
      correlationId: operatingContext.correlationId,
      source: "app",
    },
  });

  await syncAuthMirrorUser({
    userId: actorUserId,
    email: existingUser.email,
    displayName: parsed.value.displayName,
  });

  revalidatePath("/settings/profile");

  await recordActionAudit({
    action: USER_SETTINGS_AUDIT_EVENTS.profileUpdated,
    actorUserId,
    module: USER_SETTINGS_MUTATION_AUDIT_MODULE,
    result: "success",
    targetId: actorUserId,
    targetType: "user_profile",
  });

  return serverActionSuccess({
    acknowledged: true,
    userId: actorUserId,
  });
}
