import { defineErpRuntimeModuleRegistry } from "../define-erp-runtime-module-registry.js";
import {
  PROCUREMENT_FOUNDATION_BUNDLE,
  PROCUREMENT_RUNTIME_MODULE,
  REFERENCE_KV_CATALOG,
} from "./build-procurement-foundation-bundle.js";

export const REFERENCE_ERP_RUNTIME_MODULE = PROCUREMENT_RUNTIME_MODULE;

export const ERP_RUNTIME_MODULE_REGISTRY = defineErpRuntimeModuleRegistry({
  modules: [PROCUREMENT_RUNTIME_MODULE],
});

export const REFERENCE_ERP_RUNTIME_MODULE_REGISTRY =
  ERP_RUNTIME_MODULE_REGISTRY;

export const REFERENCE_ERP_RUNTIME_MODULE_REGISTRY_BUNDLE = {
  registry: REFERENCE_ERP_RUNTIME_MODULE_REGISTRY,
  erpDomainModuleKvIds: REFERENCE_KV_CATALOG,
  bundles: [PROCUREMENT_FOUNDATION_BUNDLE],
} as const;

/** @deprecated Use REFERENCE_ERP_RUNTIME_MODULE_REGISTRY_BUNDLE */
export const REFERENCE_REGISTRY_BUNDLE =
  REFERENCE_ERP_RUNTIME_MODULE_REGISTRY_BUNDLE;

/** Production registry bundle — procurement foundation authorized (partial KV catalog). */
export const ERP_RUNTIME_MODULE_REGISTRY_BUNDLE = {
  registry: ERP_RUNTIME_MODULE_REGISTRY,
  erpDomainModuleKvIds: REFERENCE_KV_CATALOG,
  bundles: [PROCUREMENT_FOUNDATION_BUNDLE],
} as const;
