import type {
  ModuleOutboxContractDefinition,
  ModuleOutboxEntry,
  OutboxRequirement,
} from "./erp-module-foundation.types.js";
import { OUTBOX_REQUIREMENTS } from "./erp-module-foundation.types.js";
import {
  assertEventNameFormat,
  assertModuleSlugFormat,
  assertUniqueStrings,
} from "./internal/validation.js";

export interface DefineModuleOutboxContractInput {
  readonly entries: readonly ModuleOutboxEntry[];
  readonly module: string;
}

function assertOutboxRequirement(value: OutboxRequirement): void {
  if (!OUTBOX_REQUIREMENTS.includes(value)) {
    throw new Error(`invalid outbox requirement: "${value}"`);
  }
}

export function defineModuleOutboxContract(
  input: DefineModuleOutboxContractInput
): ModuleOutboxContractDefinition {
  assertModuleSlugFormat(input.module, "module");

  if (input.entries.length === 0) {
    throw new Error("defineModuleOutboxContract: entries must not be empty");
  }

  assertUniqueStrings(
    input.entries.map((entry) => entry.event),
    "outbox event"
  );

  const entries = input.entries.map((entry) => {
    assertEventNameFormat(entry.event);
    assertOutboxRequirement(entry.requirement);
    if (!entry.event.startsWith(`${input.module}.`)) {
      throw new Error(
        `outbox event "${entry.event}" must be prefixed with module slug "${input.module}."`
      );
    }
    return {
      event: entry.event,
      requirement: entry.requirement,
      ...(entry.notes ? { notes: entry.notes } : {}),
    } as const;
  });

  return {
    module: input.module,
    entries,
  } as const;
}
