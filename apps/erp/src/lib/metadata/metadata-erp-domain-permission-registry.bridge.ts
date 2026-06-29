/**
 * PAS-001A IS-003 — ERP metadata bridge from kernel erp-domain permission
 * vocabulary to @afenda/permissions PERMISSION_REGISTRY (PAS-001B wire catalog consumer).
 *
 * Kernel owns wire permission keys; permissions package owns registration/evaluation.
 * Metadata resolves whether a wire key is registered for runtime authorization.
 */

import { ACCOUNTING_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/accounting";
import { ANALYTICS_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/analytics";
import { ASSETS_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/assets";
import {
  ERP_DOMAIN_DELIVERED_MODULES,
  ERP_DOMAIN_MODULE_KV_IDS,
  type ErpDomainModule,
} from "@afenda/kernel/erp-domain/catalog";
import { CONSOLIDATION_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/consolidation";
import { CONTROLLING_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/controlling";
import { CRM_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/crm";
import { DOCUMENT_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/document";
import { ECOMMERCE_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/ecommerce";
import { FIELD_SERVICE_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/field-service";
import { HCM_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/hcm";
import { INTERCOMPANY_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/intercompany";
import { INVENTORY_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/inventory";
import { MAINTENANCE_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/maintenance";
import { MANUFACTURING_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/manufacturing";
import { MARKETING_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/marketing";
import { PAYROLL_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/payroll";
import { POS_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/pos";
import { PRICING_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/pricing";
import { PROCUREMENT_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/procurement";
import { PROJECT_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/project";
import { QUALITY_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/quality";
import { SALES_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/sales";
import { SERVICE_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/service";
import { SUBSCRIPTION_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/subscription";
import { SUPPLY_CHAIN_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/supply-chain";
import { TAX_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/tax";
import { TREASURY_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/treasury";
import { WORKFLOW_PERMISSION_KEY_VOCABULARY } from "@afenda/kernel/erp-domain/workflow";
import {
  isRegisteredPermissionKey,
  PERMISSION_REGISTRY,
  type RegisteredPermissionKey,
} from "@afenda/permissions";

export type MetadataErpDomainPermissionRegistrationStatus =
  | "full"
  | "partial"
  | "vocabulary-only";

export interface MetadataErpDomainPermissionRegistryBridgeEntry {
  readonly moduleKvId: (typeof ERP_DOMAIN_MODULE_KV_IDS)[ErpDomainModule];
  readonly moduleSlug: ErpDomainModule;
  readonly registeredPermissionKeys: readonly RegisteredPermissionKey[];
  readonly registrationStatus: MetadataErpDomainPermissionRegistrationStatus;
  readonly wirePermissionKeys: readonly string[];
}

const ERP_DOMAIN_PERMISSION_VOCABULARY_BY_MODULE = {
  accounting: ACCOUNTING_PERMISSION_KEY_VOCABULARY,
  analytics: ANALYTICS_PERMISSION_KEY_VOCABULARY,
  assets: ASSETS_PERMISSION_KEY_VOCABULARY,
  consolidation: CONSOLIDATION_PERMISSION_KEY_VOCABULARY,
  controlling: CONTROLLING_PERMISSION_KEY_VOCABULARY,
  crm: CRM_PERMISSION_KEY_VOCABULARY,
  document: DOCUMENT_PERMISSION_KEY_VOCABULARY,
  ecommerce: ECOMMERCE_PERMISSION_KEY_VOCABULARY,
  "field-service": FIELD_SERVICE_PERMISSION_KEY_VOCABULARY,
  hcm: HCM_PERMISSION_KEY_VOCABULARY,
  intercompany: INTERCOMPANY_PERMISSION_KEY_VOCABULARY,
  inventory: INVENTORY_PERMISSION_KEY_VOCABULARY,
  maintenance: MAINTENANCE_PERMISSION_KEY_VOCABULARY,
  manufacturing: MANUFACTURING_PERMISSION_KEY_VOCABULARY,
  marketing: MARKETING_PERMISSION_KEY_VOCABULARY,
  payroll: PAYROLL_PERMISSION_KEY_VOCABULARY,
  pos: POS_PERMISSION_KEY_VOCABULARY,
  pricing: PRICING_PERMISSION_KEY_VOCABULARY,
  procurement: PROCUREMENT_PERMISSION_KEY_VOCABULARY,
  project: PROJECT_PERMISSION_KEY_VOCABULARY,
  quality: QUALITY_PERMISSION_KEY_VOCABULARY,
  sales: SALES_PERMISSION_KEY_VOCABULARY,
  service: SERVICE_PERMISSION_KEY_VOCABULARY,
  subscription: SUBSCRIPTION_PERMISSION_KEY_VOCABULARY,
  "supply-chain": SUPPLY_CHAIN_PERMISSION_KEY_VOCABULARY,
  tax: TAX_PERMISSION_KEY_VOCABULARY,
  treasury: TREASURY_PERMISSION_KEY_VOCABULARY,
  workflow: WORKFLOW_PERMISSION_KEY_VOCABULARY,
} as const satisfies Record<ErpDomainModule, readonly string[]>;

/** Modules with full kernel wire vocabulary ↔ PERMISSION_REGISTRY parity gates. */
export const METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_PARITY_MODULES = [
  "accounting",
  "inventory",
] as const satisfies readonly ErpDomainModule[];

function collectPermissionRegistryLeafKeys(
  value: unknown,
  keys: string[] = []
): string[] {
  if (typeof value === "string") {
    keys.push(value);
    return keys;
  }

  if (value && typeof value === "object") {
    for (const nested of Object.values(value)) {
      collectPermissionRegistryLeafKeys(nested, keys);
    }
  }

  return keys;
}

const REGISTERED_PERMISSION_KEYS = new Set<string>(
  collectPermissionRegistryLeafKeys(PERMISSION_REGISTRY)
);

function resolveRegistrationStatus(
  wirePermissionKeys: readonly string[],
  registeredPermissionKeys: readonly RegisteredPermissionKey[]
): MetadataErpDomainPermissionRegistrationStatus {
  if (wirePermissionKeys.length === 0) {
    return "vocabulary-only";
  }

  if (registeredPermissionKeys.length === 0) {
    return "vocabulary-only";
  }

  if (registeredPermissionKeys.length === wirePermissionKeys.length) {
    return "full";
  }

  return "partial";
}

function buildBridgeEntry(
  moduleSlug: ErpDomainModule
): MetadataErpDomainPermissionRegistryBridgeEntry {
  const wirePermissionKeys =
    ERP_DOMAIN_PERMISSION_VOCABULARY_BY_MODULE[moduleSlug];
  const registeredPermissionKeys = wirePermissionKeys.filter((key) =>
    isRegisteredPermissionKey(key)
  );

  return {
    moduleSlug,
    moduleKvId: ERP_DOMAIN_MODULE_KV_IDS[moduleSlug],
    wirePermissionKeys,
    registeredPermissionKeys,
    registrationStatus: resolveRegistrationStatus(
      wirePermissionKeys,
      registeredPermissionKeys
    ),
  };
}

/** 28/28 delivered erp-domain permission vocabularies bridged to PERMISSION_REGISTRY lookup. */
export const METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_BRIDGE =
  ERP_DOMAIN_DELIVERED_MODULES.map((moduleSlug) =>
    buildBridgeEntry(moduleSlug)
  );

export function getMetadataErpDomainPermissionRegistryBridgeEntry(
  moduleSlug: ErpDomainModule
): MetadataErpDomainPermissionRegistryBridgeEntry {
  return buildBridgeEntry(moduleSlug);
}

/** True when a kernel wire permission key is registered for runtime authorization. */
export function isKernelWirePermissionRegistered(
  wirePermissionKey: string
): wirePermissionKey is RegisteredPermissionKey {
  return isRegisteredPermissionKey(wirePermissionKey);
}

/** Resolve a kernel wire permission key to a registered key when present. */
export function resolveRegisteredPermissionKeyForKernelWireKey(
  wirePermissionKey: string
): RegisteredPermissionKey | undefined {
  return isRegisteredPermissionKey(wirePermissionKey)
    ? wirePermissionKey
    : undefined;
}

/** All registered permission keys that originate from a delivered erp-domain module vocabulary. */
export function listRegisteredKernelWirePermissionKeys(): RegisteredPermissionKey[] {
  const keys = new Set<RegisteredPermissionKey>();

  for (const entry of METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_BRIDGE) {
    for (const registeredKey of entry.registeredPermissionKeys) {
      keys.add(registeredKey);
    }
  }

  return [...keys].sort();
}

/** Ensures parity modules remain fully registered (accounting, inventory). */
export function assertMetadataErpDomainPermissionRegistryParity(): void {
  for (const moduleSlug of METADATA_ERP_DOMAIN_PERMISSION_REGISTRY_PARITY_MODULES) {
    const entry = getMetadataErpDomainPermissionRegistryBridgeEntry(moduleSlug);

    if (entry.registrationStatus !== "full") {
      throw new Error(
        `Expected full PERMISSION_REGISTRY parity for ${moduleSlug} (${entry.moduleKvId}); got ${entry.registrationStatus}.`
      );
    }
  }
}

/** Guard against stale bridge wiring when registry membership changes unexpectedly. */
export function isKnownRegisteredPermissionKey(value: string): boolean {
  return REGISTERED_PERMISSION_KEYS.has(value);
}
