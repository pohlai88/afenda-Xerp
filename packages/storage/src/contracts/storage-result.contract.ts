import type { StorageError } from "./storage-error.contract.js";

export interface StorageFailureResult {
  readonly error: StorageError;
  readonly status: StorageError["code"];
}

export interface StorageSuccessResult<TValue> {
  readonly status: "success";
  readonly value: TValue;
}

export type StorageResult<TValue> =
  | StorageFailureResult
  | StorageSuccessResult<TValue>;

export function createStorageFailure(
  status: StorageFailureResult["status"],
  message: string
): StorageFailureResult {
  return {
    error: {
      code: status,
      message,
    },
    status,
  };
}

export function createStorageSuccess<TValue>(
  value: TValue
): StorageSuccessResult<TValue> {
  return {
    status: "success",
    value,
  };
}
