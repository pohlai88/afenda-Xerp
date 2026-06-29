import type { ModuleAuditMapDefinition } from "./erp-module-foundation.types.js";
import {
  assertKvIdFormat,
  assertModuleSlugFormat,
  assertNonEmptyString,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleAuditMapInput {
  readonly actions: readonly string[];
  readonly kvId: string;
  readonly module: string;
}

export function defineModuleAuditMap(
  input: DefineModuleAuditMapInput
): ModuleAuditMapDefinition {
  assertModuleSlugFormat(input.module, "module");
  assertKvIdFormat(input.kvId);

  if (input.actions.length === 0) {
    throw new Error("defineModuleAuditMap: actions must not be empty");
  }

  assertUniqueStrings(input.actions, "audit action");

  for (const action of input.actions) {
    assertNonEmptyString(action, "audit action");
    if (!action.includes(".")) {
      throw new Error(
        `audit action must use dotted vocabulary — got "${action}"`
      );
    }
  }

  return {
    module: input.module,
    kvId: input.kvId,
    actions: input.actions,
  } as const;
}
