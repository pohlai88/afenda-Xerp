/**
 * PAS-001B B98 — marketing ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/marketing`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed marketing-domain export surface.

export {
  ATTRIBUTION_MODELS,
  type AttributionModel,
  isAttributionModel,
} from "./attribution-model.contract.js";
export {
  CAMPAIGN_CHANNELS,
  type CampaignChannel,
  isCampaignChannel,
} from "./campaign-channel.contract.js";
export {
  CAMPAIGN_STATUSES,
  type CampaignStatus,
  isCampaignStatus,
} from "./campaign-status.contract.js";
export {
  isMarketingAuditAction,
  MARKETING_AUDIT_ACTIONS,
  type MarketingAuditAction,
  parseMarketingAuditAction,
} from "./marketing-audit-actions.contract.js";
export {
  isMarketingPackageLifecyclePhase,
  MARKETING_AUTHORITY_FINGERPRINT,
  MARKETING_AUTHORITY_PAS,
  MARKETING_CONTRACTS_OWNER,
  MARKETING_PACKAGE_LIFECYCLE,
  MARKETING_PACKAGE_LIFECYCLE_PHASES,
  MARKETING_REGISTRY_ID,
  type MarketingPackageLifecyclePhase,
} from "./marketing-authority.contract.js";
export {
  MARKETING_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  MARKETING_DOMAIN_VOCABULARY_POLICY,
  type MarketingDomainProhibitedRuntimeSurface,
} from "./marketing-domain-vocabulary.policy.js";
export {
  type assertMarketingDomainVocabularyRegistryIntegrity,
  MARKETING_DOMAIN_AUDIT_VOCABULARY,
  MARKETING_DOMAIN_AUTHORITY_METADATA,
  MARKETING_DOMAIN_BRANDED_ID_TYPE_NAMES,
  MARKETING_DOMAIN_BRANDED_IDS,
  MARKETING_DOMAIN_CLOSED_VOCABULARIES,
  MARKETING_DOMAIN_PERMISSION_VOCABULARY,
  MARKETING_DOMAIN_VOCABULARY_REGISTRY,
  MARKETING_DOMAIN_VOCABULARY_REGISTRY_ID,
  MARKETING_DOMAIN_WIRE_CONTEXT,
  type MarketingDomainBrandedIdEntry,
  type MarketingDomainClosedVocabularyEntry,
  type MarketingDomainVocabularyKind,
} from "./marketing-domain-vocabulary.registry.js";
export type {
  assertMarketingDomainWireContextJsonSerializable,
  MarketingDomainWireContext,
} from "./marketing-domain-wire-context.contract.js";
export {
  type AudienceSegmentId,
  brandAudienceSegmentId,
  brandContentVariantId,
  brandMarketingCampaignId,
  type ContentVariantId,
  type MarketingCampaignId,
  toAudienceSegmentId,
  toContentVariantId,
  toMarketingCampaignId,
} from "./marketing-id.contract.js";
export {
  MARKETING_PERMISSION_ACTIONS,
  MARKETING_PERMISSION_DOMAINS,
  MARKETING_PERMISSION_KEY_VOCABULARY,
  type MarketingPermissionAction,
  type MarketingPermissionDomain,
  type MarketingPermissionKey,
  toMarketingPermissionKey,
} from "./marketing-permission-vocabulary.contract.js";
export {
  isSegmentType,
  SEGMENT_TYPES,
  type SegmentType,
} from "./segment-type.contract.js";
