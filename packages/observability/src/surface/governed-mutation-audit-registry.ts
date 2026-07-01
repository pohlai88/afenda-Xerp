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
    path: "apps/erp/src/lib/context/context-switch.action.ts",
    action: "workspace.context.switch",
    auditRequired: true,
    requiredSymbols: ["recordActionAudit"],
  },
] as const;

export const GOVERNED_MUTATION_AUDIT_ENFORCEMENT_MODULE =
  "scripts/governance/lib/governed-mutation-audit-enforcement.mts" as const;

export const GOVERNED_MUTATION_AUDIT_GATE_SCRIPT =
  "scripts/governance/check-erp-observability.mts" as const;
