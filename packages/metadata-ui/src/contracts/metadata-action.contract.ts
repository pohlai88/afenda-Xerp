import type { PermissionKey } from "@afenda/permissions";
import type { MetadataPermissionRequirement } from "./metadata-permission.contract";

export const METADATA_ACTION_CATEGORIES = [
  "standard",
  "destructive",
  "financial",
  "export",
  "ai",
  "approval",
] as const;

export type MetadataActionCategory =
  (typeof METADATA_ACTION_CATEGORIES)[number];

export type MetadataActionExecutionMode =
  | "command"
  | "navigate"
  | "open-panel"
  | "submit";

export interface MetadataActionAudit {
  readonly action: string;
  readonly evidence: readonly string[];
  readonly targetType: string;
}

export interface MetadataActionPolicy {
  readonly confirmationRequired: boolean;
  readonly policyKey?: string;
}

export interface MetadataActionContract {
  readonly audit: MetadataActionAudit;
  readonly category: MetadataActionCategory;
  readonly commandId: string;
  readonly executionMode: MetadataActionExecutionMode;
  readonly id: string;
  readonly label: string;
  readonly permission: MetadataPermissionRequirement & {
    readonly permissionKey: PermissionKey;
  };
  readonly policy?: MetadataActionPolicy;
}
