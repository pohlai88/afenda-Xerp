import type {
  MetadataAction,
  MetadataActionErrorCode,
  MetadataActionFailureResult,
  MetadataActionResult,
  MetadataActionSuccessResult,
  MetadataActionWireResult,
} from "../contracts/action.contract.js";

export function createMetadataActionSuccess(
  actionKey: string,
  message?: string
): MetadataActionSuccessResult {
  return message === undefined
    ? { ok: true, actionKey }
    : { ok: true, actionKey, message };
}

export function createMetadataActionFailure(
  actionKey: string,
  code: MetadataActionErrorCode,
  userMessage: string,
  reason?: string
): MetadataActionFailureResult {
  return reason === undefined
    ? { ok: false, actionKey, code, userMessage }
    : { ok: false, actionKey, code, userMessage, reason };
}

export function isMetadataActionFailure(
  result: MetadataActionResult
): result is MetadataActionFailureResult {
  return result.ok === false;
}

export function isMetadataActionSuccess(
  result: MetadataActionResult
): result is MetadataActionSuccessResult {
  return result.ok === true;
}

/**
 * Normalizes unknown handler throws into a safe client-facing failure result.
 * Handlers must not throw to the UI — this is a last-resort guard in the renderer.
 */
export function createMetadataActionInternalError(
  actionKey: string
): MetadataActionFailureResult {
  return createMetadataActionFailure(
    actionKey,
    "INTERNAL_ERROR",
    "Something went wrong. Try again."
  );
}

export function actionRequiresConfirmation(action: MetadataAction): boolean {
  return action.kind === "destructive" || action.confirm !== undefined;
}

export function isDestructiveMetadataAction(action: MetadataAction): boolean {
  return action.kind === "destructive";
}

/**
 * Governance check for action metadata — destructive actions must declare confirm.
 * Does not enforce security; server actions must still re-verify authority.
 */
export function destructiveActionMissingConfirm(
  action: MetadataAction
): boolean {
  return isDestructiveMetadataAction(action) && action.confirm === undefined;
}

/** Strip internal diagnostics for JSON-safe wire egress. */
export function toMetadataActionWireResult(
  result: MetadataActionResult
): MetadataActionWireResult {
  switch (result.ok) {
    case true:
      return result.message === undefined
        ? { ok: true, actionKey: result.actionKey }
        : { ok: true, actionKey: result.actionKey, message: result.message };
    case false: {
      const { actionKey, code, userMessage } = result;
      return { ok: false, actionKey, code, userMessage };
    }
    default: {
      const _exhaustive: never = result;
      return _exhaustive;
    }
  }
}
