import type { MetadataActionContract } from "./metadata-action.contract";
import type { MetadataAuditPanelContract } from "./metadata-audit-panel.contract";
import type { MetadataLayoutContract } from "./metadata-layout.contract";
import type { MetadataPermissionRequirement } from "./metadata-permission.contract";
import type { MetadataStateContract } from "./metadata-state.contract";

export const METADATA_SECTION_TYPES = [
  "page-header",
  "action-bar",
  "list",
  "form",
  "stat",
  "chart",
  "kanban",
  "detail-tabs",
  "audit-panel",
  "empty-state",
  "surface-chrome",
] as const;

export type MetadataSectionType = (typeof METADATA_SECTION_TYPES)[number];

export interface MetadataFieldSchema {
  readonly key: string;
  readonly label: string;
  readonly required: boolean;
  readonly valueType: "boolean" | "date" | "number" | "string";
}

export interface MetadataListColumn {
  readonly key: string;
  readonly label: string;
  readonly sortable: boolean;
  readonly valueType: MetadataFieldSchema["valueType"];
}

export interface MetadataSectionContract {
  readonly actions?: readonly MetadataActionContract[];
  readonly auditPanel?: MetadataAuditPanelContract;
  readonly columns?: readonly MetadataListColumn[];
  readonly description?: string;
  readonly fields?: readonly MetadataFieldSchema[];
  readonly id: string;
  readonly layout: MetadataLayoutContract;
  readonly permission?: MetadataPermissionRequirement;
  readonly state?: MetadataStateContract;
  readonly title: string;
  readonly type: MetadataSectionType;
}
