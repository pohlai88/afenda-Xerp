/**
 * ERP mirror of `scripts/governance/system-admin-mutation-audit-registry.mts`.
 * Keep canonical API operation ids aligned with governed REST contracts.
 */
export const SYSTEM_ADMIN_MUTATION_AUDIT_SURFACE_RULE =
  "system-admin-governed-mutations-emit-audit-evidence" as const;

export const SYSTEM_ADMIN_API_MUTATION_AUDIT_ENTRIES = [
  {
    id: "internal.v1.system-admin.user-invitations.post",
    auditAction: "system_admin.user.invited",
  },
  {
    id: "internal.v1.system-admin.membership-role-assignments.post",
    auditAction: "system_admin.membership.role.assigned",
  },
] as const;

export const SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES = [
  "system_admin.settings.update",
  "system_admin.settings.notifications.update",
  "system_admin.settings.workspace.update",
  "system_admin.settings.billing.update",
  "system_admin.settings.integrations.update",
  "system_admin.settings.integrations.sso.update",
  "system_admin.settings.integrations.oauth.update",
  "system_admin.settings.security.mfa_policy.update",
  "system_admin.settings.members.invite.resend",
  "system_admin.settings.members.invite.revoke",
  "system_admin.diagnostics.refresh_readiness_gate_full",
] as const;

export const SYSTEM_ADMIN_SUPPLEMENTARY_MUTATION_AUDIT_ENTRIES = [
  "system_admin.membership.role.assignment_denied",
] as const;

export const SYSTEM_ADMIN_OBSERVABILITY_REGISTRY_PARITY_TEST =
  "apps/erp/src/lib/system-admin/__tests__/system-admin-mutation-audit-coverage.test.ts" as const;
