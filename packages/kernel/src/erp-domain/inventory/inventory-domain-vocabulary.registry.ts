import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import {
  INVENTORY_AUDIT_ACTIONS,
  type isInventoryAuditAction,
} from "./inventory-audit-actions.contract.js";
import {
  INVENTORY_PACKAGE_LIFECYCLE,
  INVENTORY_PACKAGE_LIFECYCLE_PHASES,
} from "./inventory-authority.contract.js";
import {
  INVENTORY_PERMISSION_DOMAINS,
  INVENTORY_PERMISSION_KEY_VOCABULARY,
} from "./inventory-permission-vocabulary.contract.js";
import { INVENTORY_RECORD_STATUSES } from "./inventory-record-status.contract.js";
import { STOCK_MOVEMENT_TYPES } from "./stock-movement-type.contract.js";
import { STOCK_RESERVATION_STATUSES } from "./stock-reservation-status.contract.js";
import { VALUATION_METHODS } from "./valuation-method.contract.js";

export const INVENTORY_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-INVENTORY" as const;

export type InventoryDomainVocabularyKind = ErpDomainVocabularyKind;

export type InventoryDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export type InventoryDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const INVENTORY_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "stock-movement-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "stock-movement-type.contract.ts",
    constantExport: "STOCK_MOVEMENT_TYPES",
    typeExport: "StockMovementType",
    narrowerExport: "isStockMovementType",
    valueCount: STOCK_MOVEMENT_TYPES.length,
  },
  {
    id: "inventory-record-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "inventory-record-status.contract.ts",
    constantExport: "INVENTORY_RECORD_STATUSES",
    typeExport: "InventoryRecordStatus",
    narrowerExport: "isInventoryRecordStatus",
    valueCount: INVENTORY_RECORD_STATUSES.length,
  },
  {
    id: "stock-reservation-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "stock-reservation-status.contract.ts",
    constantExport: "STOCK_RESERVATION_STATUSES",
    typeExport: "StockReservationStatus",
    narrowerExport: "isStockReservationStatus",
    valueCount: STOCK_RESERVATION_STATUSES.length,
  },
  {
    id: "valuation-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "valuation-method.contract.ts",
    constantExport: "VALUATION_METHODS",
    typeExport: "ValuationMethod",
    narrowerExport: "isValuationMethod",
    valueCount: VALUATION_METHODS.length,
  },
] as const satisfies readonly InventoryDomainClosedVocabularyEntry[];

export const INVENTORY_DOMAIN_BRANDED_IDS = [
  {
    typeName: "StockMovementId",
    brandFunction: "brandStockMovementId",
    toFunction: "toStockMovementId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "StockAdjustmentId",
    brandFunction: "brandStockAdjustmentId",
    toFunction: "toStockAdjustmentId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "InventoryCountSessionId",
    brandFunction: "brandInventoryCountSessionId",
    toFunction: "toInventoryCountSessionId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly InventoryDomainBrandedIdEntry[];

export const INVENTORY_DOMAIN_BRANDED_ID_TYPE_NAMES =
  INVENTORY_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const INVENTORY_DOMAIN_WIRE_CONTEXT = {
  id: "inventory-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "inventory-domain-wire-context.contract.ts",
  typeExport: "InventoryDomainWireContext",
  assertExport: "assertInventoryDomainWireContextJsonSerializable",
} as const;

export const INVENTORY_DOMAIN_AUDIT_VOCABULARY = {
  id: "inventory-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "inventory-audit-actions.contract.ts",
  constantExport: "INVENTORY_AUDIT_ACTIONS",
  typeExport: "InventoryAuditAction",
  narrowerExport: "isInventoryAuditAction",
  valueCount: INVENTORY_AUDIT_ACTIONS.length,
} as const;

export const INVENTORY_DOMAIN_PERMISSION_VOCABULARY = {
  id: "inventory-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "inventory-permission-vocabulary.contract.ts",
  domainsExport: "INVENTORY_PERMISSION_DOMAINS",
  keysExport: "INVENTORY_PERMISSION_KEY_VOCABULARY",
  domainCount: INVENTORY_PERMISSION_DOMAINS.length,
  keyCount: INVENTORY_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const INVENTORY_DOMAIN_AUTHORITY_METADATA = {
  id: "inventory-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "inventory-authority.contract.ts",
  lifecycleExport: "INVENTORY_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "INVENTORY_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: INVENTORY_PACKAGE_LIFECYCLE,
  phaseCount: INVENTORY_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const INVENTORY_DOMAIN_VOCABULARY_REGISTRY = {
  id: INVENTORY_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: INVENTORY_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: INVENTORY_DOMAIN_BRANDED_IDS,
  wireContext: INVENTORY_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: INVENTORY_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: INVENTORY_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: INVENTORY_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof INVENTORY_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isInventoryAuditAction
  >[0]
    ? true
    : never;

export type assertInventoryDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
