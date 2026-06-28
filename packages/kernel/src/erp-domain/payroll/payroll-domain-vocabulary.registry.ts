import { DEDUCTION_TYPES } from "./deduction-type.contract.js";
import { EARNINGS_TYPES } from "./earnings-type.contract.js";
import { PAY_FREQUENCIES } from "./pay-frequency.contract.js";
import {
  type isPayrollAuditAction,
  PAYROLL_AUDIT_ACTIONS,
} from "./payroll-audit-actions.contract.js";
import {
  PAYROLL_PACKAGE_LIFECYCLE,
  PAYROLL_PACKAGE_LIFECYCLE_PHASES,
} from "./payroll-authority.contract.js";
import {
  PAYROLL_PERMISSION_DOMAINS,
  PAYROLL_PERMISSION_KEY_VOCABULARY,
} from "./payroll-permission-vocabulary.contract.js";
import { PAYROLL_RUN_STATUSES } from "./payroll-run-status.contract.js";

export const PAYROLL_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-PAYROLL" as const;

export type PayrollDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface PayrollDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export const PAYROLL_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "payroll-run-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "payroll-run-status.contract.ts",
    constantExport: "PAYROLL_RUN_STATUSES",
    typeExport: "PayrollRunStatus",
    narrowerExport: "isPayrollRunStatus",
    valueCount: PAYROLL_RUN_STATUSES.length,
  },
  {
    id: "pay-frequency",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "pay-frequency.contract.ts",
    constantExport: "PAY_FREQUENCIES",
    typeExport: "PayFrequency",
    narrowerExport: "isPayFrequency",
    valueCount: PAY_FREQUENCIES.length,
  },
  {
    id: "earnings-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "earnings-type.contract.ts",
    constantExport: "EARNINGS_TYPES",
    typeExport: "EarningsType",
    narrowerExport: "isEarningsType",
    valueCount: EARNINGS_TYPES.length,
  },
  {
    id: "deduction-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "deduction-type.contract.ts",
    constantExport: "DEDUCTION_TYPES",
    typeExport: "DeductionType",
    narrowerExport: "isDeductionType",
    valueCount: DEDUCTION_TYPES.length,
  },
] as const satisfies readonly PayrollDomainClosedVocabularyEntry[];

export interface PayrollDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const PAYROLL_DOMAIN_BRANDED_IDS = [
  {
    typeName: "PayrollRunId",
    brandFunction: "brandPayrollRunId",
    toFunction: "toPayrollRunId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "PayslipId",
    brandFunction: "brandPayslipId",
    toFunction: "toPayslipId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "TaxWithholdingAdjustmentId",
    brandFunction: "brandTaxWithholdingAdjustmentId",
    toFunction: "toTaxWithholdingAdjustmentId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly PayrollDomainBrandedIdEntry[];

export const PAYROLL_DOMAIN_BRANDED_ID_TYPE_NAMES =
  PAYROLL_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const PAYROLL_DOMAIN_WIRE_CONTEXT = {
  id: "payroll-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "payroll-domain-wire-context.contract.ts",
  typeExport: "PayrollDomainWireContext",
  assertExport: "assertPayrollDomainWireContextJsonSerializable",
} as const;

export const PAYROLL_DOMAIN_AUDIT_VOCABULARY = {
  id: "payroll-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "payroll-audit-actions.contract.ts",
  constantExport: "PAYROLL_AUDIT_ACTIONS",
  typeExport: "PayrollAuditAction",
  narrowerExport: "isPayrollAuditAction",
  valueCount: PAYROLL_AUDIT_ACTIONS.length,
} as const;

export const PAYROLL_DOMAIN_PERMISSION_VOCABULARY = {
  id: "payroll-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "payroll-permission-vocabulary.contract.ts",
  domainsExport: "PAYROLL_PERMISSION_DOMAINS",
  keysExport: "PAYROLL_PERMISSION_KEY_VOCABULARY",
  domainCount: PAYROLL_PERMISSION_DOMAINS.length,
  keyCount: PAYROLL_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const PAYROLL_DOMAIN_AUTHORITY_METADATA = {
  id: "payroll-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "payroll-authority.contract.ts",
  lifecycleExport: "PAYROLL_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "PAYROLL_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: PAYROLL_PACKAGE_LIFECYCLE,
  phaseCount: PAYROLL_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const PAYROLL_DOMAIN_VOCABULARY_REGISTRY = {
  id: PAYROLL_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: PAYROLL_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: PAYROLL_DOMAIN_BRANDED_IDS,
  wireContext: PAYROLL_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: PAYROLL_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: PAYROLL_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: PAYROLL_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof PAYROLL_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isPayrollAuditAction
  >[0]
    ? true
    : never;

export type assertPayrollDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
