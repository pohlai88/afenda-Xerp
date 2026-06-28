/**
 * PAS-001B B89 — supply-chain ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/supply-chain`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed supply-chain-domain export surface.

export {
  DELIVERY_PRIORITIES,
  type DeliveryPriority,
  isDeliveryPriority,
} from "./delivery-priority.contract.js";
export {
  FULFILLMENT_EVENT_TYPES,
  type FulfillmentEventType,
  isFulfillmentEventType,
} from "./fulfillment-event-type.contract.js";
export {
  isShipmentStatus,
  SHIPMENT_STATUSES,
  type ShipmentStatus,
} from "./shipment-status.contract.js";
export {
  isSupplyChainAuditAction,
  parseSupplyChainAuditAction,
  SUPPLY_CHAIN_AUDIT_ACTIONS,
  type SupplyChainAuditAction,
} from "./supply-chain-audit-actions.contract.js";
export {
  isSupplyChainPackageLifecyclePhase,
  SUPPLY_CHAIN_AUTHORITY_FINGERPRINT,
  SUPPLY_CHAIN_AUTHORITY_PAS,
  SUPPLY_CHAIN_CONTRACTS_OWNER,
  SUPPLY_CHAIN_PACKAGE_LIFECYCLE,
  SUPPLY_CHAIN_PACKAGE_LIFECYCLE_PHASES,
  SUPPLY_CHAIN_REGISTRY_ID,
  type SupplyChainPackageLifecyclePhase,
} from "./supply-chain-authority.contract.js";
export {
  SUPPLY_CHAIN_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  SUPPLY_CHAIN_DOMAIN_VOCABULARY_POLICY,
  type SupplyChainDomainProhibitedRuntimeSurface,
} from "./supply-chain-domain-vocabulary.policy.js";
export {
  type assertSupplyChainDomainVocabularyRegistryIntegrity,
  SUPPLY_CHAIN_DOMAIN_AUDIT_VOCABULARY,
  SUPPLY_CHAIN_DOMAIN_AUTHORITY_METADATA,
  SUPPLY_CHAIN_DOMAIN_BRANDED_ID_TYPE_NAMES,
  SUPPLY_CHAIN_DOMAIN_BRANDED_IDS,
  SUPPLY_CHAIN_DOMAIN_CLOSED_VOCABULARIES,
  SUPPLY_CHAIN_DOMAIN_PERMISSION_VOCABULARY,
  SUPPLY_CHAIN_DOMAIN_VOCABULARY_REGISTRY,
  SUPPLY_CHAIN_DOMAIN_VOCABULARY_REGISTRY_ID,
  SUPPLY_CHAIN_DOMAIN_WIRE_CONTEXT,
  type SupplyChainDomainBrandedIdEntry,
  type SupplyChainDomainClosedVocabularyEntry,
  type SupplyChainDomainVocabularyKind,
} from "./supply-chain-domain-vocabulary.registry.js";
export type {
  assertSupplyChainDomainWireContextJsonSerializable,
  SupplyChainDomainWireContext,
} from "./supply-chain-domain-wire-context.contract.js";
export {
  brandDeliveryRunId,
  brandShipmentId,
  brandTransportLegId,
  type DeliveryRunId,
  type ShipmentId,
  type TransportLegId,
  toDeliveryRunId,
  toShipmentId,
  toTransportLegId,
} from "./supply-chain-id.contract.js";
export {
  SUPPLY_CHAIN_PERMISSION_ACTIONS,
  SUPPLY_CHAIN_PERMISSION_DOMAINS,
  SUPPLY_CHAIN_PERMISSION_KEY_VOCABULARY,
  type SupplyChainPermissionAction,
  type SupplyChainPermissionDomain,
  type SupplyChainPermissionKey,
  toSupplyChainPermissionKey,
} from "./supply-chain-permission-vocabulary.contract.js";
export {
  isTransportMode,
  TRANSPORT_MODES,
  type TransportMode,
} from "./transport-mode.contract.js";
