import type { AppError, ValidationFieldError } from "@afenda/kernel";
import { AppErrors } from "@afenda/kernel";
import type { ZodType, ZodError } from "zod";

function mapZodErrorToAppError(error: ZodError): AppError {
  const fields: ValidationFieldError[] = error.issues.map((issue) => ({
    path: issue.path.join(".") || "input",
    message: issue.message,
  }));

  return AppErrors.validation(fields);
}

export type ParsedActionInput<TValue> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: AppError };

export function parseActionInput<TValue>(
  schema: ZodType<TValue>,
  input: unknown
): ParsedActionInput<TValue> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: mapZodErrorToAppError(parsed.error) };
  }

  return { ok: true, value: parsed.data };
}
