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

export type DataTableSurfaceSlotName =
  | "caption"
  | "cell"
  | "content"
  | "description"
  | "header"
  | "root"
  | "state"
  | "stateAction"
  | "table"
  | "title";

export type DataTableSurfaceSlotValue =
  | "data-table-surface"
  | `data-table-surface-${string}`;

export const DATA_TABLE_SURFACE_SLOTS = {
  caption: "data-table-surface-caption",
  cell: "data-table-surface-cell",
  content: "data-table-surface-content",
  description: "data-table-surface-description",
  header: "data-table-surface-header",
  root: "data-table-surface",
  state: "data-table-surface-state",
  stateAction: "data-table-surface-state-action",
  table: "data-table-surface-table",
  title: "data-table-surface-title",
} as const satisfies Record<
  DataTableSurfaceSlotName,
  DataTableSurfaceSlotValue
>;

export type DataTableSurfaceSlot =
  (typeof DATA_TABLE_SURFACE_SLOTS)[keyof typeof DATA_TABLE_SURFACE_SLOTS];

export type DataTableSurfaceColumnAlign = "center" | "end" | "start";

export interface DataTableSurfaceColumn {
  readonly align?: DataTableSurfaceColumnAlign;
  readonly header: ReactNode;
  readonly id: string;
}

export interface DataTableSurfaceRow {
  readonly cells: Readonly<Record<string, ReactNode>>;
  readonly id: string;
}

export interface DataTableSurfaceProps
  extends Omit<ComponentProps<"section">, "title">,
    ViewStateProps {
  readonly caption?: ReactNode;
  readonly columns: readonly DataTableSurfaceColumn[];
  readonly description?: ReactNode;
  readonly label?: string;
  readonly rows?: readonly DataTableSurfaceRow[];
  readonly title: ReactNode;
}

export type FormSurfaceSlotName =
  | "actions"
  | "content"
  | "description"
  | "field"
  | "fieldControl"
  | "fieldDescription"
  | "fieldMessage"
  | "fieldTitle"
  | "root"
  | "state"
  | "stateAction"
  | "title";

export type FormSurfaceSlotValue = "form-surface" | `form-surface-${string}`;

export const FORM_SURFACE_SLOTS = {
  actions: "form-surface-actions",
  content: "form-surface-content",
  description: "form-surface-description",
  field: "form-surface-field",
  fieldControl: "form-surface-field-control",
  fieldDescription: "form-surface-field-description",
  fieldMessage: "form-surface-field-message",
  fieldTitle: "form-surface-field-title",
  root: "form-surface",
  state: "form-surface-state",
  stateAction: "form-surface-state-action",
  title: "form-surface-title",
} as const satisfies Record<FormSurfaceSlotName, FormSurfaceSlotValue>;

export type FormSurfaceSlot =
  (typeof FORM_SURFACE_SLOTS)[keyof typeof FORM_SURFACE_SLOTS];

export interface FormSurfaceField {
  readonly control: ReactNode;
  readonly description?: ReactNode;
  readonly id: string;
  readonly label: ReactNode;
  readonly message?: ReactNode;
  readonly required?: boolean;
  readonly state?: "default" | "invalid";
}

export interface FormSurfaceProps
  extends Omit<ComponentProps<"section">, "title">,
    ViewStateProps {
  readonly actions?: ReactNode;
  readonly description?: ReactNode;
  readonly fields?: readonly FormSurfaceField[];
  readonly label?: string;
  readonly title: ReactNode;
}

export type ConfirmDialogSurfaceIntent = "default" | "destructive";

export type ConfirmDialogSurfaceSlotName =
  | "actions"
  | "cancelAction"
  | "confirmAction"
  | "content"
  | "description"
  | "root"
  | "state"
  | "stateAction"
  | "title";

export type ConfirmDialogSurfaceSlotValue =
  | "confirm-dialog-surface"
  | `confirm-dialog-surface-${string}`;

export const CONFIRM_DIALOG_SURFACE_SLOTS = {
  actions: "confirm-dialog-surface-actions",
  cancelAction: "confirm-dialog-surface-cancel-action",
  confirmAction: "confirm-dialog-surface-confirm-action",
  content: "confirm-dialog-surface-content",
  description: "confirm-dialog-surface-description",
  root: "confirm-dialog-surface",
  state: "confirm-dialog-surface-state",
  stateAction: "confirm-dialog-surface-state-action",
  title: "confirm-dialog-surface-title",
} as const satisfies Record<
  ConfirmDialogSurfaceSlotName,
  ConfirmDialogSurfaceSlotValue
>;

export type ConfirmDialogSurfaceSlot =
  (typeof CONFIRM_DIALOG_SURFACE_SLOTS)[keyof typeof CONFIRM_DIALOG_SURFACE_SLOTS];

export interface ConfirmDialogSurfaceProps
  extends Omit<ComponentProps<"section">, "title">,
    ViewStateProps {
  readonly actions?: ReactNode;
  readonly cancelLabel?: ReactNode;
  readonly confirmLabel?: ReactNode;
  readonly description?: ReactNode;
  readonly intent?: ConfirmDialogSurfaceIntent;
  readonly label?: string;
  readonly title: ReactNode;
}

export type SettingsSurfaceSlotName =
  | "content"
  | "description"
  | "item"
  | "itemControl"
  | "itemDescription"
  | "itemLabel"
  | "root"
  | "section"
  | "sectionDescription"
  | "sectionTitle"
  | "state"
  | "stateAction"
  | "title";

export type SettingsSurfaceSlotValue =
  | "settings-surface"
  | `settings-surface-${string}`;

export const SETTINGS_SURFACE_SLOTS = {
  content: "settings-surface-content",
  description: "settings-surface-description",
  item: "settings-surface-item",
  itemControl: "settings-surface-item-control",
  itemDescription: "settings-surface-item-description",
  itemLabel: "settings-surface-item-label",
  root: "settings-surface",
  section: "settings-surface-section",
  sectionDescription: "settings-surface-section-description",
  sectionTitle: "settings-surface-section-title",
  state: "settings-surface-state",
  stateAction: "settings-surface-state-action",
  title: "settings-surface-title",
} as const satisfies Record<SettingsSurfaceSlotName, SettingsSurfaceSlotValue>;

export type SettingsSurfaceSlot =
  (typeof SETTINGS_SURFACE_SLOTS)[keyof typeof SETTINGS_SURFACE_SLOTS];

export interface SettingsSurfaceItem {
  readonly control?: ReactNode;
  readonly description?: ReactNode;
  readonly id: string;
  readonly label: ReactNode;
}

export interface SettingsSurfaceSection {
  readonly description?: ReactNode;
  readonly id: string;
  readonly items: readonly SettingsSurfaceItem[];
  readonly title: ReactNode;
}

export interface SettingsSurfaceProps
  extends Omit<ComponentProps<"section">, "title">,
    ViewStateProps {
  readonly description?: ReactNode;
  readonly label?: string;
  readonly sections?: readonly SettingsSurfaceSection[];
  readonly title: ReactNode;
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
