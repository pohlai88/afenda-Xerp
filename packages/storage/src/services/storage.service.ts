import type {
  CreateSignedDownloadInput,
  SignedDownload,
} from "../contracts/signed-download.contract.js";
import type {
  CreateSignedUploadInput,
  SignedUpload,
} from "../contracts/signed-upload.contract.js";
import type {
  CreateStorageObjectInput,
  DeleteStorageObjectInput,
  GetStorageObjectInput,
  StorageHealthCheck,
} from "../contracts/storage.contract.js";
import type { StorageObject } from "../contracts/storage-object.contract.js";
import type { StorageProvider } from "../contracts/storage-provider.contract.js";
import type { StorageResult } from "../contracts/storage-result.contract.js";
import { createStorageFailure } from "../contracts/storage-result.contract.js";

export interface StorageService {
  createObject(
    input: CreateStorageObjectInput
  ): Promise<StorageResult<StorageObject>>;
  deleteObject(input: DeleteStorageObjectInput): Promise<StorageResult<null>>;
  generateDownloadUrl(
    input: CreateSignedDownloadInput
  ): Promise<StorageResult<SignedDownload>>;
  generateUploadUrl(
    input: CreateSignedUploadInput
  ): Promise<StorageResult<SignedUpload>>;
  getObject(
    input: GetStorageObjectInput
  ): Promise<StorageResult<StorageObject>>;
  healthCheck(): Promise<StorageResult<StorageHealthCheck>>;
}

const providerUnavailableMessage = "Storage provider is unavailable.";

const unavailableProvider: StorageProvider = {
  providerId: "r2",
  createObject(): Promise<StorageResult<StorageObject>> {
    return Promise.resolve(
      createStorageFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
  deleteObject(): Promise<StorageResult<null>> {
    return Promise.resolve(
      createStorageFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
  generateDownloadUrl(): Promise<StorageResult<SignedDownload>> {
    return Promise.resolve(
      createStorageFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
  generateUploadUrl(): Promise<StorageResult<SignedUpload>> {
    return Promise.resolve(
      createStorageFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
  getObject(): Promise<StorageResult<StorageObject>> {
    return Promise.resolve(
      createStorageFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
  healthCheck(): Promise<StorageResult<StorageHealthCheck>> {
    return Promise.resolve(
      createStorageFailure("provider_unavailable", providerUnavailableMessage)
    );
  },
};

async function protectStorageCall<TValue>(
  operation: () => Promise<StorageResult<TValue>>
): Promise<StorageResult<TValue>> {
  try {
    return await operation();
  } catch (error: unknown) {
    return createStorageFailure(
      "provider_unavailable",
      error instanceof Error ? error.message : providerUnavailableMessage
    );
  }
}

/**
 * Creates a tenant-scoped storage facade that delegates all operations to the
 * injected {@link StorageProvider}.
 *
 * ERP and server hosts **must** call this factory with a live provider configured
 * for their environment (for example `createR2StorageProvider` or
 * `createBlobStorageProvider`). Do not add env-driven default wiring to the
 * module singleton — injection keeps tenant bucket strategy explicit at the
 * application boundary.
 *
 * @param provider - Live storage adapter; required for any mutating or signed-URL path.
 * @returns A {@link StorageService} that normalizes thrown provider errors to
 *   `provider_unavailable` results.
 */
export function createStorageService(
  provider: StorageProvider
): StorageService {
  return {
    createObject(input: CreateStorageObjectInput) {
      return protectStorageCall(() => provider.createObject(input));
    },
    deleteObject(input: DeleteStorageObjectInput) {
      return protectStorageCall(() => provider.deleteObject(input));
    },
    generateDownloadUrl(input: CreateSignedDownloadInput) {
      return protectStorageCall(() => provider.generateDownloadUrl(input));
    },
    generateUploadUrl(input: CreateSignedUploadInput) {
      return protectStorageCall(() => provider.generateUploadUrl(input));
    },
    getObject(input: GetStorageObjectInput) {
      return protectStorageCall(() => provider.getObject(input));
    },
    healthCheck() {
      return protectStorageCall(() => provider.healthCheck());
    },
  };
}

/**
 * Default export stub — intentionally returns `provider_unavailable` on every
 * operation until a host injects a live provider via {@link createStorageService}.
 *
 * Waiver: `storage-default-stub-export` (fdr-015-tenant-storage) — scaffold safety
 * for unconsumed package state; production paths must not rely on this singleton.
 */
export const storageService = createStorageService(unavailableProvider);
