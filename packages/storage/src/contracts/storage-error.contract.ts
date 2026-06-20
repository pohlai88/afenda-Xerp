export const STORAGE_ERROR_CODES = [
  "success",
  "failure",
  "not_found",
  "access_denied",
  "expired",
  "provider_unavailable",
] as const;

export type StorageErrorCode = (typeof STORAGE_ERROR_CODES)[number];

export interface StorageError {
  readonly code: Exclude<StorageErrorCode, "success">;
  readonly message: string;
}
