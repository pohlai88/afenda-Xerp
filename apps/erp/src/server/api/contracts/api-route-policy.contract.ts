import type { ApiCachePolicy, ApiRouteContract } from "./api-contract";

export function isMutationMethod(
  method: ApiRouteContract<unknown, unknown>["method"]
): boolean {
  return (
    method === "DELETE" ||
    method === "PATCH" ||
    method === "POST" ||
    method === "PUT"
  );
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

export function resolveNextDynamic(
  cache: ApiCachePolicy
): "auto" | "force-dynamic" | "force-static" {
  if (cache.kind === "no-store") {
    return "force-dynamic";
  }

  if (cache.kind === "static") {
    return "force-static";
  }

  return "auto";
}

export function resolveRevalidateSeconds(
  cache: ApiCachePolicy
): number | undefined {
  if (cache.kind === "revalidate") {
    return cache.seconds;
  }

  return;
}
