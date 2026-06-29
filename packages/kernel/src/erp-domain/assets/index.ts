/**
 * PAS-001B B102 — assets ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/assets`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed assets-domain export surface.

export {
  ASSET_CLASSES,
  type AssetClass,
  isAssetClass,
} from "./asset-class.contract.js";
export {
  ASSET_STATUSES,
  type AssetStatus,
  isAssetStatus,
} from "./asset-status.contract.js";
export {
  ASSETS_AUDIT_ACTIONS,
  type AssetsAuditAction,
  isAssetsAuditAction,
  parseAssetsAuditAction,
} from "./assets-audit-actions.contract.js";
export {
  ASSETS_AUTHORITY_FINGERPRINT,
  ASSETS_AUTHORITY_PAS,
  ASSETS_CONTRACTS_OWNER,
  ASSETS_MODULE_KV_ID,
  ASSETS_PACKAGE_LIFECYCLE,
  ASSETS_PACKAGE_LIFECYCLE_PHASES,
  ASSETS_REGISTRY_ID,
  type AssetsPackageLifecyclePhase,
  isAssetsPackageLifecyclePhase,
} from "./assets-authority.contract.js";
export {
  ASSETS_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  ASSETS_DOMAIN_VOCABULARY_POLICY,
  type AssetsDomainProhibitedRuntimeSurface,
} from "./assets-domain-vocabulary.policy.js";
export {
  ASSETS_DOMAIN_AUDIT_VOCABULARY,
  ASSETS_DOMAIN_AUTHORITY_METADATA,
  ASSETS_DOMAIN_BRANDED_ID_TYPE_NAMES,
  ASSETS_DOMAIN_BRANDED_IDS,
  ASSETS_DOMAIN_CLOSED_VOCABULARIES,
  ASSETS_DOMAIN_PERMISSION_VOCABULARY,
  ASSETS_DOMAIN_VOCABULARY_REGISTRY,
  ASSETS_DOMAIN_VOCABULARY_REGISTRY_ID,
  ASSETS_DOMAIN_WIRE_CONTEXT,
  type AssetsDomainBrandedIdEntry,
  type AssetsDomainClosedVocabularyEntry,
  type AssetsDomainVocabularyKind,
  type assertAssetsDomainVocabularyRegistryIntegrity,
} from "./assets-domain-vocabulary.registry.js";
export type {
  AssetsDomainWireContext,
  assertAssetsDomainWireContextJsonSerializable,
} from "./assets-domain-wire-context.contract.js";
export {
  type AssetTransferId,
  brandAssetTransferId,
  brandDepreciationRunId,
  brandFixedAssetId,
  type DepreciationRunId,
  type FixedAssetId,
  toAssetTransferId,
  toDepreciationRunId,
  toFixedAssetId,
} from "./assets-id.contract.js";
export {
  ASSETS_PERMISSION_ACTIONS,
  ASSETS_PERMISSION_DOMAINS,
  ASSETS_PERMISSION_KEY_VOCABULARY,
  type AssetsPermissionAction,
  type AssetsPermissionDomain,
  type AssetsPermissionKey,
  toAssetsPermissionKey,
} from "./assets-permission-vocabulary.contract.js";
export {
  DEPRECIATION_METHODS,
  type DepreciationMethod,
  isDepreciationMethod,
} from "./depreciation-method.contract.js";
export {
  isTransferType,
  TRANSFER_TYPES,
  type TransferType,
} from "./transfer-type.contract.js";
