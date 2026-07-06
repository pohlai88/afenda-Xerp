import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { CAPACITY_PLANNING_METHODS } from "./capacity-planning-method.contract.js";

import {
  type isManufacturingAuditAction,
  MANUFACTURING_AUDIT_ACTIONS,
} from "./manufacturing-audit-actions.contract.js";
import {
  MANUFACTURING_PACKAGE_LIFECYCLE,
  MANUFACTURING_PACKAGE_LIFECYCLE_PHASES,
} from "./manufacturing-authority.contract.js";
import { MANUFACTURING_ORDER_TYPES } from "./manufacturing-order-type.contract.js";
import {
  MANUFACTURING_PERMISSION_DOMAINS,
  MANUFACTURING_PERMISSION_KEY_VOCABULARY,
} from "./manufacturing-permission-vocabulary.contract.js";
import { PRODUCTION_ORDER_STATUSES } from "./production-order-status.contract.js";
import { SHOP_FLOOR_EVENT_TYPES } from "./shop-floor-event-type.contract.js";

export const MANUFACTURING_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-MANUFACTURING" as const;

export type ManufacturingDomainVocabularyKind = ErpDomainVocabularyKind;

export type ManufacturingDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export const MANUFACTURING_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "production-order-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "production-order-status.contract.ts",
    constantExport: "PRODUCTION_ORDER_STATUSES",
    typeExport: "ProductionOrderStatus",
    narrowerExport: "isProductionOrderStatus",
    valueCount: PRODUCTION_ORDER_STATUSES.length,
  },
  {
    id: "manufacturing-order-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "manufacturing-order-type.contract.ts",
    constantExport: "MANUFACTURING_ORDER_TYPES",
    typeExport: "ManufacturingOrderType",
    narrowerExport: "isManufacturingOrderType",
    valueCount: MANUFACTURING_ORDER_TYPES.length,
  },
  {
    id: "capacity-planning-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "capacity-planning-method.contract.ts",
    constantExport: "CAPACITY_PLANNING_METHODS",
    typeExport: "CapacityPlanningMethod",
    narrowerExport: "isCapacityPlanningMethod",
    valueCount: CAPACITY_PLANNING_METHODS.length,
  },
  {
    id: "shop-floor-event-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "shop-floor-event-type.contract.ts",
    constantExport: "SHOP_FLOOR_EVENT_TYPES",
    typeExport: "ShopFloorEventType",
    narrowerExport: "isShopFloorEventType",
    valueCount: SHOP_FLOOR_EVENT_TYPES.length,
  },
] as const satisfies readonly ManufacturingDomainClosedVocabularyEntry[];

export type ManufacturingDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const MANUFACTURING_DOMAIN_BRANDED_IDS = [
  {
    typeName: "ProductionOrderId",
    brandFunction: "brandProductionOrderId",
    toFunction: "toProductionOrderId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "RoutingId",
    brandFunction: "brandRoutingId",
    toFunction: "toRoutingId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "ProductionRunId",
    brandFunction: "brandProductionRunId",
    toFunction: "toProductionRunId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly ManufacturingDomainBrandedIdEntry[];

export const MANUFACTURING_DOMAIN_BRANDED_ID_TYPE_NAMES =
  MANUFACTURING_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const MANUFACTURING_DOMAIN_WIRE_CONTEXT = {
  id: "manufacturing-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "manufacturing-domain-wire-context.contract.ts",
  typeExport: "ManufacturingDomainWireContext",
  assertExport: "assertManufacturingDomainWireContextJsonSerializable",
} as const;

export const MANUFACTURING_DOMAIN_AUDIT_VOCABULARY = {
  id: "manufacturing-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "manufacturing-audit-actions.contract.ts",
  constantExport: "MANUFACTURING_AUDIT_ACTIONS",
  typeExport: "ManufacturingAuditAction",
  narrowerExport: "isManufacturingAuditAction",
  valueCount: MANUFACTURING_AUDIT_ACTIONS.length,
} as const;

export const MANUFACTURING_DOMAIN_PERMISSION_VOCABULARY = {
  id: "manufacturing-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "manufacturing-permission-vocabulary.contract.ts",
  domainsExport: "MANUFACTURING_PERMISSION_DOMAINS",
  keysExport: "MANUFACTURING_PERMISSION_KEY_VOCABULARY",
  domainCount: MANUFACTURING_PERMISSION_DOMAINS.length,
  keyCount: MANUFACTURING_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const MANUFACTURING_DOMAIN_AUTHORITY_METADATA = {
  id: "manufacturing-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "manufacturing-authority.contract.ts",
  lifecycleExport: "MANUFACTURING_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "MANUFACTURING_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: MANUFACTURING_PACKAGE_LIFECYCLE,
  phaseCount: MANUFACTURING_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const MANUFACTURING_DOMAIN_VOCABULARY_REGISTRY = {
  id: MANUFACTURING_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: MANUFACTURING_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: MANUFACTURING_DOMAIN_BRANDED_IDS,
  wireContext: MANUFACTURING_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: MANUFACTURING_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: MANUFACTURING_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: MANUFACTURING_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof MANUFACTURING_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isManufacturingAuditAction
  >[0]
    ? true
    : never;

export type assertManufacturingDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
