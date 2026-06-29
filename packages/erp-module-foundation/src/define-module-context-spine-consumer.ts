import type { ModuleContextSpineConsumerDefinition } from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertNonEmptyString,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleContextSpineConsumerInput {
  readonly forbiddenIngress: readonly string[];
  readonly kvId: string;
  readonly module: string;
  readonly requiredResolvers: readonly string[];
}

export function defineModuleContextSpineConsumer(
  input: DefineModuleContextSpineConsumerInput
): ModuleContextSpineConsumerDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  if (input.requiredResolvers.length === 0) {
    throw new Error(
      "defineModuleContextSpineConsumer: requiredResolvers must not be empty"
    );
  }

  assertUniqueStrings(input.requiredResolvers, "required resolver");
  assertUniqueStrings(input.forbiddenIngress, "forbidden ingress");

  for (const resolver of input.requiredResolvers) {
    assertNonEmptyString(resolver, "required resolver");
  }

  for (const ingress of input.forbiddenIngress) {
    assertNonEmptyString(ingress, "forbidden ingress");
  }

  return {
    module: input.module,
    kvId: input.kvId,
    requiredResolvers: input.requiredResolvers,
    forbiddenIngress: input.forbiddenIngress,
  } as const;
}
