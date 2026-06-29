/**
 * PAS-001B B91 — crm ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/crm`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed crm-domain export surface.

export {
  ACCOUNT_TIERS,
  type AccountTier,
  isAccountTier,
} from "./account-tier.contract.js";
export {
  ACTIVITY_TYPES,
  type ActivityType,
  isActivityType,
} from "./activity-type.contract.js";
export {
  CRM_AUDIT_ACTIONS,
  type CrmAuditAction,
  isCrmAuditAction,
  parseCrmAuditAction,
} from "./crm-audit-actions.contract.js";
export {
  CRM_AUTHORITY_FINGERPRINT,
  CRM_AUTHORITY_PAS,
  CRM_CONTRACTS_OWNER,
  CRM_MODULE_KV_ID,
  CRM_PACKAGE_LIFECYCLE,
  CRM_PACKAGE_LIFECYCLE_PHASES,
  CRM_REGISTRY_ID,
  type CrmPackageLifecyclePhase,
  isCrmPackageLifecyclePhase,
} from "./crm-authority.contract.js";
export {
  CRM_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  CRM_DOMAIN_VOCABULARY_POLICY,
  type CrmDomainProhibitedRuntimeSurface,
} from "./crm-domain-vocabulary.policy.js";
export {
  type assertCrmDomainVocabularyRegistryIntegrity,
  CRM_DOMAIN_AUDIT_VOCABULARY,
  CRM_DOMAIN_AUTHORITY_METADATA,
  CRM_DOMAIN_BRANDED_ID_TYPE_NAMES,
  CRM_DOMAIN_BRANDED_IDS,
  CRM_DOMAIN_CLOSED_VOCABULARIES,
  CRM_DOMAIN_PERMISSION_VOCABULARY,
  CRM_DOMAIN_VOCABULARY_REGISTRY,
  CRM_DOMAIN_VOCABULARY_REGISTRY_ID,
  CRM_DOMAIN_WIRE_CONTEXT,
  type CrmDomainBrandedIdEntry,
  type CrmDomainClosedVocabularyEntry,
  type CrmDomainVocabularyKind,
} from "./crm-domain-vocabulary.registry.js";
export type {
  assertCrmDomainWireContextJsonSerializable,
  CrmDomainWireContext,
} from "./crm-domain-wire-context.contract.js";
export {
  brandCampaignTouchpointId,
  brandLeadId,
  brandOpportunityId,
  type CampaignTouchpointId,
  type LeadId,
  type OpportunityId,
  toCampaignTouchpointId,
  toLeadId,
  toOpportunityId,
} from "./crm-id.contract.js";
export {
  CRM_PERMISSION_ACTIONS,
  CRM_PERMISSION_DOMAINS,
  CRM_PERMISSION_KEY_VOCABULARY,
  type CrmPermissionAction,
  type CrmPermissionDomain,
  type CrmPermissionKey,
  toCrmPermissionKey,
} from "./crm-permission-vocabulary.contract.js";
export {
  isLeadStatus,
  LEAD_STATUSES,
  type LeadStatus,
} from "./lead-status.contract.js";
export {
  isOpportunityStage,
  OPPORTUNITY_STAGES,
  type OpportunityStage,
} from "./opportunity-stage.contract.js";
