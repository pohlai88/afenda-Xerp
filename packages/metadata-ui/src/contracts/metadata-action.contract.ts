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

/**
 * A governed UI action. Every action must carry a permission requirement,
 * an audit descriptor, and — for sensitive categories — a policy or
 * confirmation contract. Actions are never executed from metadata alone;
 * modules dispatch the `commandId` through their own behavior layer.
 */
export interface MetadataActionContract {
  readonly audit: MetadataActionAudit;
  readonly category: MetadataActionCategory;
  readonly commandId: string;
  readonly executionMode: MetadataActionExecutionMode;
  readonly id: string;
  readonly label: string;
  /** Every action requires a full permission requirement including a key. */
  readonly permission: MetadataPermissionRequirement;
  readonly policy?: MetadataActionPolicy;
}
