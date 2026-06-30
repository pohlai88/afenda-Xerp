/**
 * System-admin mutation audit gate registry (PKG007_ADMIN / ADR-0014).
 *
 * Runtime checks live in `lib/system-admin-mutation-audit-enforcement.mts`.
 * Keep `SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES` aligned with
 * `apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts`.
 */
export const SYSTEM_ADMIN_MUTATION_AUDIT_GATE =
  "scripts/governance/check-system-admin-mutation-audit.mts" as const;

export const SYSTEM_ADMIN_MUTATION_AUDIT_ENFORCEMENT_LIB =
  "scripts/governance/lib/system-admin-mutation-audit-enforcement.mts" as const;

export const SYSTEM_ADMIN_MUTATION_AUDIT_ERP_REGISTRY =
  "apps/erp/src/lib/system-admin/system-admin-mutation-audit.registry.ts" as const;

export const SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE =
  "system-admin-governed-mutations-emit-audit-evidence" as const;

export const SYSTEM_ADMIN_MUTATION_AUDIT_MODULE = "system_admin" as const;

export const SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES = [
  {
    id: "internal.v1.system-admin.user-invitations.post",
    contractExport: "systemAdminUserInvitationsPostContract",
    contractModule:
      "apps/erp/src/server/api/contracts/system-admin/system-admin.contract.ts",
    auditAction: "system_admin.user.invited",
  },
  {
    id: "internal.v1.system-admin.membership-role-assignments.post",
    contractExport: "systemAdminMembershipRoleAssignmentsPostContract",
    contractModule:
      "apps/erp/src/server/api/contracts/system-admin/system-admin.contract.ts",
    auditAction: "system_admin.membership.role.assigned",
  },
] as const;

export const SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES = [
  {
    id: "system_admin.settings.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-system-admin-settings.action.ts",
    targetType: "system_admin_settings",
  },
  {
    id: "system_admin.settings.notifications.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-notifications-settings.action.ts",
    targetType: "system_admin_settings",
    auditWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    id: "system_admin.settings.workspace.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-workspace-settings.action.ts",
    targetType: "system_admin_settings",
    auditWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    id: "system_admin.settings.billing.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-billing-settings.action.ts",
    targetType: "system_admin_settings",
    auditWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    id: "system_admin.settings.integrations.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-integrations-settings.action.ts",
    targetType: "system_admin_settings",
    auditWiringPath:
      "apps/erp/src/lib/system-admin/execute-tenant-settings-section-update.server.ts",
  },
  {
    id: "system_admin.settings.integrations.sso.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-sso-provider-settings.action.ts",
    targetType: "system_admin_integrations_settings",
  },
  {
    id: "system_admin.settings.integrations.oauth.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-oauth-provider-settings.action.ts",
    targetType: "system_admin_integrations_settings",
  },
  {
    id: "system_admin.settings.security.mfa_policy.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-security-mfa-policy.action.ts",
    targetType: "system_admin_settings",
  },
  {
    id: "system_admin.settings.members.invite.resend",
    actionModule:
      "apps/erp/src/lib/system-admin/resend-system-admin-invite.action.ts",
    targetType: "system_admin_members",
  },
  {
    id: "system_admin.settings.members.invite.revoke",
    actionModule:
      "apps/erp/src/lib/system-admin/revoke-system-admin-invite.action.ts",
    targetType: "system_admin_members",
  },
  {
    id: "system_admin.diagnostics.refresh_readiness_gate_full",
    actionModule:
      "apps/erp/src/lib/system-admin/refresh-accounting-readiness-gate-full.action.ts",
    targetType: "accounting_readiness_gate",
  },
] as const;

export const SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES = [
  {
    id: "system_admin.membership.role.assignment_denied",
    module: "apps/erp/src/server/system-admin/assign-membership-role.server.ts",
    auditAction: "system_admin.membership.role.assignment_denied",
  },
] as const;

export const SYSTEM_ADMIN_MUTATION_AUDIT_COVERAGE_TEST =
  "apps/erp/src/lib/system-admin/__tests__/system-admin-mutation-audit-coverage.test.ts" as const;

export const SYSTEM_ADMIN_MUTATION_AUDIT_PACKAGE_SCRIPTS = [
  "check:system-admin-mutation-audit",
  "quality:system-admin-mutation-audit",
] as const;

/** Markers that must appear in the ERP-side registry mirror. */
export const SYSTEM_ADMIN_MUTATION_AUDIT_ERP_REGISTRY_MARKERS = [
  SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE,
  "SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES",
  "SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES",
  "SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES",
  "SYSTEM_ADMIN_OBSERVABILITY_REGISTRY_PARITY_TEST",
] as const;

/** Every PKG007 server-action id must appear in the ERP registry (parity lock). */
export const SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ACTION_IDS =
  SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES.map((entry) => entry.id);
