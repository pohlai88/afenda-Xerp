import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { DOWNTIME_CATEGORIES } from "./downtime-category.contract.js";

import {
  type isMaintenanceAuditAction,
  MAINTENANCE_AUDIT_ACTIONS,
} from "./maintenance-audit-actions.contract.js";
import {
  MAINTENANCE_PACKAGE_LIFECYCLE,
  MAINTENANCE_PACKAGE_LIFECYCLE_PHASES,
} from "./maintenance-authority.contract.js";
import { MAINTENANCE_ORDER_STATUSES } from "./maintenance-order-status.contract.js";
import { MAINTENANCE_ORDER_TYPES } from "./maintenance-order-type.contract.js";
import {
  MAINTENANCE_PERMISSION_DOMAINS,
  MAINTENANCE_PERMISSION_KEY_VOCABULARY,
} from "./maintenance-permission-vocabulary.contract.js";
import { MAINTENANCE_PRIORITIES } from "./maintenance-priority.contract.js";

export const MAINTENANCE_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-MAINTENANCE" as const;

export type MaintenanceDomainVocabularyKind = ErpDomainVocabularyKind;

export type MaintenanceDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export const MAINTENANCE_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "maintenance-order-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "maintenance-order-status.contract.ts",
    constantExport: "MAINTENANCE_ORDER_STATUSES",
    typeExport: "MaintenanceOrderStatus",
    narrowerExport: "isMaintenanceOrderStatus",
    valueCount: MAINTENANCE_ORDER_STATUSES.length,
  },
  {
    id: "maintenance-order-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "maintenance-order-type.contract.ts",
    constantExport: "MAINTENANCE_ORDER_TYPES",
    typeExport: "MaintenanceOrderType",
    narrowerExport: "isMaintenanceOrderType",
    valueCount: MAINTENANCE_ORDER_TYPES.length,
  },
  {
    id: "downtime-category",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "downtime-category.contract.ts",
    constantExport: "DOWNTIME_CATEGORIES",
    typeExport: "DowntimeCategory",
    narrowerExport: "isDowntimeCategory",
    valueCount: DOWNTIME_CATEGORIES.length,
  },
  {
    id: "maintenance-priority",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "maintenance-priority.contract.ts",
    constantExport: "MAINTENANCE_PRIORITIES",
    typeExport: "MaintenancePriority",
    narrowerExport: "isMaintenancePriority",
    valueCount: MAINTENANCE_PRIORITIES.length,
  },
] as const satisfies readonly MaintenanceDomainClosedVocabularyEntry[];

export type MaintenanceDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const MAINTENANCE_DOMAIN_BRANDED_IDS = [
  {
    typeName: "MaintenanceOrderId",
    brandFunction: "brandMaintenanceOrderId",
    toFunction: "toMaintenanceOrderId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "WorkRequestId",
    brandFunction: "brandWorkRequestId",
    toFunction: "toWorkRequestId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "EquipmentDowntimeId",
    brandFunction: "brandEquipmentDowntimeId",
    toFunction: "toEquipmentDowntimeId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly MaintenanceDomainBrandedIdEntry[];

export const MAINTENANCE_DOMAIN_BRANDED_ID_TYPE_NAMES =
  MAINTENANCE_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const MAINTENANCE_DOMAIN_WIRE_CONTEXT = {
  id: "maintenance-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "maintenance-domain-wire-context.contract.ts",
  typeExport: "MaintenanceDomainWireContext",
  assertExport: "assertMaintenanceDomainWireContextJsonSerializable",
} as const;

export const MAINTENANCE_DOMAIN_AUDIT_VOCABULARY = {
  id: "maintenance-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "maintenance-audit-actions.contract.ts",
  constantExport: "MAINTENANCE_AUDIT_ACTIONS",
  typeExport: "MaintenanceAuditAction",
  narrowerExport: "isMaintenanceAuditAction",
  valueCount: MAINTENANCE_AUDIT_ACTIONS.length,
} as const;

export const MAINTENANCE_DOMAIN_PERMISSION_VOCABULARY = {
  id: "maintenance-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "maintenance-permission-vocabulary.contract.ts",
  domainsExport: "MAINTENANCE_PERMISSION_DOMAINS",
  keysExport: "MAINTENANCE_PERMISSION_KEY_VOCABULARY",
  domainCount: MAINTENANCE_PERMISSION_DOMAINS.length,
  keyCount: MAINTENANCE_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const MAINTENANCE_DOMAIN_AUTHORITY_METADATA = {
  id: "maintenance-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "maintenance-authority.contract.ts",
  lifecycleExport: "MAINTENANCE_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "MAINTENANCE_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: MAINTENANCE_PACKAGE_LIFECYCLE,
  phaseCount: MAINTENANCE_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const MAINTENANCE_DOMAIN_VOCABULARY_REGISTRY = {
  id: MAINTENANCE_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: MAINTENANCE_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: MAINTENANCE_DOMAIN_BRANDED_IDS,
  wireContext: MAINTENANCE_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: MAINTENANCE_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: MAINTENANCE_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: MAINTENANCE_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof MAINTENANCE_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isMaintenanceAuditAction
  >[0]
    ? true
    : never;

export type assertMaintenanceDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
