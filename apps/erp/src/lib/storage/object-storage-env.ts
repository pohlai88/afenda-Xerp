import type { EnvReaderSource } from "@/lib/env/env-reader-source";
import { readRuntimeEnvSource } from "@/lib/env/env-reader-source";

export const OBJECT_STORAGE_PROVIDER_ENV = "OBJECT_STORAGE_PROVIDER" as const;
export const OBJECT_STORAGE_BUCKET_ENV = "OBJECT_STORAGE_BUCKET" as const;
export const OBJECT_STORAGE_ENDPOINT_ENV = "OBJECT_STORAGE_ENDPOINT" as const;
export const OBJECT_STORAGE_ACCESS_KEY_ID_ENV =
  "OBJECT_STORAGE_ACCESS_KEY_ID" as const;
export const OBJECT_STORAGE_SECRET_ACCESS_KEY_ENV =
  "OBJECT_STORAGE_SECRET_ACCESS_KEY" as const;

export function readObjectStorageEndpoint(
  env: EnvReaderSource = readRuntimeEnvSource()
): string | null {
  const endpoint = env[OBJECT_STORAGE_ENDPOINT_ENV]?.trim();
  return endpoint && endpoint.length > 0 ? endpoint : null;
}

export function readObjectStorageBucket(
  env: EnvReaderSource = readRuntimeEnvSource()
): string | null {
  const bucket = env[OBJECT_STORAGE_BUCKET_ENV]?.trim();
  return bucket && bucket.length > 0 ? bucket : null;
}

export function hasObjectStorageConfig(
  env: EnvReaderSource = readRuntimeEnvSource()
): boolean {
  return (
    readObjectStorageBucket(env) !== null &&
    readObjectStorageEndpoint(env) !== null &&
    Boolean(env[OBJECT_STORAGE_SECRET_ACCESS_KEY_ENV]?.trim())
  );
}
