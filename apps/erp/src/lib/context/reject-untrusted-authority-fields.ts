import { type AppError, AppErrors } from "@afenda/kernel";

import { findUntrustedClientAuthorityFields } from "./untrusted-client-authority.server.js";

const UNTRUSTED_AUTHORITY_FIELD_MESSAGE =
  "Authority scope must be resolved server-side from headers and verified membership.";

export function rejectUntrustedAuthorityFields(
  value: unknown
): AppError | null {
  const forbiddenFields = findUntrustedClientAuthorityFields(value);

  if (forbiddenFields.length === 0) {
    return null;
  }

  return AppErrors.validation(
    forbiddenFields.map((field) => ({
      path: field,
      message: UNTRUSTED_AUTHORITY_FIELD_MESSAGE,
    }))
  );
}
