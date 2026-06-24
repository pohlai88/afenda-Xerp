import type { ApiCachePolicy } from "./api-contract";

export {
  assertMethodPolicy,
  assertMutationCachePolicy,
  isMutationMethod,
  isReadMethod,
  MUTATION_HTTP_METHODS,
  READ_HTTP_METHODS,
} from "./method-policy.contract";

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
