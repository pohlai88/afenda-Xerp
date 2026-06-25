/**
 * Governed mutation audit enforcement registry — PKG013_AUDIT.
 *
 * Defines ERP surfaces that must emit audit evidence on successful governed
 * mutations and the wiring modules CI validates before `quality:erp-observability`.
 */
export const GOVERNED_MUTATION_AUDIT_EMISSION_SYMBOLS = [
  "recordErpAuditEvent",
  "recordActionAudit",
  "withAuditEvidence",
] as const;

/** ERP modules that wire audit evidence for governed API mutations. */
export const GOVERNED_MUTATION_API_AUDIT_MODULES = [
  {
    path: "apps/erp/src/server/api/runtime/api-handler-audit.ts",
    requiredSymbols: ["emitApiAuditEvidence", "recordErpAuditEvent"],
  },
  {
    path: "apps/erp/src/server/api/runtime/create-api-handler.ts",
    requiredSymbols: ["emitApiAuditEvidence", "runProtectedMutation"],
  },
] as const;

/** ERP server actions that perform governed mutations. */
export const GOVERNED_MUTATION_SERVER_ACTION_MODULES = [
  {
    path: "apps/erp/src/app/(protected)/actions/demo-auth-action.ts",
    action: "demo.protected.record",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
  {
    path: "apps/erp/src/lib/context/context-switch.action.ts",
    action: "workspace.context.switch",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
  {
    path: "apps/erp/src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts",
    action: "system_admin.diagnostics.refresh_readiness_gate_full",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
  {
    path: "apps/erp/src/lib/system-admin/update-system-admin-settings.action.ts",
    action: "system_admin.settings.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
  {
    path: "apps/erp/src/lib/system-admin/update-notifications-settings.action.ts",
    action: "system_admin.settings.notifications.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
    auditWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    path: "apps/erp/src/lib/system-admin/update-workspace-settings.action.ts",
    action: "system_admin.settings.workspace.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
    auditWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    path: "apps/erp/src/lib/system-admin/update-billing-settings.action.ts",
    action: "system_admin.settings.billing.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
    auditWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    path: "apps/erp/src/lib/system-admin/update-integrations-settings.action.ts",
    action: "system_admin.settings.integrations.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
    auditWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    path: "apps/erp/src/lib/system-admin/update-sso-provider-settings.action.ts",
    action: "system_admin.settings.integrations.sso.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit", "persistAuthAuditEvent"],
  },
  {
    path: "apps/erp/src/lib/system-admin/update-oauth-provider-settings.action.ts",
    action: "system_admin.settings.integrations.oauth.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit", "persistAuthAuditEvent"],
  },
  {
    path: "apps/erp/src/lib/system-admin/update-security-mfa-policy.action.ts",
    action: "system_admin.settings.security.mfa_policy.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
  {
    path: "apps/erp/src/lib/system-admin/resend-system-admin-invite.action.ts",
    action: "system_admin.settings.members.invite.resend",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
  {
    path: "apps/erp/src/lib/system-admin/revoke-system-admin-invite.action.ts",
    action: "system_admin.settings.members.invite.revoke",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
  {
    path: "apps/erp/src/lib/user-settings/update-user-profile-settings.action.ts",
    action: "user.settings.profile.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
  {
    path: "apps/erp/src/lib/user-settings/update-user-notifications-settings.action.ts",
    action: "user.settings.notifications.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
  {
    path: "apps/erp/src/lib/user-settings/update-user-preferences-settings.action.ts",
    action: "user.settings.preferences.update",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
  {
    path: "apps/erp/src/lib/user-settings/record-user-session-revoked.action.ts",
    action: "user.settings.session.revoke.record",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
] as const;

export const GOVERNED_MUTATION_AUDIT_ENFORCEMENT_MODULE =
  "scripts/governance/lib/governed-mutation-audit-enforcement.mts" as const;

export const GOVERNED_MUTATION_AUDIT_GATE_SCRIPT =
  "scripts/governance/check-erp-observability.mts" as const;
