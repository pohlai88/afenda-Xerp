// biome-ignore-all lint/performance/noBarrelFile: package root is the curated public API surface.

export const PACKAGE_NAME = "@afenda/storage" as const;

export function getPackageName(): typeof PACKAGE_NAME {
  return PACKAGE_NAME;
}

export type {
  CreateSignedDownloadInput,
  SignedDownload,
} from "./contracts/signed-download.contract.js";
export type {
  CreateSignedUploadInput,
  SignedUpload,
} from "./contracts/signed-upload.contract.js";
export type {
  CreateStorageObjectInput,
  DeleteStorageObjectInput,
  GetStorageObjectInput,
  StorageHealthCheck,
} from "./contracts/storage.contract.js";
export {
  isStorageProductionProviderId,
  STORAGE_ADDITIONAL_APPROVED_PROVIDERS,
  STORAGE_PRODUCTION_PROVIDER_IDS,
  type StorageAdditionalApprovedProvider,
} from "./contracts/storage-additional-providers.contract.js";
export {
  STORAGE_ERROR_CODES,
  type StorageError,
  type StorageErrorCode,
} from "./contracts/storage-error.contract.js";
export type {
  StorageChecksum,
  StorageChecksumAlgorithm,
  StorageMetadata,
  StorageMetadataValue,
} from "./contracts/storage-metadata.contract.js";
export type {
  StorageObject,
  StorageObjectId,
  StorageProviderId,
} from "./contracts/storage-object.contract.js";
export type { StorageProvider } from "./contracts/storage-provider.contract.js";
export {
  createStorageFailure,
  createStorageSuccess,
  type StorageFailureResult,
  type StorageResult,
  type StorageSuccessResult,
} from "./contracts/storage-result.contract.js";
export {
  type BlobStorageProviderOptions,
  createBlobStorageProvider,
} from "./providers/blob.provider.js";
export {
  createR2StorageProvider,
  type R2StorageProviderOptions,
} from "./providers/r2.provider.js";
export {
  createStorageService,
  type StorageService,
  storageService,
} from "./services/storage.service.js";
