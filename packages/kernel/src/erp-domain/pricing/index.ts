/**
 * PAS-001B B92 — pricing ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/pricing`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed pricing-domain export surface.

export {
  DISCOUNT_TYPES,
  type DiscountType,
  isDiscountType,
} from "./discount-type.contract.js";
export {
  isPriceApprovalStatus,
  PRICE_APPROVAL_STATUSES,
  type PriceApprovalStatus,
} from "./price-approval-status.contract.js";
export {
  isPriceListStatus,
  PRICE_LIST_STATUSES,
  type PriceListStatus,
} from "./price-list-status.contract.js";
export {
  isPricingAuditAction,
  PRICING_AUDIT_ACTIONS,
  type PricingAuditAction,
  parsePricingAuditAction,
} from "./pricing-audit-actions.contract.js";
export {
  isPricingPackageLifecyclePhase,
  PRICING_AUTHORITY_FINGERPRINT,
  PRICING_AUTHORITY_PAS,
  PRICING_CONTRACTS_OWNER,
  PRICING_MODULE_KV_ID,
  PRICING_PACKAGE_LIFECYCLE,
  PRICING_PACKAGE_LIFECYCLE_PHASES,
  PRICING_REGISTRY_ID,
  type PricingPackageLifecyclePhase,
} from "./pricing-authority.contract.js";
export {
  PRICING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  PRICING_DOMAIN_VOCABULARY_POLICY,
  type PricingDomainProhibitedRuntimeSurface,
} from "./pricing-domain-vocabulary.policy.js";
export {
  type assertPricingDomainVocabularyRegistryIntegrity,
  PRICING_DOMAIN_AUDIT_VOCABULARY,
  PRICING_DOMAIN_AUTHORITY_METADATA,
  PRICING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  PRICING_DOMAIN_BRANDED_IDS,
  PRICING_DOMAIN_CLOSED_VOCABULARIES,
  PRICING_DOMAIN_PERMISSION_VOCABULARY,
  PRICING_DOMAIN_VOCABULARY_REGISTRY,
  PRICING_DOMAIN_VOCABULARY_REGISTRY_ID,
  PRICING_DOMAIN_WIRE_CONTEXT,
  type PricingDomainBrandedIdEntry,
  type PricingDomainClosedVocabularyEntry,
  type PricingDomainVocabularyKind,
} from "./pricing-domain-vocabulary.registry.js";
export type {
  assertPricingDomainWireContextJsonSerializable,
  PricingDomainWireContext,
} from "./pricing-domain-wire-context.contract.js";
export {
  brandDiscountApprovalId,
  brandPriceListId,
  brandPriceRuleSetId,
  type DiscountApprovalId,
  type PriceListId,
  type PriceRuleSetId,
  toDiscountApprovalId,
  toPriceListId,
  toPriceRuleSetId,
} from "./pricing-id.contract.js";
export {
  isPricingMethod,
  PRICING_METHODS,
  type PricingMethod,
} from "./pricing-method.contract.js";
export {
  PRICING_PERMISSION_ACTIONS,
  PRICING_PERMISSION_DOMAINS,
  PRICING_PERMISSION_KEY_VOCABULARY,
  type PricingPermissionAction,
  type PricingPermissionDomain,
  type PricingPermissionKey,
  toPricingPermissionKey,
} from "./pricing-permission-vocabulary.contract.js";
