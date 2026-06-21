/**
 * Metadata action contracts.
 *
 * Authority:
 * - Defines action vocabulary for metadata-driven UI surfaces.
 * - Does not execute business logic.
 * - Does not own permissions, routing, or server actions.
 */

import type {
  MetadataRuntimeCapabilityKey,
  MetadataRuntimeFeatureFlagKey,
  MetadataRuntimePermissionKey,
} from "./runtime.contract.js";
import { METADATA_CONTRACT_VERSION } from "./metadata.version.js";

export const METADATA_ACTION_KINDS = [
  "button",
  "destructive",
  "link",
  "menu",
] as const;

export type MetadataActionKind = (typeof METADATA_ACTION_KINDS)[number];

export const METADATA_ACTION_VISIBILITY_STATES = [
  "visible",
  "hidden",
  "disabled",
] as const;

export type MetadataActionVisibilityState =
  (typeof METADATA_ACTION_VISIBILITY_STATES)[number];

export const METADATA_ACTION_TARGETS = ["self", "blank"] as const;

export type MetadataActionTarget = (typeof METADATA_ACTION_TARGETS)[number];

export const ACTION_CONTRACT_OWNERSHIPS = [
  "action-kinds",
  "action-visibility-states",
  "action-targets",
  "action-access-guards",
  "action-audit-metadata",
  "action-confirmation-vocabulary",
  "action-shape",
] as const;

export type ActionContractOwnership =
  (typeof ACTION_CONTRACT_OWNERSHIPS)[number];

export const ACTION_CONTRACT_PROHIBITIONS = [
  "permission-execution",
  "policy-execution",
  "audit-writing",
  "handler-implementation",
  "renderer-selection",
  "renderer-implementation",
  "ui-implementation",
  "business-logic",
  "server-actions",
  "database-access",
  "react-components",
] as const;

export type ActionContractProhibition =
  (typeof ACTION_CONTRACT_PROHIBITIONS)[number];

export interface MetadataActionConfirm {
  /**
   * Dialog title shown before executing a sensitive action.
   */
  readonly title: string;

  /**
   * Human-readable explanation of what will happen.
   */
  readonly description: string;

  /**
   * Label for the confirmation button.
   *
   * Examples: "Delete", "Archive", "Confirm"
   */
  readonly confirmLabel: string;

  /**
   * Optional cancel label. Defaults are handled by the renderer.
   */
  readonly cancelLabel?: string;
}

export interface MetadataActionAccess {
  /**
   * Permission required to render or execute this action.
   *
   * Uses the runtime permission key vocabulary.
   * The execution layer is responsible for enforcement — this is declarative.
   *
   * Example: "system_admin.users.manage"
   */
  readonly permission?: MetadataRuntimePermissionKey;

  /**
   * Capability required to render or execute this action.
   *
   * Example: "user.invite"
   */
  readonly capability?: MetadataRuntimeCapabilityKey;

  /**
   * Feature flag required before this action is available.
   *
   * Example: "feature.bulk-invite"
   */
  readonly featureFlag?: MetadataRuntimeFeatureFlagKey;
}

export interface MetadataActionAudit {
  /**
   * Audit action name written by the execution layer.
   *
   * This is declarative only — audit writing belongs to the execution layer.
   *
   * Examples: "user.invite", "record.delete", "metadata.action.execute"
   */
  readonly action: string;

  /**
   * Target type affected by the action.
   *
   * Examples: "user", "record", "surface"
   */
  readonly targetType?: string;

  /**
   * Optional target identifier. Usually supplied by the runtime layer.
   */
  readonly targetId?: string;
}

export interface MetadataAction {
  /**
   * Stable action key. Must be unique within the owning surface or section.
   *
   * Examples: "create-user", "archive-record", "open-detail"
   */
  readonly key: string;

  /**
   * Human-readable label.
   */
  readonly label: string;

  /**
   * Optional helper text shown in menus, tooltips, or command palettes.
   */
  readonly description?: string;

  /**
   * Action rendering and behavior kind.
   */
  readonly kind: MetadataActionKind;

  /**
   * URL for link actions.
   *
   * Required when kind === "link". Omit for command-style actions.
   */
  readonly href?: string;

  /**
   * Link target. Only meaningful when href is provided.
   */
  readonly target?: MetadataActionTarget;

  /**
   * Current visibility state.
   *
   * Single source of truth — prefer this over separate disabled/hidden booleans.
   */
  readonly visibility?: MetadataActionVisibilityState;

  /**
   * Human-readable reason explaining why the action is hidden or disabled.
   *
   * Required by convention when visibility is "hidden" or "disabled".
   */
  readonly reason?: string;

  /**
   * Confirmation contract for sensitive actions.
   *
   * Required by convention for destructive actions.
   */
  readonly confirm?: MetadataActionConfirm;

  /**
   * Permission, capability, or feature-flag guard.
   *
   * The renderer may use this for display decisions.
   * The server and action layer must still enforce authority independently.
   */
  readonly access?: MetadataActionAccess;

  /**
   * Audit metadata.
   *
   * Declarative only. Actual audit writing belongs to the execution layer.
   */
  readonly audit?: MetadataActionAudit;
}

export interface ActionContract {
  readonly authority: "action";
  readonly version: typeof METADATA_CONTRACT_VERSION;

  /**
   * Action contract owns action vocabulary only.
   *
   * It defines action kinds, visibility states, link targets, access guards,
   * audit metadata, confirmation vocabulary, and the core action shape.
   * It must not execute permissions, write audit logs, implement handlers,
   * or contain UI or renderer implementation.
   */
  readonly owns: readonly ActionContractOwnership[];

  /**
   * Governed action kinds.
   */
  readonly kinds: readonly MetadataActionKind[];

  /**
   * Governed visibility states.
   */
  readonly visibilityStates: readonly MetadataActionVisibilityState[];

  /**
   * Governed link targets.
   */
  readonly targets: readonly MetadataActionTarget[];

  /**
   * Responsibilities explicitly forbidden from the action contract.
   */
  readonly prohibits: readonly ActionContractProhibition[];
}

export const actionContract = {
  authority: "action",
  version: METADATA_CONTRACT_VERSION,

  owns: ACTION_CONTRACT_OWNERSHIPS,

  kinds: METADATA_ACTION_KINDS,

  visibilityStates: METADATA_ACTION_VISIBILITY_STATES,

  targets: METADATA_ACTION_TARGETS,

  prohibits: ACTION_CONTRACT_PROHIBITIONS,
} as const satisfies ActionContract;
