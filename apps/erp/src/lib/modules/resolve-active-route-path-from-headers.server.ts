import { ACTIVE_ROUTE_PATH_HEADER } from "@/lib/context/context.constants";

/** Reads the routed pathname injected by `proxy.ts` for manifest nav active-route matching. */
export function resolveActiveRoutePathFromHeaders(
  headerStore: Readonly<Headers>
): string | undefined {
  const pathname = headerStore.get(ACTIVE_ROUTE_PATH_HEADER)?.trim();

  if (pathname === undefined || pathname.length === 0) {
    return;
  }

  return pathname;
}
