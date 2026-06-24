/**
 * System-admin mutation audit gate registry (PKG007_ADMIN / ADR-0014).
 *
 * Runtime checks live in `lib/system-admin-mutation-audit-enforcement.mts`.
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

export const SYSTEM_ADMIN_SERVER_ACTION_MUTATION_AUDIT_ENTRIES = [
  {
    id: "system_admin.settings.update",
    actionModule:
      "apps/erp/src/lib/system-admin/update-system-admin-settings.action.ts",
    targetType: "system_admin_settings",
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
] as const;
