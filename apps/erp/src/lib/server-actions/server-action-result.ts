import type {
  AppError,
  AppErrorCode,
  ValidationFieldError,
} from "@afenda/kernel";

export interface ServerActionSuccess<TData> {
  readonly data: TData;
  readonly ok: true;
}

export interface ServerActionFailure {
  readonly code: AppErrorCode;
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
