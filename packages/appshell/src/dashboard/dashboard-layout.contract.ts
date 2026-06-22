import type {
  DashboardWidgetId,
  LegacyDashboardCompositeWidgetId,
} from "./dashboard-widget.contract";

export type DashboardLayoutWidgetKey =
  | DashboardWidgetId
  | LegacyDashboardCompositeWidgetId;

export interface DashboardWidgetLayoutItem {
  readonly i: DashboardLayoutWidgetKey;
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly minW?: number;
  readonly minH?: number;
}

export interface DashboardLayoutPreset {
  readonly version: 1;
  readonly columns: 12;
  readonly rowHeight: number;
  readonly items: readonly DashboardWidgetLayoutItem[];
}

export interface DashboardLayoutValidationResult {
  readonly valid: boolean;
  readonly reason: string | null;
}

export const DASHBOARD_GRID_BREAKPOINTS = {
  desktop: { breakpoint: 1200, columns: 12 },
  laptop: { breakpoint: 996, columns: 10 },
  tablet: { breakpoint: 768, columns: 8 },
  mobile: { breakpoint: 480, columns: 4 },
} as const satisfies Record<string, { breakpoint: number; columns: number }>;

/** Matches `--afenda-spacing-3` (12px) — react-grid-layout margin tuple. */
export const DASHBOARD_GRID_MARGIN = [12, 12] as const satisfies readonly [number, number];

export type DashboardGridBreakpointKey = keyof typeof DASHBOARD_GRID_BREAKPOINTS;
