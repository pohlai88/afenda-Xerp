import type { ComponentProps, ReactNode } from "react";
import type { SidebarProps, TopbarProps } from "./layout";

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

export type WorkspaceBoardUseCase =
  | "audit"
  | "bi-analytics"
  | "erp-workspace"
  | "executive"
  | "operations";

export type WorkspaceBoardWidgetCategory =
  | "approval"
  | "chart"
  | "evidence"
  | "metric"
  | "report"
  | "shortcut"
  | "table";

export interface WorkspaceBoardWidgetSize {
  readonly h: number;
  readonly w: number;
}

export interface WorkspaceBoardWidgetLayout extends WorkspaceBoardWidgetSize {
  readonly maxH?: number;
  readonly maxW?: number;
  readonly minH?: number;
  readonly minW?: number;
  readonly x: number;
  readonly y: number;
}

export interface WorkspaceBoardVisibilityRule {
  readonly kind: "capability" | "role" | "tenant";
  readonly value: string;
}

export interface WorkspaceBoardWidgetManifest {
  readonly allowedDataSourceKinds: readonly string[];
  readonly category: WorkspaceBoardWidgetCategory;
  readonly defaultSize: WorkspaceBoardWidgetSize;
  readonly description: string;
  readonly kind: string;
  readonly label: string;
  readonly maxSize?: WorkspaceBoardWidgetSize;
  readonly minSize: WorkspaceBoardWidgetSize;
  readonly requiredCapabilities: readonly string[];
}

export interface WorkspaceBoardWidgetInstance {
  readonly config: Record<string, unknown>;
  readonly dataSourceId: string;
  readonly id: string;
  readonly kind: string;
  readonly layout: WorkspaceBoardWidgetLayout;
  readonly title: string;
  readonly visibility?: WorkspaceBoardVisibilityRule;
}

export interface WorkspaceBoardWidgetAdapterProps {
  readonly adapterKind?: string;
  readonly dataSourceKind?: string;
  readonly layout?: WorkspaceBoardWidgetLayout;
  readonly useCase?: WorkspaceBoardUseCase;
}

export type MetricWidgetAdapterProps = Omit<
  WorkspaceBoardWidgetAdapterProps,
  "adapterKind"
>;

export type PageSurfaceSlotName =
  | "content"
  | "description"
  | "main"
  | "root"
  | "sidebar"
  | "state"
  | "stateAction"
  | "toolbar"
  | "title";

export type PageSurfaceSlotValue = "page-surface" | `page-surface-${string}`;

export const PAGE_SURFACE_SLOTS = {
  content: "page-surface-content",
  description: "page-surface-description",
  main: "page-surface-main",
  root: "page-surface",
  sidebar: "page-surface-sidebar",
  state: "page-surface-state",
  stateAction: "page-surface-state-action",
  title: "page-surface-title",
  toolbar: "page-surface-toolbar",
} as const satisfies Record<PageSurfaceSlotName, PageSurfaceSlotValue>;

export type PageSurfaceSlot =
  (typeof PAGE_SURFACE_SLOTS)[keyof typeof PAGE_SURFACE_SLOTS];

export type PageSurfaceSidebarProps = Omit<SidebarProps, "children">;

export type PageSurfaceTopbarProps = Omit<
  TopbarProps,
  "actions" | "children" | "content" | "description" | "heading"
>;

export interface PageSurfaceProps
  extends Omit<ComponentProps<"main">, "title">,
    ViewStateProps {
  readonly description?: ReactNode;
  readonly mainLabel?: string;
  readonly sidebar?: ReactNode;
  readonly sidebarLabel?: string;
  readonly sidebarProps?: PageSurfaceSidebarProps;
  readonly title: ReactNode;
  readonly toolbar?: ReactNode;
  readonly topbarProps?: PageSurfaceTopbarProps;
}

export type MetricWidgetTone = "default" | "success" | "warning";

export type MetricWidgetSlotName =
  | "content"
  | "description"
  | "root"
  | "state"
  | "stateAction"
  | "title"
  | "value";

export type MetricWidgetSlotValue = "metric-widget" | `metric-widget-${string}`;

export const METRIC_WIDGET_SLOTS = {
  content: "metric-widget-content",
  description: "metric-widget-description",
  root: "metric-widget",
  state: "metric-widget-state",
  stateAction: "metric-widget-state-action",
  title: "metric-widget-title",
  value: "metric-widget-value",
} as const satisfies Record<MetricWidgetSlotName, MetricWidgetSlotValue>;

export type MetricWidgetSlot =
  (typeof METRIC_WIDGET_SLOTS)[keyof typeof METRIC_WIDGET_SLOTS];

export type MetricWidgetValue = Exclude<ReactNode, boolean | null | undefined>;

interface MetricWidgetBaseProps
  extends Omit<ComponentProps<"article">, "title">,
    MetricWidgetAdapterProps {
  readonly description?: ReactNode;
  readonly label: ReactNode;
  readonly stateMessages?: ViewStateMessages;
  readonly tone?: MetricWidgetTone;
}

export interface MetricWidgetReadyProps extends MetricWidgetBaseProps {
  readonly state?: "ready";
  readonly value: MetricWidgetValue;
}

export interface MetricWidgetNonReadyProps extends MetricWidgetBaseProps {
  readonly state: NonReadyViewSurfaceState;
  readonly value?: never;
}

export type MetricWidgetProps =
  | MetricWidgetNonReadyProps
  | MetricWidgetReadyProps;
