import type { AppError } from "@afenda/kernel";
import type { ZodType } from "zod";

import { rejectUntrustedAuthorityFields } from "@/lib/context/reject-untrusted-authority-fields";

import { type ParsedActionInput, parseActionInput } from "./parse-action-input";

export function parseProtectedActionInput<TValue>(
  schema: ZodType<TValue>,
  input: unknown
): ParsedActionInput<TValue> {
  const authorityError = rejectUntrustedAuthorityFields(input);
  if (authorityError) {
    return { ok: false, error: authorityError };
  }

  return parseActionInput(schema, input);
}

export type { AppError, ParsedActionInput };
