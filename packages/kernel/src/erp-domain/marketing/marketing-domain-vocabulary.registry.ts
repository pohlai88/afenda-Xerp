import { ATTRIBUTION_MODELS } from "./attribution-model.contract.js";
import { CAMPAIGN_CHANNELS } from "./campaign-channel.contract.js";
import { CAMPAIGN_STATUSES } from "./campaign-status.contract.js";
import {
  type isMarketingAuditAction,
  MARKETING_AUDIT_ACTIONS,
} from "./marketing-audit-actions.contract.js";
import {
  MARKETING_PACKAGE_LIFECYCLE,
  MARKETING_PACKAGE_LIFECYCLE_PHASES,
} from "./marketing-authority.contract.js";
import {
  MARKETING_PERMISSION_DOMAINS,
  MARKETING_PERMISSION_KEY_VOCABULARY,
} from "./marketing-permission-vocabulary.contract.js";
import { SEGMENT_TYPES } from "./segment-type.contract.js";

export const MARKETING_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-MARKETING" as const;

export type MarketingDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface MarketingDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export const MARKETING_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "campaign-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "campaign-status.contract.ts",
    constantExport: "CAMPAIGN_STATUSES",
    typeExport: "CampaignStatus",
    narrowerExport: "isCampaignStatus",
    valueCount: CAMPAIGN_STATUSES.length,
  },
  {
    id: "campaign-channel",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "campaign-channel.contract.ts",
    constantExport: "CAMPAIGN_CHANNELS",
    typeExport: "CampaignChannel",
    narrowerExport: "isCampaignChannel",
    valueCount: CAMPAIGN_CHANNELS.length,
  },
  {
    id: "segment-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "segment-type.contract.ts",
    constantExport: "SEGMENT_TYPES",
    typeExport: "SegmentType",
    narrowerExport: "isSegmentType",
    valueCount: SEGMENT_TYPES.length,
  },
  {
    id: "attribution-model",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "attribution-model.contract.ts",
    constantExport: "ATTRIBUTION_MODELS",
    typeExport: "AttributionModel",
    narrowerExport: "isAttributionModel",
    valueCount: ATTRIBUTION_MODELS.length,
  },
] as const satisfies readonly MarketingDomainClosedVocabularyEntry[];

export interface MarketingDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const MARKETING_DOMAIN_BRANDED_IDS = [
  {
    typeName: "MarketingCampaignId",
    brandFunction: "brandMarketingCampaignId",
    toFunction: "toMarketingCampaignId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "AudienceSegmentId",
    brandFunction: "brandAudienceSegmentId",
    toFunction: "toAudienceSegmentId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "ContentVariantId",
    brandFunction: "brandContentVariantId",
    toFunction: "toContentVariantId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly MarketingDomainBrandedIdEntry[];

export const MARKETING_DOMAIN_BRANDED_ID_TYPE_NAMES =
  MARKETING_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const MARKETING_DOMAIN_WIRE_CONTEXT = {
  id: "marketing-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "marketing-domain-wire-context.contract.ts",
  typeExport: "MarketingDomainWireContext",
  assertExport: "assertMarketingDomainWireContextJsonSerializable",
} as const;

export const MARKETING_DOMAIN_AUDIT_VOCABULARY = {
  id: "marketing-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "marketing-audit-actions.contract.ts",
  constantExport: "MARKETING_AUDIT_ACTIONS",
  typeExport: "MarketingAuditAction",
  narrowerExport: "isMarketingAuditAction",
  valueCount: MARKETING_AUDIT_ACTIONS.length,
} as const;

export const MARKETING_DOMAIN_PERMISSION_VOCABULARY = {
  id: "marketing-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "marketing-permission-vocabulary.contract.ts",
  domainsExport: "MARKETING_PERMISSION_DOMAINS",
  keysExport: "MARKETING_PERMISSION_KEY_VOCABULARY",
  domainCount: MARKETING_PERMISSION_DOMAINS.length,
  keyCount: MARKETING_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const MARKETING_DOMAIN_AUTHORITY_METADATA = {
  id: "marketing-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "marketing-authority.contract.ts",
  lifecycleExport: "MARKETING_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "MARKETING_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: MARKETING_PACKAGE_LIFECYCLE,
  phaseCount: MARKETING_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const MARKETING_DOMAIN_VOCABULARY_REGISTRY = {
  id: MARKETING_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: MARKETING_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: MARKETING_DOMAIN_BRANDED_IDS,
  wireContext: MARKETING_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: MARKETING_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: MARKETING_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: MARKETING_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof MARKETING_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isMarketingAuditAction
  >[0]
    ? true
    : never;

export type assertMarketingDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
