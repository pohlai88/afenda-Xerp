export const DASHBOARD_VISIBILITIES = [
  "private",
  "team",
  "org",
  "public",
] as const;

export type DashboardVisibility = (typeof DASHBOARD_VISIBILITIES)[number];

export function isDashboardVisibility(
  value: string
): value is DashboardVisibility {
  return (DASHBOARD_VISIBILITIES as readonly string[]).includes(value);
}
