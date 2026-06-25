/**
 * User self-service audit vocabulary (ARCH-USER-001 §5.11).
 * Enforced on mutation actions from Slice 2 onward.
 */
export const USER_SETTINGS_MUTATION_AUDIT_SURFACE_RULE =
  "user-settings-governed-mutations-emit-audit-evidence" as const;

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

/** Governed user-settings server action mutations (ARCH-USER-001 Slice 9). */
export const USER_SETTINGS_SERVER_ACTION_MUTATION_AUDIT_ENTRIES = [
  {
    id: "user.settings.profile.update",
    actionModule:
      "apps/erp/src/lib/user-settings/update-user-profile-settings.action.ts",
    targetType: "user_profile",
    auditEvent: "user.settings.profile_updated",
    auditEventKey: "profileUpdated",
  },
  {
    id: "user.settings.notifications.update",
    actionModule:
      "apps/erp/src/lib/user-settings/update-user-notifications-settings.action.ts",
    targetType: "user_notifications_preferences",
    auditEvent: "user.settings.notifications_updated",
    auditEventKey: "notificationsUpdated",
  },
  {
    id: "user.settings.preferences.update",
    actionModule:
      "apps/erp/src/lib/user-settings/update-user-preferences-settings.action.ts",
    targetType: "user_display_preferences",
    auditEvent: "user.settings.preferences_updated",
    auditEventKey: "preferencesUpdated",
  },
  {
    id: "user.settings.session.revoke.record",
    actionModule:
      "apps/erp/src/lib/user-settings/record-user-session-revoked.action.ts",
    targetType: "user_session",
    auditEvent: "user.session.revoked",
    auditEventKey: "sessionRevoked",
  },
] as const;

export const USER_SETTINGS_MUTATION_AUDIT_COVERAGE_TEST =
  "apps/erp/src/lib/user-settings/__tests__/user-settings-mutation-audit-coverage.test.ts" as const;
