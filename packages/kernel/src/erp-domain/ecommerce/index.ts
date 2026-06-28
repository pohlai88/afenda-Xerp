/**
 * PAS-001B B94 — ecommerce ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/ecommerce`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed ecommerce-domain export surface.

export {
  CART_STATUSES,
  type CartStatus,
  isCartStatus,
} from "./cart-status.contract.js";
export {
  CHANNEL_TYPES,
  type ChannelType,
  isChannelType,
} from "./channel-type.contract.js";
export {
  CHECKOUT_STEPS,
  type CheckoutStep,
  isCheckoutStep,
} from "./checkout-step.contract.js";
export {
  ECOMMERCE_AUDIT_ACTIONS,
  type EcommerceAuditAction,
  isEcommerceAuditAction,
  parseEcommerceAuditAction,
} from "./ecommerce-audit-actions.contract.js";
export {
  ECOMMERCE_AUTHORITY_FINGERPRINT,
  ECOMMERCE_AUTHORITY_PAS,
  ECOMMERCE_CONTRACTS_OWNER,
  ECOMMERCE_PACKAGE_LIFECYCLE,
  ECOMMERCE_PACKAGE_LIFECYCLE_PHASES,
  ECOMMERCE_REGISTRY_ID,
  type EcommercePackageLifecyclePhase,
  isEcommercePackageLifecyclePhase,
} from "./ecommerce-authority.contract.js";
export {
  ECOMMERCE_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  ECOMMERCE_DOMAIN_VOCABULARY_POLICY,
  type EcommerceDomainProhibitedRuntimeSurface,
} from "./ecommerce-domain-vocabulary.policy.js";
export {
  type assertEcommerceDomainVocabularyRegistryIntegrity,
  ECOMMERCE_DOMAIN_AUDIT_VOCABULARY,
  ECOMMERCE_DOMAIN_AUTHORITY_METADATA,
  ECOMMERCE_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ECOMMERCE_DOMAIN_BRANDED_IDS,
  ECOMMERCE_DOMAIN_CLOSED_VOCABULARIES,
  ECOMMERCE_DOMAIN_PERMISSION_VOCABULARY,
  ECOMMERCE_DOMAIN_VOCABULARY_REGISTRY,
  ECOMMERCE_DOMAIN_VOCABULARY_REGISTRY_ID,
  ECOMMERCE_DOMAIN_WIRE_CONTEXT,
  type EcommerceDomainBrandedIdEntry,
  type EcommerceDomainClosedVocabularyEntry,
  type EcommerceDomainVocabularyKind,
} from "./ecommerce-domain-vocabulary.registry.js";
export type {
  assertEcommerceDomainWireContextJsonSerializable,
  EcommerceDomainWireContext,
} from "./ecommerce-domain-wire-context.contract.js";
export {
  brandCheckoutSessionId,
  brandWebCartId,
  brandWebOrderId,
  type CheckoutSessionId,
  toCheckoutSessionId,
  toWebCartId,
  toWebOrderId,
  type WebCartId,
  type WebOrderId,
} from "./ecommerce-id.contract.js";
export {
  ECOMMERCE_PERMISSION_ACTIONS,
  ECOMMERCE_PERMISSION_DOMAINS,
  ECOMMERCE_PERMISSION_KEY_VOCABULARY,
  type EcommercePermissionAction,
  type EcommercePermissionDomain,
  type EcommercePermissionKey,
  toEcommercePermissionKey,
} from "./ecommerce-permission-vocabulary.contract.js";
export {
  isWebOrderStatus,
  WEB_ORDER_STATUSES,
  type WebOrderStatus,
} from "./web-order-status.contract.js";
