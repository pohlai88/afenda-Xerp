import type { DashboardLayoutPreset } from "./dashboard-layout.contract";
import { parseDashboardLayoutPreset } from "./dashboard-layout.schema";

export const APPSHELL_DASHBOARD_LAYOUT_STORAGE_KEY =
  "afenda:appshell-dashboard-layout:v1" as const;

export function parseStoredDashboardLayout(
  value: string | null
): DashboardLayoutPreset | null {
  if (value === null || value.length === 0) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return parseDashboardLayoutPreset(parsed);
  } catch {
    return null;
  }
}

export function readStoredDashboardLayout(): DashboardLayoutPreset | null {
  if (typeof window === "undefined") {
    return null;
  }

  return parseStoredDashboardLayout(
    window.localStorage.getItem(APPSHELL_DASHBOARD_LAYOUT_STORAGE_KEY)
  );
}

export function writeStoredDashboardLayout(
  layout: DashboardLayoutPreset
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    APPSHELL_DASHBOARD_LAYOUT_STORAGE_KEY,
    JSON.stringify(layout)
  );
}

export function clearStoredDashboardLayout(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(APPSHELL_DASHBOARD_LAYOUT_STORAGE_KEY);
}
