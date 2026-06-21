/**
 * Metadata action renderer contracts.
 *
 * Authority:
 * - Defines the renderer-layer contracts for metadata actions.
 * - Imports and re-exports action vocabulary from @afenda/metadata.
 * - Adds presentation hints, execution context, handler, and result shapes.
 * - Does not own action vocabulary, permissions, or business logic.
 */

export type {
  MetadataAction,
  MetadataActionAccess,
  MetadataActionAudit,
  MetadataActionConfirm,
  MetadataActionKind,
  MetadataActionTarget,
  MetadataActionVisibilityState,
} from "@afenda/metadata";

export interface MetadataActionPresentation {
  /**
   * Icon key resolved by the renderer.
   *
   * The renderer decides how to map this to an actual icon component.
   * Examples: "user-plus", "trash", "external-link"
   */
  readonly icon?: string;

  /**
   * Grouping key for action bars or menus.
   *
   * Examples: "primary", "secondary", "danger"
   */
  readonly group?: string;

  /**
   * Stable ordering value. Lower numbers render first.
   */
  readonly order?: number;
}

export interface MetadataActionContext {
  /**
   * Surface or section that emitted this action.
   */
  readonly source: string;

  /**
   * Optional record or entity currently in scope.
   */
  readonly targetId?: string;
}

export interface MetadataActionResult {
  readonly ok: boolean;
  readonly actionKey: string;
  readonly message?: string;
  readonly reason?: string;
}

export interface MetadataActionHandler {
  readonly (
    action: import("@afenda/metadata").MetadataAction,
    context: MetadataActionContext
  ): MetadataActionResult | Promise<MetadataActionResult>;
}
