import type { ModuleOwnershipDefinition } from "./erp-module-foundation.types.js";
import { MODULE_OWNERSHIP_SURFACES } from "./erp-module-foundation.types.js";
import { assertNonEmptyString } from "./internal/validation.js";

export type DefineModuleOwnershipInput = ModuleOwnershipDefinition;

export function defineModuleOwnership(
  input: DefineModuleOwnershipInput
): ModuleOwnershipDefinition {
  for (const surface of MODULE_OWNERSHIP_SURFACES) {
    assertNonEmptyString(input[surface], surface);
  }

  return {
    wireVocabulary: input.wireVocabulary,
    businessMeaning: input.businessMeaning,
    runtimeBehavior: input.runtimeBehavior,
    databaseSchema: input.databaseSchema,
    appIngress: input.appIngress,
    permissionRegistry: input.permissionRegistry,
    metadataBinding: input.metadataBinding,
    presentation: input.presentation,
  } as const;
}
