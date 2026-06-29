import type {
  ErpRuntimeModuleDefinition,
  ErpRuntimeModuleRegistryDefinition,
} from "./erp-module-foundation.types.js";
import {
  assertRuntimeModuleKvCatalogParity,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineErpRuntimeModuleRegistryInput {
  readonly modules: readonly ErpRuntimeModuleDefinition[];
}

export function defineErpRuntimeModuleRegistry(
  input: DefineErpRuntimeModuleRegistryInput
): ErpRuntimeModuleRegistryDefinition {
  if (input.modules.length === 0) {
    return { modules: [] } as const;
  }

  assertUniqueStrings(
    input.modules.map((module) => module.slug),
    "module slug"
  );
  assertUniqueStrings(
    input.modules.map((module) => module.kvId),
    "module kvId"
  );
  assertUniqueStrings(
    input.modules.map((module) => module.runtimePackage),
    "runtime package"
  );
  assertUniqueStrings(
    input.modules.map((module) => module.wirePackage),
    "wire package"
  );

  return {
    modules: input.modules,
  } as const;
}

export interface AssertRuntimeModuleKvCatalogParityInput {
  readonly erpDomainModuleKvIds: Readonly<Record<string, string>>;
  readonly module: ErpRuntimeModuleDefinition;
}

export function assertRuntimeModuleKvCatalogParityForModule(
  input: AssertRuntimeModuleKvCatalogParityInput
): void {
  assertRuntimeModuleKvCatalogParity({
    slug: input.module.slug,
    kvId: input.module.kvId,
    erpDomainModuleKvIds: input.erpDomainModuleKvIds,
  });
}
