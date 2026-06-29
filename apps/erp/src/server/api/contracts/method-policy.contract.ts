import type { ApiHttpMethod, ApiRouteContract } from "./api-contract";

export const MUTATION_HTTP_METHODS = [
  "DELETE",
  "PATCH",
  "POST",
  "PUT",
] as const satisfies readonly ApiHttpMethod[];

export const READ_HTTP_METHODS = [
  "GET",
] as const satisfies readonly ApiHttpMethod[];

export function isMutationMethod(method: ApiHttpMethod): boolean {
  return (MUTATION_HTTP_METHODS as readonly ApiHttpMethod[]).includes(method);
}

export function isReadMethod(method: ApiHttpMethod): boolean {
  return method === "GET";
}

export function assertMutationCachePolicy(
  contract: ApiRouteContract<unknown, unknown>
): void {
  if (!isMutationMethod(contract.method)) {
    return;
  }

  if (contract.cache.kind !== "no-store") {
    throw new Error(
      `Mutation contract ${contract.id} must use cache policy no-store.`
    );
  }
}

/**
 * HTTP method rules for governed internal v1 routes (ADR-0013 Phase 5).
 *
 * - Mutations: no-store cache; protected routes require audit (telemetry exempt).
 * - Workspace reads: no-store (operating-context scoped).
 * - Health reads: revalidate or no-store allowed.
 */
export function assertMethodPolicy(
  contract: ApiRouteContract<unknown, unknown>
): void {
  assertMutationCachePolicy(contract);

  if (isReadMethod(contract.method)) {
    if (
      contract.tags.includes("workspace") &&
      contract.cache.kind !== "no-store"
    ) {
      throw new Error(
        `Workspace read contract ${contract.id} must use cache policy no-store.`
      );
    }

    return;
  }

  if (!isMutationMethod(contract.method)) {
    throw new Error(
      `Contract ${contract.id} uses unsupported HTTP method ${contract.method}.`
    );
  }

  const isTelemetry = contract.tags.includes("telemetry");
  const isPublic = contract.tags.includes("public");

  if (isTelemetry || isPublic) {
    return;
  }

  if (!("audit" in contract) || contract.audit?.enabled !== true) {
    throw new Error(
      `Protected mutation contract ${contract.id} must declare audit.enabled.`
    );
  }
}
