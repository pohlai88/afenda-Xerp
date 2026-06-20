import type {
  CreateSignedDownloadInput,
  SignedDownload,
} from "./signed-download.contract.js";
import type {
  CreateSignedUploadInput,
  SignedUpload,
} from "./signed-upload.contract.js";
import type {
  CreateStorageObjectInput,
  DeleteStorageObjectInput,
  GetStorageObjectInput,
  StorageHealthCheck,
} from "./storage.contract.js";
import type {
  StorageObject,
  StorageProviderId,
} from "./storage-object.contract.js";
import type { StorageResult } from "./storage-result.contract.js";

export interface StorageProvider {
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
  readonly providerId: StorageProviderId;
}
