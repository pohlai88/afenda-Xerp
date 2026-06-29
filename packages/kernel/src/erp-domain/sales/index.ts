/**
 * PAS-001B B90 — sales ERP domain vocabulary (contracts-only).
 * Public surface: `@afenda/kernel/erp-domain/sales`.
 */
// biome-ignore-all lint/performance/noBarrelFile: governed sales-domain export surface.

export {
  isPricingContext,
  PRICING_CONTEXTS,
  type PricingContext,
} from "./pricing-context.contract.js";
export {
  isQuoteStatus,
  QUOTE_STATUSES,
  type QuoteStatus,
} from "./quote-status.contract.js";
export {
  isSalesAuditAction,
  parseSalesAuditAction,
  SALES_AUDIT_ACTIONS,
  type SalesAuditAction,
} from "./sales-audit-actions.contract.js";
export {
  isSalesPackageLifecyclePhase,
  SALES_AUTHORITY_FINGERPRINT,
  SALES_AUTHORITY_PAS,
  SALES_CONTRACTS_OWNER,
  SALES_MODULE_KV_ID,
  SALES_PACKAGE_LIFECYCLE,
  SALES_PACKAGE_LIFECYCLE_PHASES,
  SALES_REGISTRY_ID,
  type SalesPackageLifecyclePhase,
} from "./sales-authority.contract.js";
export {
  isSalesDocumentType,
  SALES_DOCUMENT_TYPES,
  type SalesDocumentType,
} from "./sales-document-type.contract.js";
export {
  SALES_DOMAIN_PROHIBITED_RUNTIME_SURFACES,
  SALES_DOMAIN_VOCABULARY_POLICY,
  type SalesDomainProhibitedRuntimeSurface,
} from "./sales-domain-vocabulary.policy.js";
export {
  type assertSalesDomainVocabularyRegistryIntegrity,
  SALES_DOMAIN_AUDIT_VOCABULARY,
  SALES_DOMAIN_AUTHORITY_METADATA,
  SALES_DOMAIN_BRANDED_ID_TYPE_NAMES,
  SALES_DOMAIN_BRANDED_IDS,
  SALES_DOMAIN_CLOSED_VOCABULARIES,
  SALES_DOMAIN_PERMISSION_VOCABULARY,
  SALES_DOMAIN_VOCABULARY_REGISTRY,
  SALES_DOMAIN_VOCABULARY_REGISTRY_ID,
  SALES_DOMAIN_WIRE_CONTEXT,
  type SalesDomainBrandedIdEntry,
  type SalesDomainClosedVocabularyEntry,
  type SalesDomainVocabularyKind,
} from "./sales-domain-vocabulary.registry.js";
export type {
  assertSalesDomainWireContextJsonSerializable,
  SalesDomainWireContext,
} from "./sales-domain-wire-context.contract.js";
export {
  brandDeliveryScheduleId,
  brandQuoteId,
  brandSalesOrderId,
  type DeliveryScheduleId,
  type QuoteId,
  type SalesOrderId,
  toDeliveryScheduleId,
  toQuoteId,
  toSalesOrderId,
} from "./sales-id.contract.js";
export {
  isSalesOrderStatus,
  SALES_ORDER_STATUSES,
  type SalesOrderStatus,
} from "./sales-order-status.contract.js";
export {
  SALES_PERMISSION_ACTIONS,
  SALES_PERMISSION_DOMAINS,
  SALES_PERMISSION_KEY_VOCABULARY,
  type SalesPermissionAction,
  type SalesPermissionDomain,
  type SalesPermissionKey,
  toSalesPermissionKey,
} from "./sales-permission-vocabulary.contract.js";
