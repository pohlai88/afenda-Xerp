import type { AppError, AppErrorCode, ValidationFieldError } from "@afenda/kernel";

export type ServerActionSuccess<TData> = {
  readonly ok: true;
  readonly data: TData;
};

export type ServerActionFailure = {
  readonly ok: false;
  readonly code: AppErrorCode;
  readonly userMessage: string;
  readonly fields?: readonly ValidationFieldError[];
};

export type ServerActionResult<TData> =
  | ServerActionSuccess<TData>
  | ServerActionFailure;

export function serverActionSuccess<TData>(
  data: TData
): ServerActionSuccess<TData> {
  return { ok: true, data };
}

export function serverActionFailure(
  error: AppError
): ServerActionFailure {
  if (error.code === "VALIDATION_ERROR") {
    return {
      ok: false,
      code: error.code,
      userMessage: error.userMessage,
      ...(error.fields === undefined ? {} : { fields: error.fields }),
    };
  }

  return {
    ok: false,
    code: error.code,
    userMessage: error.userMessage,
  };
}
