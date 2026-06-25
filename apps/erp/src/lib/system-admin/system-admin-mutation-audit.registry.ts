/**
 * Canonical system-admin governed mutation audit registry (PKG007_ADMIN).
 *
 * Every sensitive system-admin mutation must emit audit evidence via the
 * operating spine (API contracts) or `recordActionAudit` (server actions).
 */
export const SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE =
  "system-admin-governed-mutations-emit-audit-evidence" as const;

export const SYSTEM_ADMIN_MUTATION_AUDIT_MODULE = "system_admin" as const;

/** Governed internal v1 API mutations under `/api/internal/v1/system-admin/`. */
export const SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES = [
  {
    id: "internal.v1.system-admin.users.invite.post",
    contractExport: "systemAdminUserInvitePostContract",
    contractModule:
      "apps/erp/src/server/api/contracts/system-admin/system-admin.contract.ts",
    auditAction: "system_admin.user.invited",
  },
  {
    id: "internal.v1.system-admin.memberships.role.post",
    contractExport: "systemAdminMembershipRolePostContract",
    contractModule:
      "apps/erp/src/server/api/contracts/system-admin/system-admin.contract.ts",
    auditAction: "system_admin.membership.role.assigned",
  },
] as const;

/**
 * PKG013 — settings mutations emit audit evidence (ARCH-ADMIN-001 Slice 5).
 * Parity asserted in `system-admin-observability-registry-parity.test.ts`.
 */
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
  },
  {
    id: "system_admin.settings.workspace.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-workspace-settings.action.ts",
    targetType: "system_admin_settings",
  },
  {
    id: "system_admin.settings.billing.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-billing-settings.action.ts",
    targetType: "system_admin_settings",
  },
  {
    id: "system_admin.settings.integrations.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-integrations-settings.action.ts",
    targetType: "system_admin_settings",
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

export const SYSTEM_ADMIN_OBSERVABILITY_REGISTRY_PARITY_TEST =
  "apps/erp/src/lib/system-admin/__tests__/system-admin-observability-registry-parity.test.ts" as const;

/** Supplementary audit paths not covered by contract or action registries. */
export const SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES = [
  {
    id: "system_admin.section.access_denied",
    module:
      "apps/erp/src/lib/system-admin/guard-system-admin-section.server.ts",
    auditAction: "system_admin.section.access_denied",
  },
  {
    id: "system_admin.membership.role.assignment_denied",
    module: "apps/erp/src/server/system-admin/assign-membership-role.server.ts",
    auditAction: "system_admin.membership.role.assignment_denied",
  },
] as const;

export const SYSTEM_ADMIN_MUTATION_AUDIT_COVERAGE_TEST =
  "apps/erp/src/lib/system-admin/__tests__/system-admin-mutation-audit-coverage.test.ts" as const;
