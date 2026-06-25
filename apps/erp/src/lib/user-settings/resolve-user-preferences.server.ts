import {
  defaultUserDisplayPreferences,
  getUserPreferencesByUserId,
  type UserDisplayPreferences,
  type UserNotificationsPreferences,
} from "@afenda/database";

import { resolveUserSettingsOperatingContext } from "./resolve-user-settings-context.server";

export interface UserPreferencesViewModel {
  readonly display: UserDisplayPreferences;
  readonly notifications: UserNotificationsPreferences | null;
  readonly persisted: boolean;
}

export type ResolveUserPreferencesResult =
  | {
      readonly kind: "ready";
      readonly preferences: UserPreferencesViewModel;
    }
  | {
      readonly kind: "not_found";
    };

/** Loads self-scoped preferences via canonical @afenda/database service. */
export async function resolveUserPreferences(): Promise<ResolveUserPreferencesResult> {
  const contextResult = await resolveUserSettingsOperatingContext();

  if (contextResult.kind !== "ready") {
    return { kind: "not_found" };
  }

  const record = await getUserPreferencesByUserId(contextResult.actorUserId);

  if (!record) {
    return {
      kind: "ready",
      preferences: {
        display: defaultUserDisplayPreferences,
        notifications: null,
        persisted: false,
      },
    };
  }

  return {
    kind: "ready",
    preferences: {
      display: record.display ?? defaultUserDisplayPreferences,
      notifications: record.notifications,
      persisted: true,
    },
  };
}
