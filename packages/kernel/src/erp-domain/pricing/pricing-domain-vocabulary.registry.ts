import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { DISCOUNT_TYPES } from "./discount-type.contract.js";

import { PRICE_APPROVAL_STATUSES } from "./price-approval-status.contract.js";
import { PRICE_LIST_STATUSES } from "./price-list-status.contract.js";
import {
  type isPricingAuditAction,
  PRICING_AUDIT_ACTIONS,
} from "./pricing-audit-actions.contract.js";
import {
  PRICING_PACKAGE_LIFECYCLE,
  PRICING_PACKAGE_LIFECYCLE_PHASES,
} from "./pricing-authority.contract.js";
import { PRICING_METHODS } from "./pricing-method.contract.js";
import {
  PRICING_PERMISSION_DOMAINS,
  PRICING_PERMISSION_KEY_VOCABULARY,
} from "./pricing-permission-vocabulary.contract.js";

export const PRICING_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-PRICING" as const;

export type PricingDomainVocabularyKind = ErpDomainVocabularyKind;

export type PricingDomainClosedVocabularyEntry = ErpDomainClosedVocabularyEntry;

export const PRICING_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "price-list-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "price-list-status.contract.ts",
    constantExport: "PRICE_LIST_STATUSES",
    typeExport: "PriceListStatus",
    narrowerExport: "isPriceListStatus",
    valueCount: PRICE_LIST_STATUSES.length,
  },
  {
    id: "pricing-method",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "pricing-method.contract.ts",
    constantExport: "PRICING_METHODS",
    typeExport: "PricingMethod",
    narrowerExport: "isPricingMethod",
    valueCount: PRICING_METHODS.length,
  },
  {
    id: "discount-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "discount-type.contract.ts",
    constantExport: "DISCOUNT_TYPES",
    typeExport: "DiscountType",
    narrowerExport: "isDiscountType",
    valueCount: DISCOUNT_TYPES.length,
  },
  {
    id: "price-approval-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "price-approval-status.contract.ts",
    constantExport: "PRICE_APPROVAL_STATUSES",
    typeExport: "PriceApprovalStatus",
    narrowerExport: "isPriceApprovalStatus",
    valueCount: PRICE_APPROVAL_STATUSES.length,
  },
] as const satisfies readonly PricingDomainClosedVocabularyEntry[];

export type PricingDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const PRICING_DOMAIN_BRANDED_IDS = [
  {
    typeName: "PriceListId",
    brandFunction: "brandPriceListId",
    toFunction: "toPriceListId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "PriceRuleSetId",
    brandFunction: "brandPriceRuleSetId",
    toFunction: "toPriceRuleSetId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "DiscountApprovalId",
    brandFunction: "brandDiscountApprovalId",
    toFunction: "toDiscountApprovalId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly PricingDomainBrandedIdEntry[];

export const PRICING_DOMAIN_BRANDED_ID_TYPE_NAMES =
  PRICING_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const PRICING_DOMAIN_WIRE_CONTEXT = {
  id: "pricing-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "pricing-domain-wire-context.contract.ts",
  typeExport: "PricingDomainWireContext",
  assertExport: "assertPricingDomainWireContextJsonSerializable",
} as const;

export const PRICING_DOMAIN_AUDIT_VOCABULARY = {
  id: "pricing-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "pricing-audit-actions.contract.ts",
  constantExport: "PRICING_AUDIT_ACTIONS",
  typeExport: "PricingAuditAction",
  narrowerExport: "isPricingAuditAction",
  valueCount: PRICING_AUDIT_ACTIONS.length,
} as const;

export const PRICING_DOMAIN_PERMISSION_VOCABULARY = {
  id: "pricing-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "pricing-permission-vocabulary.contract.ts",
  domainsExport: "PRICING_PERMISSION_DOMAINS",
  keysExport: "PRICING_PERMISSION_KEY_VOCABULARY",
  domainCount: PRICING_PERMISSION_DOMAINS.length,
  keyCount: PRICING_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const PRICING_DOMAIN_AUTHORITY_METADATA = {
  id: "pricing-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "pricing-authority.contract.ts",
  lifecycleExport: "PRICING_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "PRICING_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: PRICING_PACKAGE_LIFECYCLE,
  phaseCount: PRICING_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const PRICING_DOMAIN_VOCABULARY_REGISTRY = {
  id: PRICING_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: PRICING_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: PRICING_DOMAIN_BRANDED_IDS,
  wireContext: PRICING_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: PRICING_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: PRICING_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: PRICING_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof PRICING_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isPricingAuditAction
  >[0]
    ? true
    : never;

export type assertPricingDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
