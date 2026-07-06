export type StudioMetadataViewKind = "auth" | "page" | "widget";

export type StudioMetadataActionVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary";

export type StudioMetadataMetricTone = "default" | "success" | "warning";

export interface StudioMetadataAction {
  readonly id: string;
  readonly label: string;
  readonly variant?: StudioMetadataActionVariant;
}

export interface StudioMetadataNavigationItem {
  readonly href: string;
  readonly id: string;
  readonly label: string;
}

export interface StudioAuthViewMetadata {
  readonly description?: string;
  readonly kind: "auth";
  readonly submitLabel?: string;
  readonly title: string;
}

export interface StudioPageViewMetadata {
  readonly kind: "page";
  readonly navigation?: readonly StudioMetadataNavigationItem[];
  readonly title: string;
  readonly toolbarActions?: readonly StudioMetadataAction[];
}

export interface StudioMetricWidgetMetadata {
  readonly description?: string;
  readonly kind: "widget";
  readonly label: string;
  readonly tone?: StudioMetadataMetricTone;
  readonly value: string;
  readonly widget: "metric";
}

export interface StudioEvidenceWidgetItemMetadata {
  readonly id: string;
  readonly label: string;
  readonly status?: "complete" | "missing" | "pending";
}

export interface StudioEvidenceWidgetMetadata {
  readonly description?: string;
  readonly items?: readonly StudioEvidenceWidgetItemMetadata[];
  readonly kind: "widget";
  readonly label: string;
  readonly summary: string;
  readonly widget: "evidence";
}

export type StudioViewMetadata =
  | StudioAuthViewMetadata
  | StudioEvidenceWidgetMetadata
  | StudioMetricWidgetMetadata
  | StudioPageViewMetadata;
