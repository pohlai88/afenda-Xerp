import type { AppError, ValidationFieldError } from "@afenda/kernel";
import { toAppErrorWire } from "@afenda/kernel";

export interface ServerActionSuccess<TData> {
  readonly data: TData;
  readonly ok: true;
}

export interface ServerActionFailure {
  readonly code: AppError["code"];
  readonly fields?: readonly ValidationFieldError[];
  readonly ok: false;
  readonly userMessage: string;
}

export type ServerActionResult<TData> =
  | ServerActionSuccess<TData>
  | ServerActionFailure;

export function serverActionSuccess<TData>(
  data: TData
): ServerActionSuccess<TData> {
  return { ok: true, data };
}

export function serverActionFailure(error: AppError): ServerActionFailure {
  const wire = toAppErrorWire(error);

  if (wire.code === "VALIDATION_ERROR") {
    return {
      ok: false,
      code: wire.code,
      userMessage: wire.userMessage,
      ...(wire.fields === undefined ? {} : { fields: wire.fields }),
    };
  }

  return {
    ok: false,
    code: wire.code,
    userMessage: wire.userMessage,
  };
}
