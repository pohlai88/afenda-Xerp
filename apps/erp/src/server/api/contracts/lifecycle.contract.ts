export const API_ROUTE_LIFECYCLE_STATUSES = [
  "planned",
  "active",
  "deprecated",
  "removed",
] as const;

export type ApiRouteLifecycleStatus =
  (typeof API_ROUTE_LIFECYCLE_STATUSES)[number];

export function assertActiveRouteLifecycle(
  lifecycle: ApiRouteLifecycleStatus
): void {
  if (lifecycle === "removed") {
    throw new Error(
      "Removed API routes must not remain wired in route handlers."
    );
  }
}
