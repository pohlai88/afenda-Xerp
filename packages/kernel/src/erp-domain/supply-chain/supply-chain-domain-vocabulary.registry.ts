import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { DELIVERY_PRIORITIES } from "./delivery-priority.contract.js";

import { FULFILLMENT_EVENT_TYPES } from "./fulfillment-event-type.contract.js";
import { SHIPMENT_STATUSES } from "./shipment-status.contract.js";
import {
  type isSupplyChainAuditAction,
  SUPPLY_CHAIN_AUDIT_ACTIONS,
} from "./supply-chain-audit-actions.contract.js";
import {
  SUPPLY_CHAIN_PACKAGE_LIFECYCLE,
  SUPPLY_CHAIN_PACKAGE_LIFECYCLE_PHASES,
} from "./supply-chain-authority.contract.js";
import {
  SUPPLY_CHAIN_PERMISSION_DOMAINS,
  SUPPLY_CHAIN_PERMISSION_KEY_VOCABULARY,
} from "./supply-chain-permission-vocabulary.contract.js";
import { TRANSPORT_MODES } from "./transport-mode.contract.js";

export const SUPPLY_CHAIN_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-SUPPLY_CHAIN" as const;

export type SupplyChainDomainVocabularyKind = ErpDomainVocabularyKind;

export type SupplyChainDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export const SUPPLY_CHAIN_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "shipment-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "shipment-status.contract.ts",
    constantExport: "SHIPMENT_STATUSES",
    typeExport: "ShipmentStatus",
    narrowerExport: "isShipmentStatus",
    valueCount: SHIPMENT_STATUSES.length,
  },
  {
    id: "delivery-priority",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "delivery-priority.contract.ts",
    constantExport: "DELIVERY_PRIORITIES",
    typeExport: "DeliveryPriority",
    narrowerExport: "isDeliveryPriority",
    valueCount: DELIVERY_PRIORITIES.length,
  },
  {
    id: "transport-mode",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "transport-mode.contract.ts",
    constantExport: "TRANSPORT_MODES",
    typeExport: "TransportMode",
    narrowerExport: "isTransportMode",
    valueCount: TRANSPORT_MODES.length,
  },
  {
    id: "fulfillment-event-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "fulfillment-event-type.contract.ts",
    constantExport: "FULFILLMENT_EVENT_TYPES",
    typeExport: "FulfillmentEventType",
    narrowerExport: "isFulfillmentEventType",
    valueCount: FULFILLMENT_EVENT_TYPES.length,
  },
] as const satisfies readonly SupplyChainDomainClosedVocabularyEntry[];

export type SupplyChainDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const SUPPLY_CHAIN_DOMAIN_BRANDED_IDS = [
  {
    typeName: "ShipmentId",
    brandFunction: "brandShipmentId",
    toFunction: "toShipmentId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "DeliveryRunId",
    brandFunction: "brandDeliveryRunId",
    toFunction: "toDeliveryRunId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "TransportLegId",
    brandFunction: "brandTransportLegId",
    toFunction: "toTransportLegId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly SupplyChainDomainBrandedIdEntry[];

export const SUPPLY_CHAIN_DOMAIN_BRANDED_ID_TYPE_NAMES =
  SUPPLY_CHAIN_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const SUPPLY_CHAIN_DOMAIN_WIRE_CONTEXT = {
  id: "supply-chain-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "supply-chain-domain-wire-context.contract.ts",
  typeExport: "SupplyChainDomainWireContext",
  assertExport: "assertSupplyChainDomainWireContextJsonSerializable",
} as const;

export const SUPPLY_CHAIN_DOMAIN_AUDIT_VOCABULARY = {
  id: "supply-chain-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "supply-chain-audit-actions.contract.ts",
  constantExport: "SUPPLY_CHAIN_AUDIT_ACTIONS",
  typeExport: "SupplyChainAuditAction",
  narrowerExport: "isSupplyChainAuditAction",
  valueCount: SUPPLY_CHAIN_AUDIT_ACTIONS.length,
} as const;

export const SUPPLY_CHAIN_DOMAIN_PERMISSION_VOCABULARY = {
  id: "supply-chain-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "supply-chain-permission-vocabulary.contract.ts",
  domainsExport: "SUPPLY_CHAIN_PERMISSION_DOMAINS",
  keysExport: "SUPPLY_CHAIN_PERMISSION_KEY_VOCABULARY",
  domainCount: SUPPLY_CHAIN_PERMISSION_DOMAINS.length,
  keyCount: SUPPLY_CHAIN_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const SUPPLY_CHAIN_DOMAIN_AUTHORITY_METADATA = {
  id: "supply-chain-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "supply-chain-authority.contract.ts",
  lifecycleExport: "SUPPLY_CHAIN_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "SUPPLY_CHAIN_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: SUPPLY_CHAIN_PACKAGE_LIFECYCLE,
  phaseCount: SUPPLY_CHAIN_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const SUPPLY_CHAIN_DOMAIN_VOCABULARY_REGISTRY = {
  id: SUPPLY_CHAIN_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: SUPPLY_CHAIN_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: SUPPLY_CHAIN_DOMAIN_BRANDED_IDS,
  wireContext: SUPPLY_CHAIN_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: SUPPLY_CHAIN_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: SUPPLY_CHAIN_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: SUPPLY_CHAIN_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof SUPPLY_CHAIN_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isSupplyChainAuditAction
  >[0]
    ? true
    : never;

export type assertSupplyChainDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
