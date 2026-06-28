/**
 * PAS-001B B85 — intercompany ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/intercompany`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed intercompany-domain export surface.

export {
  IC_BILLING_DIRECTIONS,
  type IcBillingDirection,
  isIcBillingDirection,
} from "./ic-billing-direction.contract.js";
export {
  IC_MATCHING_STATUSES,
  type IcMatchingStatus,
  isIcMatchingStatus,
} from "./ic-matching-status.contract.js";
export {
  IC_SETTLEMENT_METHODS,
  type IcSettlementMethod,
  isIcSettlementMethod,
} from "./ic-settlement-method.contract.js";
export {
  IC_TRANSACTION_TYPES,
  type IcTransactionType,
  isIcTransactionType,
} from "./ic-transaction-type.contract.js";
export {
  INTERCOMPANY_AUDIT_ACTIONS,
  type IntercompanyAuditAction,
  isIntercompanyAuditAction,
  parseIntercompanyAuditAction,
} from "./intercompany-audit-actions.contract.js";
export {
  INTERCOMPANY_AUTHORITY_FINGERPRINT,
  INTERCOMPANY_AUTHORITY_PAS,
  INTERCOMPANY_CONTRACTS_OWNER,
  INTERCOMPANY_PACKAGE_LIFECYCLE,
  INTERCOMPANY_PACKAGE_LIFECYCLE_PHASES,
  INTERCOMPANY_REGISTRY_ID,
  type IntercompanyPackageLifecyclePhase,
  isIntercompanyPackageLifecyclePhase,
} from "./intercompany-authority.contract.js";
export {
  INTERCOMPANY_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  INTERCOMPANY_DOMAIN_VOCABULARY_POLICY,
  type IntercompanyDomainProhibitedRuntimeSurface,
} from "./intercompany-domain-vocabulary.policy.js";
export {
  type assertIntercompanyDomainVocabularyRegistryIntegrity,
  INTERCOMPANY_DOMAIN_AUDIT_VOCABULARY,
  INTERCOMPANY_DOMAIN_AUTHORITY_METADATA,
  INTERCOMPANY_DOMAIN_BRANDED_ID_TYPE_NAMES,
  INTERCOMPANY_DOMAIN_BRANDED_IDS,
  INTERCOMPANY_DOMAIN_CLOSED_VOCABULARIES,
  INTERCOMPANY_DOMAIN_PERMISSION_VOCABULARY,
  INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY,
  INTERCOMPANY_DOMAIN_VOCABULARY_REGISTRY_ID,
  INTERCOMPANY_DOMAIN_WIRE_CONTEXT,
  type IntercompanyDomainBrandedIdEntry,
  type IntercompanyDomainClosedVocabularyEntry,
  type IntercompanyDomainVocabularyKind,
} from "./intercompany-domain-vocabulary.registry.js";
export type {
  assertIntercompanyDomainWireContextJsonSerializable,
  IntercompanyDomainWireContext,
} from "./intercompany-domain-wire-context.contract.js";
export {
  brandIcMatchingRunId,
  brandIcSettlementId,
  brandIntercompanyAgreementId,
  type IcMatchingRunId,
  type IcSettlementId,
  type IntercompanyAgreementId,
  toIcMatchingRunId,
  toIcSettlementId,
  toIntercompanyAgreementId,
} from "./intercompany-id.contract.js";
export {
  INTERCOMPANY_PERMISSION_ACTIONS,
  INTERCOMPANY_PERMISSION_DOMAINS,
  INTERCOMPANY_PERMISSION_KEY_VOCABULARY,
  type IntercompanyPermissionAction,
  type IntercompanyPermissionDomain,
  type IntercompanyPermissionKey,
  toIntercompanyPermissionKey,
} from "./intercompany-permission-vocabulary.contract.js";
