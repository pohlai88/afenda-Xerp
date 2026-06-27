import {
  createExecutionContext,
  type ExecutionContext,
  type ExecutionContextInput,
} from "@afenda/kernel";

import { persistenceCanonicalIdBodyGenerator } from "@/lib/identity/persistence-canonical-id-body-generator.server";

/**
 * Server execution context — injects the database-backed ULID generator when
 * `executionId` is not supplied explicitly.
 */
export function createServerExecutionContext(
  input: ExecutionContextInput
): ExecutionContext {
  if (input.executionId !== undefined) {
    return createExecutionContext(input);
  }

  return createExecutionContext({
    ...input,
    canonicalIdBodyGenerator: persistenceCanonicalIdBodyGenerator,
  });
}
