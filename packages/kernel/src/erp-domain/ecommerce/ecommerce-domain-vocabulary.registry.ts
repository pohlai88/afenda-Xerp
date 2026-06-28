/**
 * PAS-001B B94 — ecommerce domain vocabulary manifest.
 * Contracts-only registry — no checkout execution, payment capture, or ID_FAMILIES promotion.
 */

import { CART_STATUSES } from "./cart-status.contract.js";
import { CHANNEL_TYPES } from "./channel-type.contract.js";
import { CHECKOUT_STEPS } from "./checkout-step.contract.js";
import {
  ECOMMERCE_AUDIT_ACTIONS,
  type isEcommerceAuditAction,
} from "./ecommerce-audit-actions.contract.js";
import {
  ECOMMERCE_PACKAGE_LIFECYCLE,
  ECOMMERCE_PACKAGE_LIFECYCLE_PHASES,
} from "./ecommerce-authority.contract.js";
import {
  ECOMMERCE_PERMISSION_DOMAINS,
  ECOMMERCE_PERMISSION_KEY_VOCABULARY,
} from "./ecommerce-permission-vocabulary.contract.js";
import { WEB_ORDER_STATUSES } from "./web-order-status.contract.js";

export const ECOMMERCE_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-ECOMMERCE" as const;

export type EcommerceDomainVocabularyKind =
  | "closed-vocabulary"
  | "branded-id"
  | "wire-context"
  | "audit-vocabulary"
  | "permission-vocabulary"
  | "authority-metadata";

export interface EcommerceDomainClosedVocabularyEntry {
  readonly constantExport: string;
  readonly contractFile: string;
  readonly id: string;
  readonly kind: "closed-vocabulary";
  readonly narrowerExport: string;
  readonly pasSection: "4.8";
  readonly typeExport: string;
  readonly valueCount: number;
}

export const ECOMMERCE_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "cart-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "cart-status.contract.ts",
    constantExport: "CART_STATUSES",
    typeExport: "CartStatus",
    narrowerExport: "isCartStatus",
    valueCount: CART_STATUSES.length,
  },
  {
    id: "checkout-step",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "checkout-step.contract.ts",
    constantExport: "CHECKOUT_STEPS",
    typeExport: "CheckoutStep",
    narrowerExport: "isCheckoutStep",
    valueCount: CHECKOUT_STEPS.length,
  },
  {
    id: "web-order-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "web-order-status.contract.ts",
    constantExport: "WEB_ORDER_STATUSES",
    typeExport: "WebOrderStatus",
    narrowerExport: "isWebOrderStatus",
    valueCount: WEB_ORDER_STATUSES.length,
  },
  {
    id: "channel-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "channel-type.contract.ts",
    constantExport: "CHANNEL_TYPES",
    typeExport: "ChannelType",
    narrowerExport: "isChannelType",
    valueCount: CHANNEL_TYPES.length,
  },
] as const satisfies readonly EcommerceDomainClosedVocabularyEntry[];

export interface EcommerceDomainBrandedIdEntry {
  readonly brandFunction: string;
  readonly forbiddenOnPlatformFloor: boolean;
  readonly toFunction: string;
  readonly typeName: string;
}

export const ECOMMERCE_DOMAIN_BRANDED_IDS = [
  {
    typeName: "WebCartId",
    brandFunction: "brandWebCartId",
    toFunction: "toWebCartId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "CheckoutSessionId",
    brandFunction: "brandCheckoutSessionId",
    toFunction: "toCheckoutSessionId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "WebOrderId",
    brandFunction: "brandWebOrderId",
    toFunction: "toWebOrderId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly EcommerceDomainBrandedIdEntry[];

export const ECOMMERCE_DOMAIN_BRANDED_ID_TYPE_NAMES =
  ECOMMERCE_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const ECOMMERCE_DOMAIN_WIRE_CONTEXT = {
  id: "ecommerce-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "ecommerce-domain-wire-context.contract.ts",
  typeExport: "EcommerceDomainWireContext",
  assertExport: "assertEcommerceDomainWireContextJsonSerializable",
} as const;

export const ECOMMERCE_DOMAIN_AUDIT_VOCABULARY = {
  id: "ecommerce-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "ecommerce-audit-actions.contract.ts",
  constantExport: "ECOMMERCE_AUDIT_ACTIONS",
  typeExport: "EcommerceAuditAction",
  narrowerExport: "isEcommerceAuditAction",
  valueCount: ECOMMERCE_AUDIT_ACTIONS.length,
} as const;

export const ECOMMERCE_DOMAIN_PERMISSION_VOCABULARY = {
  id: "ecommerce-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "ecommerce-permission-vocabulary.contract.ts",
  domainsExport: "ECOMMERCE_PERMISSION_DOMAINS",
  keysExport: "ECOMMERCE_PERMISSION_KEY_VOCABULARY",
  domainCount: ECOMMERCE_PERMISSION_DOMAINS.length,
  keyCount: ECOMMERCE_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const ECOMMERCE_DOMAIN_AUTHORITY_METADATA = {
  id: "ecommerce-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "ecommerce-authority.contract.ts",
  lifecycleExport: "ECOMMERCE_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "ECOMMERCE_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: ECOMMERCE_PACKAGE_LIFECYCLE,
  phaseCount: ECOMMERCE_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const ECOMMERCE_DOMAIN_VOCABULARY_REGISTRY = {
  id: ECOMMERCE_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: ECOMMERCE_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: ECOMMERCE_DOMAIN_BRANDED_IDS,
  wireContext: ECOMMERCE_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: ECOMMERCE_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: ECOMMERCE_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: ECOMMERCE_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof ECOMMERCE_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isEcommerceAuditAction
  >[0]
    ? true
    : never;

export type assertEcommerceDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
