import type {
  ErpRuntimeModuleLifecycle,
  ModuleRuntimeContractDefinition,
} from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertNonEmptyString,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleRuntimeContractInput {
  readonly crossDomainDependencies?: readonly string[];
  readonly documentFamilies: readonly string[];
  readonly kvId: string;
  readonly lifecycle: ErpRuntimeModuleLifecycle;
  readonly module: string;
  readonly nonGoals: readonly string[];
  readonly operationSummary: readonly string[];
  readonly requiredGates: readonly string[];
}

export function defineModuleRuntimeContract(
  input: DefineModuleRuntimeContractInput
): ModuleRuntimeContractDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  if (input.documentFamilies.length === 0) {
    throw new Error(
      "defineModuleRuntimeContract: documentFamilies must not be empty"
    );
  }
  if (input.nonGoals.length === 0) {
    throw new Error("defineModuleRuntimeContract: nonGoals must not be empty");
  }
  if (input.requiredGates.length === 0) {
    throw new Error(
      "defineModuleRuntimeContract: requiredGates must not be empty"
    );
  }

  assertUniqueStrings(input.documentFamilies, "documentFamily");
  assertUniqueStrings(input.operationSummary, "operationSummary");
  assertUniqueStrings(input.requiredGates, "requiredGate");

  for (const family of input.documentFamilies) {
    assertNonEmptyString(family, "documentFamily");
  }

  return {
    module: input.module,
    kvId: input.kvId,
    lifecycle: input.lifecycle,
    documentFamilies: input.documentFamilies,
    operationSummary: input.operationSummary,
    nonGoals: input.nonGoals,
    crossDomainDependencies: input.crossDomainDependencies ?? [],
    requiredGates: input.requiredGates,
  } as const;
}
