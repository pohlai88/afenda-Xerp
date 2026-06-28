export const ROUTE_STATUSES = ["planned", "active", "completed"] as const;

export type RouteStatus = (typeof ROUTE_STATUSES)[number];

export function isRouteStatus(value: string): value is RouteStatus {
  return (ROUTE_STATUSES as readonly string[]).includes(value);
}
