import type { EnvReaderSource } from "@/lib/env/env-reader-source";

import { readObjectStorageEndpoint } from "./object-storage-env";

export function resolveObjectStorageCspImgOrigins(
  env: EnvReaderSource = process.env
): readonly string[] {
  const endpoint = readObjectStorageEndpoint(env);

  if (!endpoint) {
    return [];
  }

  try {
    const origin = new URL(endpoint).origin;
    return origin.length > 0 ? [origin] : [];
  } catch {
    return [];
  }
}
