/**
 * PAS-001B B100 — payroll ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/payroll`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed payroll-domain export surface.

export {
  DEDUCTION_TYPES,
  type DeductionType,
  isDeductionType,
} from "./deduction-type.contract.js";
export {
  EARNINGS_TYPES,
  type EarningsType,
  isEarningsType,
} from "./earnings-type.contract.js";
export {
  isPayFrequency,
  PAY_FREQUENCIES,
  type PayFrequency,
} from "./pay-frequency.contract.js";
export {
  isPayrollAuditAction,
  PAYROLL_AUDIT_ACTIONS,
  type PayrollAuditAction,
  parsePayrollAuditAction,
} from "./payroll-audit-actions.contract.js";
export {
  isPayrollPackageLifecyclePhase,
  PAYROLL_AUTHORITY_FINGERPRINT,
  PAYROLL_AUTHORITY_PAS,
  PAYROLL_CONTRACTS_OWNER,
  PAYROLL_MODULE_KV_ID,
  PAYROLL_PACKAGE_LIFECYCLE,
  PAYROLL_PACKAGE_LIFECYCLE_PHASES,
  PAYROLL_REGISTRY_ID,
  type PayrollPackageLifecyclePhase,
} from "./payroll-authority.contract.js";
export {
  PAYROLL_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  PAYROLL_DOMAIN_VOCABULARY_POLICY,
  type PayrollDomainProhibitedRuntimeSurface,
} from "./payroll-domain-vocabulary.policy.js";
export {
  type assertPayrollDomainVocabularyRegistryIntegrity,
  PAYROLL_DOMAIN_AUDIT_VOCABULARY,
  PAYROLL_DOMAIN_AUTHORITY_METADATA,
  PAYROLL_DOMAIN_BRANDED_ID_TYPE_NAMES,
  PAYROLL_DOMAIN_BRANDED_IDS,
  PAYROLL_DOMAIN_CLOSED_VOCABULARIES,
  PAYROLL_DOMAIN_PERMISSION_VOCABULARY,
  PAYROLL_DOMAIN_VOCABULARY_REGISTRY,
  PAYROLL_DOMAIN_VOCABULARY_REGISTRY_ID,
  PAYROLL_DOMAIN_WIRE_CONTEXT,
  type PayrollDomainBrandedIdEntry,
  type PayrollDomainClosedVocabularyEntry,
  type PayrollDomainVocabularyKind,
} from "./payroll-domain-vocabulary.registry.js";
export type {
  assertPayrollDomainWireContextJsonSerializable,
  PayrollDomainWireContext,
} from "./payroll-domain-wire-context.contract.js";
export {
  brandPayrollRunId,
  brandPayslipId,
  brandTaxWithholdingAdjustmentId,
  type PayrollRunId,
  type PayslipId,
  type TaxWithholdingAdjustmentId,
  toPayrollRunId,
  toPayslipId,
  toTaxWithholdingAdjustmentId,
} from "./payroll-id.contract.js";
export {
  PAYROLL_PERMISSION_ACTIONS,
  PAYROLL_PERMISSION_DOMAINS,
  PAYROLL_PERMISSION_KEY_VOCABULARY,
  type PayrollPermissionAction,
  type PayrollPermissionDomain,
  type PayrollPermissionKey,
  toPayrollPermissionKey,
} from "./payroll-permission-vocabulary.contract.js";
export {
  isPayrollRunStatus,
  PAYROLL_RUN_STATUSES,
  type PayrollRunStatus,
} from "./payroll-run-status.contract.js";
