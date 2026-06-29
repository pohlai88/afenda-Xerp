/**
 * Minimal PAS-001A R1a API runtime stub — full handler returns in API track.
 *
 * Skeleton scope (ADR-0027): permission assertion helper only. Not production API ingress.
 * Do not use for route handlers until PAS-001A API slice delivers full createApiHandler.
 */

export async function assertRoutePermission<TContext>(
  context: TContext,
  permissionPolicy: { readonly permission: string } | undefined
): Promise<TContext> {
  if (permissionPolicy === undefined) {
    return context;
  }

  if (permissionPolicy.permission.trim().length === 0) {
    throw new Error("Permission policy is misconfigured.");
  }

  return context;
}
