/**
 * PAS-001B B95 — pos ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/pos`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed pos-domain export surface.

export {
  isPosAuditAction,
  POS_AUDIT_ACTIONS,
  type PosAuditAction,
  parsePosAuditAction,
} from "./pos-audit-actions.contract.js";
export {
  isPosPackageLifecyclePhase,
  POS_AUTHORITY_FINGERPRINT,
  POS_AUTHORITY_PAS,
  POS_CONTRACTS_OWNER,
  POS_PACKAGE_LIFECYCLE,
  POS_PACKAGE_LIFECYCLE_PHASES,
  POS_REGISTRY_ID,
  type PosPackageLifecyclePhase,
} from "./pos-authority.contract.js";
export {
  POS_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  POS_DOMAIN_VOCABULARY_POLICY,
  type PosDomainProhibitedRuntimeSurface,
} from "./pos-domain-vocabulary.policy.js";
export {
  type assertPosDomainVocabularyRegistryIntegrity,
  POS_DOMAIN_AUDIT_VOCABULARY,
  POS_DOMAIN_AUTHORITY_METADATA,
  POS_DOMAIN_BRANDED_ID_TYPE_NAMES,
  POS_DOMAIN_BRANDED_IDS,
  POS_DOMAIN_CLOSED_VOCABULARIES,
  POS_DOMAIN_PERMISSION_VOCABULARY,
  POS_DOMAIN_VOCABULARY_REGISTRY,
  POS_DOMAIN_VOCABULARY_REGISTRY_ID,
  POS_DOMAIN_WIRE_CONTEXT,
  type PosDomainBrandedIdEntry,
  type PosDomainClosedVocabularyEntry,
  type PosDomainVocabularyKind,
} from "./pos-domain-vocabulary.registry.js";
export type {
  assertPosDomainWireContextJsonSerializable,
  PosDomainWireContext,
} from "./pos-domain-wire-context.contract.js";
export {
  brandCashDrawerShiftId,
  brandPosSessionId,
  brandPosTransactionId,
  type CashDrawerShiftId,
  type PosSessionId,
  type PosTransactionId,
  toCashDrawerShiftId,
  toPosSessionId,
  toPosTransactionId,
} from "./pos-id.contract.js";
export {
  POS_PERMISSION_ACTIONS,
  POS_PERMISSION_DOMAINS,
  POS_PERMISSION_KEY_VOCABULARY,
  type PosPermissionAction,
  type PosPermissionDomain,
  type PosPermissionKey,
  toPosPermissionKey,
} from "./pos-permission-vocabulary.contract.js";
export {
  isPosSessionStatus,
  POS_SESSION_STATUSES,
  type PosSessionStatus,
} from "./pos-session-status.contract.js";
export {
  isShiftStatus,
  SHIFT_STATUSES,
  type ShiftStatus,
} from "./shift-status.contract.js";
export {
  isTenderType,
  TENDER_TYPES,
  type TenderType,
} from "./tender-type.contract.js";
export {
  isTransactionType,
  TRANSACTION_TYPES,
  type TransactionType,
} from "./transaction-type.contract.js";
