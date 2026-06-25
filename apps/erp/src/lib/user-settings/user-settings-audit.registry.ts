/**
 * User self-service audit vocabulary (ARCH-USER-001 §5.11).
 * Enforced on mutation actions from Slice 2 onward.
 */
export const USER_SETTINGS_AUDIT_EVENTS = {
  profileUpdated: "user.settings.profile_updated",
  preferencesUpdated: "user.settings.preferences_updated",
  notificationsUpdated: "user.settings.notifications_updated",
  sessionRevoked: "user.session.revoked",
} as const satisfies Record<string, string>;

export type UserSettingsAuditEvent =
  (typeof USER_SETTINGS_AUDIT_EVENTS)[keyof typeof USER_SETTINGS_AUDIT_EVENTS];

/** ERP audit module for user self-service mutations (ARCH-USER-001 §5.11). */
export const USER_SETTINGS_MUTATION_AUDIT_MODULE = "user_settings" as const;
