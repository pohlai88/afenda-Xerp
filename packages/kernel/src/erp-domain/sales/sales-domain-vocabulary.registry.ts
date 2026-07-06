import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { PRICING_CONTEXTS } from "./pricing-context.contract.js";

import { QUOTE_STATUSES } from "./quote-status.contract.js";
import {
  type isSalesAuditAction,
  SALES_AUDIT_ACTIONS,
} from "./sales-audit-actions.contract.js";
import {
  SALES_PACKAGE_LIFECYCLE,
  SALES_PACKAGE_LIFECYCLE_PHASES,
} from "./sales-authority.contract.js";
import { SALES_DOCUMENT_TYPES } from "./sales-document-type.contract.js";
import { SALES_ORDER_STATUSES } from "./sales-order-status.contract.js";
import {
  SALES_PERMISSION_DOMAINS,
  SALES_PERMISSION_KEY_VOCABULARY,
} from "./sales-permission-vocabulary.contract.js";

export const SALES_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-SALES" as const;

export type SalesDomainVocabularyKind = ErpDomainVocabularyKind;

export type SalesDomainClosedVocabularyEntry = ErpDomainClosedVocabularyEntry;

export const SALES_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "order-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "sales-order-status.contract.ts",
    constantExport: "SALES_ORDER_STATUSES",
    typeExport: "SalesOrderStatus",
    narrowerExport: "isSalesOrderStatus",
    valueCount: SALES_ORDER_STATUSES.length,
  },
  {
    id: "quote-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "quote-status.contract.ts",
    constantExport: "QUOTE_STATUSES",
    typeExport: "QuoteStatus",
    narrowerExport: "isQuoteStatus",
    valueCount: QUOTE_STATUSES.length,
  },
  {
    id: "sales-document-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "sales-document-type.contract.ts",
    constantExport: "SALES_DOCUMENT_TYPES",
    typeExport: "SalesDocumentType",
    narrowerExport: "isSalesDocumentType",
    valueCount: SALES_DOCUMENT_TYPES.length,
  },
  {
    id: "pricing-context",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "pricing-context.contract.ts",
    constantExport: "PRICING_CONTEXTS",
    typeExport: "PricingContext",
    narrowerExport: "isPricingContext",
    valueCount: PRICING_CONTEXTS.length,
  },
] as const satisfies readonly SalesDomainClosedVocabularyEntry[];

export type SalesDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const SALES_DOMAIN_BRANDED_IDS = [
  {
    typeName: "SalesOrderId",
    brandFunction: "brandSalesOrderId",
    toFunction: "toSalesOrderId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "QuoteId",
    brandFunction: "brandQuoteId",
    toFunction: "toQuoteId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "DeliveryScheduleId",
    brandFunction: "brandDeliveryScheduleId",
    toFunction: "toDeliveryScheduleId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly SalesDomainBrandedIdEntry[];

export const SALES_DOMAIN_BRANDED_ID_TYPE_NAMES = SALES_DOMAIN_BRANDED_IDS.map(
  (entry) => entry.typeName
);

export const SALES_DOMAIN_WIRE_CONTEXT = {
  id: "sales-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "sales-domain-wire-context.contract.ts",
  typeExport: "SalesDomainWireContext",
  assertExport: "assertSalesDomainWireContextJsonSerializable",
} as const;

export const SALES_DOMAIN_AUDIT_VOCABULARY = {
  id: "sales-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "sales-audit-actions.contract.ts",
  constantExport: "SALES_AUDIT_ACTIONS",
  typeExport: "SalesAuditAction",
  narrowerExport: "isSalesAuditAction",
  valueCount: SALES_AUDIT_ACTIONS.length,
} as const;

export const SALES_DOMAIN_PERMISSION_VOCABULARY = {
  id: "sales-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "sales-permission-vocabulary.contract.ts",
  domainsExport: "SALES_PERMISSION_DOMAINS",
  keysExport: "SALES_PERMISSION_KEY_VOCABULARY",
  domainCount: SALES_PERMISSION_DOMAINS.length,
  keyCount: SALES_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const SALES_DOMAIN_AUTHORITY_METADATA = {
  id: "sales-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "sales-authority.contract.ts",
  lifecycleExport: "SALES_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "SALES_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: SALES_PACKAGE_LIFECYCLE,
  phaseCount: SALES_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const SALES_DOMAIN_VOCABULARY_REGISTRY = {
  id: SALES_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: SALES_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: SALES_DOMAIN_BRANDED_IDS,
  wireContext: SALES_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: SALES_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: SALES_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: SALES_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof SALES_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isSalesAuditAction
  >[0]
    ? true
    : never;

export type assertSalesDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
