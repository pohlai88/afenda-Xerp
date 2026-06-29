import type { ModuleEventCatalogDefinition } from "./erp-module-foundation.types.js";
import {
  assertEventNameFormat,
  assertModuleSlugFormat,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleEventCatalogInput {
  readonly events: readonly string[];
  readonly module: string;
}

export function defineModuleEventCatalog(
  input: DefineModuleEventCatalogInput
): ModuleEventCatalogDefinition {
  assertModuleSlugFormat(input.module, "module");

  if (input.events.length === 0) {
    throw new Error("defineModuleEventCatalog: events must not be empty");
  }

  assertUniqueStrings(input.events, "event");

  for (const event of input.events) {
    assertEventNameFormat(event);
    if (!event.startsWith(`${input.module}.`)) {
      throw new Error(
        `event "${event}" must be prefixed with module slug "${input.module}."`
      );
    }
  }

  return {
    module: input.module,
    events: input.events,
  } as const;
}
