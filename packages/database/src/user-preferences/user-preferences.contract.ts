import { z } from "zod";

/** Serializable notifications preferences for AppShellAccountSettings02 persistence. */
export const userNotificationsPreferencesSchema = z.object({
  browserItems: z.array(
    z.object({
      checked: z.boolean(),
      id: z.string().min(1).max(64),
      label: z.string().min(1).max(255),
    })
  ),
  daysOff: z.array(z.string().min(1).max(16)),
  dndEnabled: z.boolean(),
  fromTime: z.string().min(1).max(16),
  inboxItems: z.array(
    z.object({
      description: z.string().max(512),
      enabled: z.boolean(),
      id: z.string().min(1).max(64),
      label: z.string().min(1).max(255),
    })
  ),
  playSoundOnBlink: z.boolean(),
  sections: z.array(
    z.object({
      id: z.string().min(1).max(64),
      items: z.array(
        z.object({
          channels: z.object({
            app: z.boolean(),
            desktop: z.boolean(),
            email: z.boolean(),
          }),
          description: z.string().max(512),
          id: z.string().min(1).max(64),
          title: z.string().min(1).max(255),
        })
      ),
      title: z.string().min(1).max(255),
    })
  ),
  toTime: z.string().min(1).max(16),
});

export const USER_DISPLAY_THEME_VALUES = ["light", "dark", "system"] as const;

export const USER_DISPLAY_DENSITY_VALUES = ["comfortable", "compact"] as const;

/** Serializable display preferences (theme, density, locale, timezone). */
export const userDisplayPreferencesSchema = z.object({
  density: z.enum(USER_DISPLAY_DENSITY_VALUES),
  locale: z.string().min(2).max(16),
  theme: z.enum(USER_DISPLAY_THEME_VALUES),
  timezone: z.string().min(1).max(128),
});

export type UserNotificationsPreferences = z.infer<
  typeof userNotificationsPreferencesSchema
>;
export type UserDisplayPreferences = z.infer<
  typeof userDisplayPreferencesSchema
>;

export type UserPreferencesSectionKey = "display" | "notifications";

export interface UserPreferencesRecord {
  readonly display: UserDisplayPreferences | null;
  readonly id: string;
  readonly notifications: UserNotificationsPreferences | null;
  readonly userId: string;
}

export const defaultUserDisplayPreferences = {
  density: "comfortable",
  locale: "en",
  theme: "system",
  timezone: "UTC",
} satisfies UserDisplayPreferences;

export function parseUserNotificationsPreferences(
  value: unknown
): UserNotificationsPreferences | null {
  const parsed = userNotificationsPreferencesSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function parseUserDisplayPreferences(
  value: unknown
): UserDisplayPreferences | null {
  const parsed = userDisplayPreferencesSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}
