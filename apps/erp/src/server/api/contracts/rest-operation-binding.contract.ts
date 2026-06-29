/**
 * PAS-API-REST-001-S1 — REST operation binding (style layer).
 * Maps family {@link ApiOperationId} to HTTP method + path without redefining identity.
 */

import type { ApiHttpMethod, ApiRouteContract } from "./api-contract";
import type { ApiOperationId } from "./core/api-operation-id.contract";
import { parseApiOperationId } from "./core/api-operation-id.contract";

export const REST_INTERNAL_V1_NAMESPACE = "/api/internal/v1" as const;

export interface RestOperationBinding {
  readonly bindingKind: "rest-internal-v1";
  readonly method: ApiHttpMethod;
  readonly namespace: typeof REST_INTERNAL_V1_NAMESPACE;
  readonly operationId: ApiOperationId;
  readonly path: string;
}

export function extractRestOperationBinding<TRequest, TResponse>(
  contract: Pick<
    ApiRouteContract<TRequest, TResponse>,
    "id" | "method" | "path"
  >
): RestOperationBinding {
  return {
    bindingKind: "rest-internal-v1",
    method: contract.method,
    namespace: REST_INTERNAL_V1_NAMESPACE,
    operationId: parseApiOperationId(contract.id),
    path: contract.path,
  };
}

export function assertRestOperationBindingShape(
  binding: RestOperationBinding
): void {
  if (!binding.path.startsWith(`${binding.namespace}/`)) {
    throw new Error(
      `REST binding path must live under ${binding.namespace}/: ${binding.path}`
    );
  }
}

export function buildRestOperationBindingRegistry<
  TContract extends ApiRouteContract<unknown, unknown>,
>(contracts: readonly TContract[]): readonly RestOperationBinding[] {
  const bindings = contracts.map((contract) =>
    extractRestOperationBinding(contract)
  );

  const methodPathKeys = new Set<string>();

  for (const binding of bindings) {
    assertRestOperationBindingShape(binding);

    const methodPathKey = `${binding.method}:${binding.path}`;
    if (methodPathKeys.has(methodPathKey)) {
      throw new Error(`Duplicate REST method+path binding: ${methodPathKey}`);
    }
    methodPathKeys.add(methodPathKey);
  }

  return bindings;
}
