/**
 * PAS-001B B93 — subscription ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/subscription`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed subscription-domain export surface.

export {
  BILLING_CYCLES,
  type BillingCycle,
  isBillingCycle,
} from "./billing-cycle.contract.js";
export {
  isRenewalIntent,
  RENEWAL_INTENTS,
  type RenewalIntent,
} from "./renewal-intent.contract.js";
export {
  isSubscriptionAuditAction,
  parseSubscriptionAuditAction,
  SUBSCRIPTION_AUDIT_ACTIONS,
  type SubscriptionAuditAction,
} from "./subscription-audit-actions.contract.js";
export {
  isSubscriptionPackageLifecyclePhase,
  SUBSCRIPTION_AUTHORITY_FINGERPRINT,
  SUBSCRIPTION_AUTHORITY_PAS,
  SUBSCRIPTION_CONTRACTS_OWNER,
  SUBSCRIPTION_PACKAGE_LIFECYCLE,
  SUBSCRIPTION_PACKAGE_LIFECYCLE_PHASES,
  SUBSCRIPTION_REGISTRY_ID,
  type SubscriptionPackageLifecyclePhase,
} from "./subscription-authority.contract.js";
export {
  SUBSCRIPTION_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  SUBSCRIPTION_DOMAIN_VOCABULARY_POLICY,
  type SubscriptionDomainProhibitedRuntimeSurface,
} from "./subscription-domain-vocabulary.policy.js";
export {
  type assertSubscriptionDomainVocabularyRegistryIntegrity,
  SUBSCRIPTION_DOMAIN_AUDIT_VOCABULARY,
  SUBSCRIPTION_DOMAIN_AUTHORITY_METADATA,
  SUBSCRIPTION_DOMAIN_BRANDED_ID_TYPE_NAMES,
  SUBSCRIPTION_DOMAIN_BRANDED_IDS,
  SUBSCRIPTION_DOMAIN_CLOSED_VOCABULARIES,
  SUBSCRIPTION_DOMAIN_PERMISSION_VOCABULARY,
  SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY,
  SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY_ID,
  SUBSCRIPTION_DOMAIN_WIRE_CONTEXT,
  type SubscriptionDomainBrandedIdEntry,
  type SubscriptionDomainClosedVocabularyEntry,
  type SubscriptionDomainVocabularyKind,
} from "./subscription-domain-vocabulary.registry.js";
export type {
  assertSubscriptionDomainWireContextJsonSerializable,
  SubscriptionDomainWireContext,
} from "./subscription-domain-wire-context.contract.js";
export {
  isSubscriptionEventType,
  SUBSCRIPTION_EVENT_TYPES,
  type SubscriptionEventType,
} from "./subscription-event-type.contract.js";
export {
  type BillingCycleRunId,
  brandBillingCycleRunId,
  brandRenewalOfferId,
  brandSubscriptionId,
  type RenewalOfferId,
  type SubscriptionId,
  toBillingCycleRunId,
  toRenewalOfferId,
  toSubscriptionId,
} from "./subscription-id.contract.js";
export {
  SUBSCRIPTION_PERMISSION_ACTIONS,
  SUBSCRIPTION_PERMISSION_DOMAINS,
  SUBSCRIPTION_PERMISSION_KEY_VOCABULARY,
  type SubscriptionPermissionAction,
  type SubscriptionPermissionDomain,
  type SubscriptionPermissionKey,
  toSubscriptionPermissionKey,
} from "./subscription-permission-vocabulary.contract.js";
export {
  isSubscriptionStatus,
  SUBSCRIPTION_STATUSES,
  type SubscriptionStatus,
} from "./subscription-status.contract.js";
