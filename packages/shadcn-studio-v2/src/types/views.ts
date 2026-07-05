import type { ComponentProps, ReactNode } from "react";

export type ViewSurfaceState =
  | "empty"
  | "error"
  | "loading"
  | "ready"
  | "unavailable";

export type NonReadyViewSurfaceState = Exclude<ViewSurfaceState, "ready">;

export interface ViewStateMessage {
  readonly action?: ReactNode;
  readonly description?: ReactNode;
  readonly title: ReactNode;
}

export type ViewStateMessages = Readonly<
  Partial<Record<NonReadyViewSurfaceState, ViewStateMessage>>
>;

export interface ViewStateProps {
  readonly state?: ViewSurfaceState;
  readonly stateMessages?: ViewStateMessages;
}

export type PageSurfaceSlotName =
  | "content"
  | "description"
  | "main"
  | "root"
  | "state"
  | "toolbar"
  | "title";

export type PageSurfaceSlotValue = "page-surface" | `page-surface-${string}`;

export const PAGE_SURFACE_SLOTS = {
  content: "page-surface-content",
  description: "page-surface-description",
  main: "page-surface-main",
  root: "page-surface",
  state: "page-surface-state",
  title: "page-surface-title",
  toolbar: "page-surface-toolbar",
} as const satisfies Record<PageSurfaceSlotName, PageSurfaceSlotValue>;

export type PageSurfaceSlot =
  (typeof PAGE_SURFACE_SLOTS)[keyof typeof PAGE_SURFACE_SLOTS];

export interface PageSurfaceProps
  extends Omit<ComponentProps<"div">, "title">,
    ViewStateProps {
  readonly description?: ReactNode;
  readonly sidebar?: ReactNode;
  readonly title: ReactNode;
  readonly toolbar?: ReactNode;
}

export type MetricWidgetTone = "default" | "success" | "warning";

export type MetricWidgetSlotName =
  | "description"
  | "root"
  | "state"
  | "title"
  | "value";

export type MetricWidgetSlotValue = "metric-widget" | `metric-widget-${string}`;

export const METRIC_WIDGET_SLOTS = {
  description: "metric-widget-description",
  root: "metric-widget",
  state: "metric-widget-state",
  title: "metric-widget-title",
  value: "metric-widget-value",
} as const satisfies Record<MetricWidgetSlotName, MetricWidgetSlotValue>;

export type MetricWidgetSlot =
  (typeof METRIC_WIDGET_SLOTS)[keyof typeof METRIC_WIDGET_SLOTS];

interface MetricWidgetBaseProps
  extends Omit<ComponentProps<"article">, "title"> {
  readonly description?: ReactNode;
  readonly label: ReactNode;
  readonly stateMessages?: ViewStateMessages;
  readonly tone?: MetricWidgetTone;
  readonly valueClassName?: string;
}

export interface MetricWidgetReadyProps extends MetricWidgetBaseProps {
  readonly state?: "ready";
  readonly value: ReactNode;
}

export interface MetricWidgetNonReadyProps extends MetricWidgetBaseProps {
  readonly state: NonReadyViewSurfaceState;
  readonly value?: ReactNode;
}

export type MetricWidgetProps =
  | MetricWidgetNonReadyProps
  | MetricWidgetReadyProps;
