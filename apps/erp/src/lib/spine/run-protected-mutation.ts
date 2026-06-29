import {
  type MutationScope,
  resolveMutationScopeFromApiContext,
} from "@/lib/outbox/resolve-mutation-scope.server";
import type { ApiRequestContext } from "@/server/api/runtime/api-request-context";

import type {
  ProtectedMutationObservabilityEvent,
  ProtectedMutationSpineResult,
} from "./protected-mutation-spine.contract";

export interface RunProtectedMutationInput<TRequest, TResult> {
  readonly context: ApiRequestContext<TRequest>;
  readonly execute: (scope: MutationScope) => Promise<TResult>;
  readonly onObservability?: (
    event: ProtectedMutationObservabilityEvent
  ) => void;
}

export async function runProtectedMutation<TRequest, TResult>(
  input: RunProtectedMutationInput<TRequest, TResult>
): Promise<ProtectedMutationSpineResult<TResult>> {
  const scope = resolveMutationScopeFromApiContext(input.context);

  input.onObservability?.({
    correlationId: input.context.correlationId,
    requestId: input.context.requestId,
    scope,
  });

  const result = await input.execute(scope);

  return {
    correlationId: input.context.correlationId,
    result,
    scope,
  };
}
