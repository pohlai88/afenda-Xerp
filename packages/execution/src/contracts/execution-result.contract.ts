import type { ExecutionError } from "./execution-error.contract.js";

export interface ExecutionFailureResult {
  readonly error: ExecutionError;
  readonly status: ExecutionError["code"];
}

export interface ExecutionSuccessResult<TValue> {
  readonly status: "success";
  readonly value: TValue;
}

export type ExecutionResult<TValue> =
  | ExecutionFailureResult
  | ExecutionSuccessResult<TValue>;

export function createExecutionFailure(
  status: ExecutionFailureResult["status"],
  message: string
): ExecutionFailureResult {
  return {
    error: {
      code: status,
      message,
    },
    status,
  };
}

export function createExecutionSuccess<TValue>(
  value: TValue
): ExecutionSuccessResult<TValue> {
  return {
    status: "success",
    value,
  };
}

export function isExecutionSuccess<TValue>(
  result: ExecutionResult<TValue>
): result is ExecutionSuccessResult<TValue> {
  return result.status === "success";
}
