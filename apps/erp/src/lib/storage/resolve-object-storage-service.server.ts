import {
  createR2StorageProvider,
  createStorageService,
  type StorageService,
} from "@afenda/storage";

import type { EnvReaderSource } from "@/lib/env/env-reader-source";

import {
  OBJECT_STORAGE_ACCESS_KEY_ID_ENV,
  OBJECT_STORAGE_BUCKET_ENV,
  OBJECT_STORAGE_PROVIDER_ENV,
  OBJECT_STORAGE_SECRET_ACCESS_KEY_ENV,
  readObjectStorageBucket,
  readObjectStorageEndpoint,
} from "./object-storage-env";

export function resolveObjectStorageService(
  env: EnvReaderSource = process.env
): StorageService | null {
  const providerId = env[OBJECT_STORAGE_PROVIDER_ENV]?.trim() ?? "r2";

  if (providerId !== "r2") {
    return null;
  }

  const bucket = readObjectStorageBucket(env);
  const baseUrl = readObjectStorageEndpoint(env);
  const signingSecret = env[OBJECT_STORAGE_SECRET_ACCESS_KEY_ENV]?.trim();
  const accessKeyId = env[OBJECT_STORAGE_ACCESS_KEY_ID_ENV]?.trim();

  if (!(bucket && baseUrl && signingSecret && accessKeyId)) {
    return null;
  }

  return createStorageService(
    createR2StorageProvider({
      baseUrl,
      bucket,
      signingSecret,
    })
  );
}

export function resolveObjectStorageBucketName(
  env: EnvReaderSource = process.env
): string | null {
  return (
    readObjectStorageBucket(env) ??
    env[OBJECT_STORAGE_BUCKET_ENV]?.trim() ??
    null
  );
}
