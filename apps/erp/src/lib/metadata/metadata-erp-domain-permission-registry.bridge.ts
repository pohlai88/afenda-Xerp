/**
 * PAS-001A IS-003 — ERP metadata bridge from kernel erp-domain permission
 * vocabulary to @afenda/permissions PERMISSION_REGISTRY (PAS-001B wire catalog consumer).
 *
 * Kernel owns wire permission keys; permissions package owns registration/evaluation.
 * Metadata resolves whether a wire key is registered for runtime authorization.
 */

import {
  ERP_DOMAIN_DELIVERED_MODULES,
  ERP_DOMAIN_MODULE_KV_IDS,
  ERP_DOMAIN_PERMISSION_KEY_VOCABULARIES,
  type ErpDomainModule,
} from "@afenda/kernel/erp-domain/catalog";
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

const ERP_DOMAIN_PERMISSION_VOCABULARY_BY_MODULE =
  ERP_DOMAIN_PERMISSION_KEY_VOCABULARIES;

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
