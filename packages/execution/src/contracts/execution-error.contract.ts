export const EXECUTION_ERROR_CODES = [
  "provider_unavailable",
  "workflow_not_registered",
  "invalid_schedule",
  "invalid_retry_policy",
  "execution_not_found",
  "execution_blocked",
  "execution_cancelled",
  "execution_timed_out",
  "provider_error",
] as const;

export type ExecutionErrorCode = (typeof EXECUTION_ERROR_CODES)[number];

export interface ExecutionError {
  readonly code: ExecutionErrorCode;
  readonly message: string;
}
