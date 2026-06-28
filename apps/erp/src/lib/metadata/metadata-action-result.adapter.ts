import type { AppError } from "@afenda/kernel";
import { toAppErrorWire } from "@afenda/kernel";
import type {
  MetadataActionFailureResult,
  MetadataActionResult,
  MetadataActionSuccessResult,
} from "@afenda/metadata-ui";

import type {
  ServerActionFailure,
  ServerActionResult,
} from "../server-actions/server-action-result.js";

export function appErrorToMetadataActionFailure(
  actionKey: string,
  error: AppError
): MetadataActionFailureResult {
  const wire = toAppErrorWire(error);

  return {
    ok: false,
    actionKey,
    code: wire.code,
    userMessage: wire.userMessage,
  };
}

export function serverActionFailureToMetadataActionResult(
  actionKey: string,
  failure: ServerActionFailure
): MetadataActionFailureResult {
  return {
    ok: false,
    actionKey,
    code: failure.code,
    userMessage: failure.userMessage,
  };
}

export function metadataActionSuccessFromServerAction(
  actionKey: string,
  data?: string
): MetadataActionSuccessResult {
  return data === undefined
    ? { ok: true, actionKey }
    : { ok: true, actionKey, message: data };
}

/** Maps a protected server action result to metadata-ui handler vocabulary. */
export function serverActionResultToMetadataActionResult<TData>(
  actionKey: string,
  result: ServerActionResult<TData>,
  successMessage?: string
): MetadataActionResult {
  if (result.ok) {
    return metadataActionSuccessFromServerAction(actionKey, successMessage);
  }

  return serverActionFailureToMetadataActionResult(actionKey, result);
}
