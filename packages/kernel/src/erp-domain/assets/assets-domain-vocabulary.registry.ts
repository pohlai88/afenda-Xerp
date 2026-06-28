import { ASSET_CLASSES } from "./asset-class.contract.js";
import { ASSET_STATUSES } from "./asset-status.contract.js";
import {
  ASSETS_AUDIT_ACTIONS,
  type isAssetsAuditAction,
} from "./assets-audit-actions.contract.js";
import {
  ASSETS_PACKAGE_LIFECYCLE,
  ASSETS_PACKAGE_LIFECYCLE_PHASES,
} from "./assets-authority.contract.js";
import {
  ASSETS_PERMISSION_DOMAINS,
  ASSETS_PERMISSION_KEY_VOCABULARY,
} from "./assets-permission-vocabulary.contract.js";
import { DEPRECIATION_METHODS } from "./depreciation-method.contract.js";
import { TRANSFER_TYPES } from "./transfer-type.contract.js";

export const ASSETS_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-ASSETS" as const;

export type AssetsDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface AssetsDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export const ASSETS_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "asset-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "asset-status.contract.ts",
    constantExport: "ASSET_STATUSES",
    typeExport: "AssetStatus",
    narrowerExport: "isAssetStatus",
    valueCount: ASSET_STATUSES.length,
  },
  {
    id: "depreciation-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "depreciation-method.contract.ts",
    constantExport: "DEPRECIATION_METHODS",
    typeExport: "DepreciationMethod",
    narrowerExport: "isDepreciationMethod",
    valueCount: DEPRECIATION_METHODS.length,
  },
  {
    id: "asset-class",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "asset-class.contract.ts",
    constantExport: "ASSET_CLASSES",
    typeExport: "AssetClass",
    narrowerExport: "isAssetClass",
    valueCount: ASSET_CLASSES.length,
  },
  {
    id: "transfer-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "transfer-type.contract.ts",
    constantExport: "TRANSFER_TYPES",
    typeExport: "TransferType",
    narrowerExport: "isTransferType",
    valueCount: TRANSFER_TYPES.length,
  },
] as const satisfies readonly AssetsDomainClosedVocabularyEntry[];

export interface AssetsDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const ASSETS_DOMAIN_BRANDED_IDS = [
  {
    typeName: "FixedAssetId",
    brandFunction: "brandFixedAssetId",
    toFunction: "toFixedAssetId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "DepreciationRunId",
    brandFunction: "brandDepreciationRunId",
    toFunction: "toDepreciationRunId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "AssetTransferId",
    brandFunction: "brandAssetTransferId",
    toFunction: "toAssetTransferId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly AssetsDomainBrandedIdEntry[];

export const ASSETS_DOMAIN_BRANDED_ID_TYPE_NAMES =
  ASSETS_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const ASSETS_DOMAIN_WIRE_CONTEXT = {
  id: "assets-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "assets-domain-wire-context.contract.ts",
  typeExport: "AssetsDomainWireContext",
  assertExport: "assertAssetsDomainWireContextJsonSerializable",
} as const;

export const ASSETS_DOMAIN_AUDIT_VOCABULARY = {
  id: "assets-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "assets-audit-actions.contract.ts",
  constantExport: "ASSETS_AUDIT_ACTIONS",
  typeExport: "AssetsAuditAction",
  narrowerExport: "isAssetsAuditAction",
  valueCount: ASSETS_AUDIT_ACTIONS.length,
} as const;

export const ASSETS_DOMAIN_PERMISSION_VOCABULARY = {
  id: "assets-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "assets-permission-vocabulary.contract.ts",
  domainsExport: "ASSETS_PERMISSION_DOMAINS",
  keysExport: "ASSETS_PERMISSION_KEY_VOCABULARY",
  domainCount: ASSETS_PERMISSION_DOMAINS.length,
  keyCount: ASSETS_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const ASSETS_DOMAIN_AUTHORITY_METADATA = {
  id: "assets-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "assets-authority.contract.ts",
  lifecycleExport: "ASSETS_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "ASSETS_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: ASSETS_PACKAGE_LIFECYCLE,
  phaseCount: ASSETS_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const ASSETS_DOMAIN_VOCABULARY_REGISTRY = {
  id: ASSETS_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: ASSETS_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: ASSETS_DOMAIN_BRANDED_IDS,
  wireContext: ASSETS_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: ASSETS_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: ASSETS_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: ASSETS_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof ASSETS_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isAssetsAuditAction
  >[0]
    ? true
    : never;

export type assertAssetsDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
