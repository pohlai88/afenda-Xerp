import type { WorkspaceDashboardLayoutLoadFallback } from "@/lib/workspace/workspace-dashboard-layout.contract";
import { isApiClientRequestError } from "./api-policy-gate.error";

/** Returns true when the governed API envelope maps to HTTP 401 unauthenticated. */
export function isApiUnauthenticatedError(error: unknown): boolean {
  return isApiClientRequestError(error) && error.code === "unauthenticated";
}

export function resolveLayoutLoadFallback(
  error: unknown,
  useDefaultLayoutOnUnauthenticated: boolean
): WorkspaceDashboardLayoutLoadFallback | null {
  if (useDefaultLayoutOnUnauthenticated && isApiUnauthenticatedError(error)) {
    return "unauthenticated";
  }

  return null;
}
