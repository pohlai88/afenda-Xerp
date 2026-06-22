import type { ApiCachePolicy } from "../contracts/api-contract";
import { resolveNextDynamic, resolveRevalidateSeconds } from "../contracts/api-route-policy.contract";

export function resolveRouteDynamicExport(
  cache: ApiCachePolicy
): "auto" | "force-dynamic" | "force-static" {
  return resolveNextDynamic(cache);
}

export function resolveRouteRevalidateExport(
  cache: ApiCachePolicy
): number | undefined {
  return resolveRevalidateSeconds(cache);
}
