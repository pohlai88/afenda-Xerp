import type {
  ErpDomainBrandedIdEntry,
  ErpDomainClosedVocabularyEntry,
  ErpDomainVocabularyKind,
} from "../_internal/domain-vocabulary.types.js";
import { BILLING_CYCLES } from "./billing-cycle.contract.js";

import { RENEWAL_INTENTS } from "./renewal-intent.contract.js";
import {
  type isSubscriptionAuditAction,
  SUBSCRIPTION_AUDIT_ACTIONS,
} from "./subscription-audit-actions.contract.js";
import {
  SUBSCRIPTION_PACKAGE_LIFECYCLE,
  SUBSCRIPTION_PACKAGE_LIFECYCLE_PHASES,
} from "./subscription-authority.contract.js";
import { SUBSCRIPTION_EVENT_TYPES } from "./subscription-event-type.contract.js";
import {
  SUBSCRIPTION_PERMISSION_DOMAINS,
  SUBSCRIPTION_PERMISSION_KEY_VOCABULARY,
} from "./subscription-permission-vocabulary.contract.js";
import { SUBSCRIPTION_STATUSES } from "./subscription-status.contract.js";

export const SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY_ID =
  "PAS-001B-4.8-SUBSCRIPTION" as const;

export type SubscriptionDomainVocabularyKind = ErpDomainVocabularyKind;

export type SubscriptionDomainClosedVocabularyEntry =
  ErpDomainClosedVocabularyEntry;

export const SUBSCRIPTION_DOMAIN_CLOSED_VOCABULARIES = [
  {
    id: "subscription-status",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "subscription-status.contract.ts",
    constantExport: "SUBSCRIPTION_STATUSES",
    typeExport: "SubscriptionStatus",
    narrowerExport: "isSubscriptionStatus",
    valueCount: SUBSCRIPTION_STATUSES.length,
  },
  {
    id: "billing-cycle",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "billing-cycle.contract.ts",
    constantExport: "BILLING_CYCLES",
    typeExport: "BillingCycle",
    narrowerExport: "isBillingCycle",
    valueCount: BILLING_CYCLES.length,
  },
  {
    id: "renewal-intent",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "renewal-intent.contract.ts",
    constantExport: "RENEWAL_INTENTS",
    typeExport: "RenewalIntent",
    narrowerExport: "isRenewalIntent",
    valueCount: RENEWAL_INTENTS.length,
  },
  {
    id: "subscription-event-type",
    kind: "closed-vocabulary",
    pasSection: "4.8",
    contractFile: "subscription-event-type.contract.ts",
    constantExport: "SUBSCRIPTION_EVENT_TYPES",
    typeExport: "SubscriptionEventType",
    narrowerExport: "isSubscriptionEventType",
    valueCount: SUBSCRIPTION_EVENT_TYPES.length,
  },
] as const satisfies readonly SubscriptionDomainClosedVocabularyEntry[];

export type SubscriptionDomainBrandedIdEntry = ErpDomainBrandedIdEntry;

export const SUBSCRIPTION_DOMAIN_BRANDED_IDS = [
  {
    typeName: "SubscriptionId",
    brandFunction: "brandSubscriptionId",
    toFunction: "toSubscriptionId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "BillingCycleRunId",
    brandFunction: "brandBillingCycleRunId",
    toFunction: "toBillingCycleRunId",
    forbiddenOnPlatformFloor: false,
  },
  {
    typeName: "RenewalOfferId",
    brandFunction: "brandRenewalOfferId",
    toFunction: "toRenewalOfferId",
    forbiddenOnPlatformFloor: false,
  },
] as const satisfies readonly SubscriptionDomainBrandedIdEntry[];

export const SUBSCRIPTION_DOMAIN_BRANDED_ID_TYPE_NAMES =
  SUBSCRIPTION_DOMAIN_BRANDED_IDS.map((entry) => entry.typeName);

export const SUBSCRIPTION_DOMAIN_WIRE_CONTEXT = {
  id: "subscription-domain-wire-context",
  kind: "wire-context",
  pasSection: "4.8",
  contractFile: "subscription-domain-wire-context.contract.ts",
  typeExport: "SubscriptionDomainWireContext",
  assertExport: "assertSubscriptionDomainWireContextJsonSerializable",
} as const;

export const SUBSCRIPTION_DOMAIN_AUDIT_VOCABULARY = {
  id: "subscription-audit-actions",
  kind: "audit-vocabulary",
  pasSection: "4.8",
  contractFile: "subscription-audit-actions.contract.ts",
  constantExport: "SUBSCRIPTION_AUDIT_ACTIONS",
  typeExport: "SubscriptionAuditAction",
  narrowerExport: "isSubscriptionAuditAction",
  valueCount: SUBSCRIPTION_AUDIT_ACTIONS.length,
} as const;

export const SUBSCRIPTION_DOMAIN_PERMISSION_VOCABULARY = {
  id: "subscription-permission-keys",
  kind: "permission-vocabulary",
  pasSection: "4.8",
  contractFile: "subscription-permission-vocabulary.contract.ts",
  domainsExport: "SUBSCRIPTION_PERMISSION_DOMAINS",
  keysExport: "SUBSCRIPTION_PERMISSION_KEY_VOCABULARY",
  domainCount: SUBSCRIPTION_PERMISSION_DOMAINS.length,
  keyCount: SUBSCRIPTION_PERMISSION_KEY_VOCABULARY.length,
} as const;

export const SUBSCRIPTION_DOMAIN_AUTHORITY_METADATA = {
  id: "subscription-authority",
  kind: "authority-metadata",
  pasSection: "4.8",
  contractFile: "subscription-authority.contract.ts",
  lifecycleExport: "SUBSCRIPTION_PACKAGE_LIFECYCLE",
  lifecyclePhasesExport: "SUBSCRIPTION_PACKAGE_LIFECYCLE_PHASES",
  currentLifecycle: SUBSCRIPTION_PACKAGE_LIFECYCLE,
  phaseCount: SUBSCRIPTION_PACKAGE_LIFECYCLE_PHASES.length,
} as const;

export const SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY = {
  id: SUBSCRIPTION_DOMAIN_VOCABULARY_REGISTRY_ID,
  closedVocabularies: SUBSCRIPTION_DOMAIN_CLOSED_VOCABULARIES,
  brandedIds: SUBSCRIPTION_DOMAIN_BRANDED_IDS,
  wireContext: SUBSCRIPTION_DOMAIN_WIRE_CONTEXT,
  auditVocabulary: SUBSCRIPTION_DOMAIN_AUDIT_VOCABULARY,
  permissionVocabulary: SUBSCRIPTION_DOMAIN_PERMISSION_VOCABULARY,
  authorityMetadata: SUBSCRIPTION_DOMAIN_AUTHORITY_METADATA,
} as const;

type _AssertAuditNarrower =
  (typeof SUBSCRIPTION_AUDIT_ACTIONS)[number] extends Parameters<
    typeof isSubscriptionAuditAction
  >[0]
    ? true
    : never;

export type assertSubscriptionDomainVocabularyRegistryIntegrity =
  _AssertAuditNarrower extends true ? true : never;
