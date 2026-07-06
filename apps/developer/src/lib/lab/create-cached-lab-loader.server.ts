import { cache } from "react";
import type { LabRouteLoader } from "./contracts";

/**
 * Wraps a route-lab loader with React.cache() for per-request deduplication.
 * Does not introduce cross-request or cross-operator HTTP caching.
 */
export function createCachedLabLoader<TPageData, TParams = never>(
  loader: LabRouteLoader<TPageData, TParams>
): LabRouteLoader<TPageData, TParams> {
  return cache(loader) as LabRouteLoader<TPageData, TParams>;
}
