import { ERP_DOMAIN_MODULE_KV_IDS } from "../../../kernel/src/erp-domain/erp-domain-layout.contract.js";
import {
  ERP_RUNTIME_MODULE_REGISTRY as PROCUREMENT_PRODUCTION_REGISTRY,
  PROCUREMENT_RUNTIME_MODULE,
} from "../../../procurement/src/procurement.registry.js";
import { defineErpRuntimeModuleRegistry } from "../define-erp-runtime-module-registry.js";
import {
  PROCUREMENT_FOUNDATION_BUNDLE,
  REFERENCE_KV_CATALOG,
} from "./procurement-foundation.bundle.js";

export const REFERENCE_ERP_RUNTIME_MODULE = PROCUREMENT_RUNTIME_MODULE;

export const ERP_RUNTIME_MODULE_REGISTRY = PROCUREMENT_PRODUCTION_REGISTRY;

export const REFERENCE_ERP_RUNTIME_MODULE_REGISTRY =
  defineErpRuntimeModuleRegistry({
    modules: [REFERENCE_ERP_RUNTIME_MODULE],
  });

export const REFERENCE_ERP_RUNTIME_MODULE_REGISTRY_BUNDLE = {
  registry: REFERENCE_ERP_RUNTIME_MODULE_REGISTRY,
  erpDomainModuleKvIds: REFERENCE_KV_CATALOG,
  bundles: [PROCUREMENT_FOUNDATION_BUNDLE],
} as const;

/** @deprecated Use REFERENCE_ERP_RUNTIME_MODULE_REGISTRY_BUNDLE */
export const REFERENCE_REGISTRY_BUNDLE =
  REFERENCE_ERP_RUNTIME_MODULE_REGISTRY_BUNDLE;

/** Production registry bundle with full PAS-001B KV catalog. */
export const ERP_RUNTIME_MODULE_REGISTRY_BUNDLE = {
  registry: ERP_RUNTIME_MODULE_REGISTRY,
  erpDomainModuleKvIds: ERP_DOMAIN_MODULE_KV_IDS,
  bundles: [PROCUREMENT_FOUNDATION_BUNDLE],
} as const;
