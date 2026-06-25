/**
 * Governed diagnostic logging registry — PKG013_LOGGING.
 *
 * Defines ERP surfaces that must emit correlated structured diagnostics on
 * protected paths and the wiring modules CI validates via
 * `pnpm check:erp-diagnostic-logging`.
 *
 * Server-action paths byte-align with `GOVERNED_MUTATION_SERVER_ACTION_MODULES`
 * in `governed-mutation-audit-registry.ts`. Audit owns mutation audit symbols;
 * logging owns diagnostic emission symbols.
 */
export const GOVERNED_DIAGNOSTIC_LOGGING_EMISSION_SYMBOLS = [
  "createApiHandlerLogger",
  "logApiRequest",
  "createRequestBoundErpLogger",
  "logServerActionError",
] as const;

/** ERP modules that wire diagnostic logging for governed API mutations. */
export const GOVERNED_DIAGNOSTIC_API_MODULES = [
  {
    path: "apps/erp/src/server/api/runtime/api-handler-logging.ts",
    requiredSymbols: ["createApiHandlerLogger", "logApiRequest"],
  },
  {
    path: "apps/erp/src/server/api/runtime/create-api-handler.ts",
    requiredSymbols: ["createApiHandlerLogger", "logApiRequest"],
  },
  {
    path: "apps/erp/src/lib/observability/create-request-bound-logger.ts",
    requiredSymbols: ["createRequestBoundErpLogger"],
  },
  {
    path: "apps/erp/src/lib/server-actions/log-action-error.ts",
    requiredSymbols: ["logServerActionError"],
  },
] as const;

/** ERP server actions on protected paths — paths byte-aligned with PKG013_AUDIT. */
export const GOVERNED_DIAGNOSTIC_SERVER_ACTION_MODULES = [
  {
    path: "apps/erp/src/app/(protected)/actions/demo-auth-action.ts",
    action: "demo.protected.record",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/context/context-switch.action.ts",
    action: "workspace.context.switch",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts",
    action: "system_admin.diagnostics.refresh_readiness_gate_full",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/system-admin/update-system-admin-settings.action.ts",
    action: "system_admin.settings.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/system-admin/update-notifications-settings.action.ts",
    action: "system_admin.settings.notifications.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
    loggingWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    path: "apps/erp/src/lib/system-admin/update-workspace-settings.action.ts",
    action: "system_admin.settings.workspace.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
    loggingWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    path: "apps/erp/src/lib/system-admin/update-billing-settings.action.ts",
    action: "system_admin.settings.billing.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
    loggingWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    path: "apps/erp/src/lib/system-admin/update-integrations-settings.action.ts",
    action: "system_admin.settings.integrations.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
    loggingWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    path: "apps/erp/src/lib/system-admin/update-sso-provider-settings.action.ts",
    action: "system_admin.settings.integrations.sso.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/system-admin/update-oauth-provider-settings.action.ts",
    action: "system_admin.settings.integrations.oauth.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/system-admin/update-security-mfa-policy.action.ts",
    action: "system_admin.settings.security.mfa_policy.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/system-admin/resend-system-admin-invite.action.ts",
    action: "system_admin.settings.members.invite.resend",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/system-admin/revoke-system-admin-invite.action.ts",
    action: "system_admin.settings.members.invite.revoke",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/user-settings/update-user-profile-settings.action.ts",
    action: "user.settings.profile.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/user-settings/update-user-notifications-settings.action.ts",
    action: "user.settings.notifications.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/user-settings/update-user-preferences-settings.action.ts",
    action: "user.settings.preferences.update",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
  {
    path: "apps/erp/src/lib/user-settings/record-user-session-revoked.action.ts",
    action: "user.settings.session.revoke.record",
    loggingRequired: true,
    requiredSymbols: ["failServerAction"],
  },
] as const;

export const GOVERNED_DIAGNOSTIC_LOGGING_ENFORCEMENT_MODULE =
  "scripts/governance/lib/governed-diagnostic-logging-enforcement.mts" as const;

export const GOVERNED_DIAGNOSTIC_LOGGING_GATE_SCRIPT =
  "scripts/governance/check-erp-diagnostic-logging.mts" as const;
