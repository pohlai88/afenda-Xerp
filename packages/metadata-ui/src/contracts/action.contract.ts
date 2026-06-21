/**
 * Metadata action contracts.
 *
 * Authority:
 * - Re-exports action vocabulary from @afenda/metadata.
 * - Adds metadata-ui render and handler contracts.
 *
 * Security:
 * - metadata-ui never executes server actions or permission checks.
 * - Handlers are consumer-owned; results align with server-action-security vocabulary.
 */

import type { MetadataAction as MetadataAuthorityAction } from "@afenda/metadata";

export type {
  MetadataAction,
  MetadataActionAccess,
  MetadataActionAudit,
  MetadataActionConfirm,
  MetadataActionKind,
  MetadataActionTarget,
  MetadataActionVisibilityState,
} from "@afenda/metadata";

/**
 * Error codes aligned with server-action-security vocabulary.
 *
 * Consumers should return these from Server Actions invoked by onAction handlers.
 */
export const METADATA_ACTION_ERROR_CODES = [
  "UNAUTHORIZED",
  "FORBIDDEN",
  "NOT_FOUND",
  "VALIDATION_ERROR",
  "CONFLICT",
  "INTERNAL_ERROR",
] as const;

export type MetadataActionErrorCode =
  (typeof METADATA_ACTION_ERROR_CODES)[number];

export const METADATA_ACTION_GROUPS = [
  "primary",
  "secondary",
  "tertiary",
] as const;

export type MetadataActionGroup = (typeof METADATA_ACTION_GROUPS)[number];

export interface MetadataActionPresentation {
  /**
   * Icon key resolved by the renderer.
   */
  readonly icon?: string;

  /**
   * Visual hierarchy group exposed as data-action-group.
   * Legacy string values (e.g. "help") map to tertiary.
   */
  readonly group?: MetadataActionGroup | string;

  /**
   * Stable ordering value. Lower numbers render first.
   */
  readonly order?: number;
}

/**
 * Action shape used by metadata-ui renderers.
 *
 * Presentation hints are renderer-owned and optional at render time.
 */
export interface MetadataRenderableAction extends MetadataAuthorityAction {
  readonly presentation?: MetadataActionPresentation;
}

export interface MetadataActionContext {
  /**
   * Surface or section that emitted this action.
   */
  readonly source: string;

  /**
   * Optional record or entity currently in scope.
   *
   * Server actions invoked from the handler must re-verify ownership of this ID.
   */
  readonly targetId?: string;
}

export interface MetadataActionSuccessResult {
  readonly ok: true;
  readonly actionKey: string;
  readonly message?: string;
}

export interface MetadataActionFailureResult {
  readonly ok: false;
  readonly actionKey: string;
  readonly code: MetadataActionErrorCode;
  readonly userMessage: string;
  /**
   * Optional internal detail for logs — never render raw DB or stack data in UI.
   */
  readonly reason?: string;
}

export type MetadataActionResult =
  | MetadataActionSuccessResult
  | MetadataActionFailureResult;

/**
 * Consumer-owned handler. Wire to a Server Action that re-verifies session,
 * validates input, checks ownership, and returns MetadataActionResult.
 *
 * metadata-ui does not execute this handler on server-rendered surfaces.
 */
export type MetadataActionHandler = (
  action: MetadataAuthorityAction,
  context: MetadataActionContext
) => MetadataActionResult | Promise<MetadataActionResult>;

export type MetadataActionResultHandler = (
  result: MetadataActionResult
) => void;
