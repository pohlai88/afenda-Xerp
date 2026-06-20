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
import {
  createStorageFailure,
  createStorageSuccess,
} from "../contracts/storage-result.contract.js";
import { createSignedStorageUrl, createStorageObjectId } from "./signature.js";

export interface R2StorageProviderOptions {
  readonly baseUrl: string;
  readonly bucket: string;
  readonly signingSecret: string;
}

export function createStorageProviderForProviderId(
  providerId: StorageObject["provider"],
  options: R2StorageProviderOptions
): StorageProvider {
  const objects = new Map<string, StorageObject>();

  return {
    providerId,
    createObject(
      input: CreateStorageObjectInput
    ): Promise<StorageResult<StorageObject>> {
      if (input.bucket !== options.bucket) {
        return Promise.resolve(
          createStorageFailure("access_denied", "Bucket is not allowed.")
        );
      }

      const object: StorageObject = {
        bucket: input.bucket,
        checksum: input.checksum,
        companyId: input.companyId,
        createdAt: new Date().toISOString(),
        filename: input.filename,
        metadata: input.metadata,
        mimeType: input.mimeType,
        objectId: input.objectId,
        organizationId: input.organizationId,
        path: input.path,
        provider: providerId,
        size: input.size,
        tenantId: input.tenantId,
      };

      objects.set(input.objectId, object);

      return Promise.resolve(createStorageSuccess(object));
    },
    deleteObject(
      input: DeleteStorageObjectInput
    ): Promise<StorageResult<null>> {
      const existingObject = objects.get(input.objectId);

      if (!existingObject || existingObject.tenantId !== input.tenantId) {
        return Promise.resolve(
          createStorageFailure("not_found", "Storage object was not found.")
        );
      }

      objects.delete(input.objectId);

      return Promise.resolve(createStorageSuccess(null));
    },
    generateDownloadUrl(
      input: CreateSignedDownloadInput
    ): Promise<StorageResult<SignedDownload>> {
      const existingObject = objects.get(input.objectId);

      if (!existingObject || existingObject.tenantId !== input.tenantId) {
        return Promise.resolve(
          createStorageFailure("not_found", "Storage object was not found.")
        );
      }

      return Promise.resolve(
        createStorageSuccess({
          expiresAt: input.expiresAt,
          headers: {},
          method: "GET",
          objectId: input.objectId,
          url: createSignedStorageUrl({
            baseUrl: options.baseUrl,
            expiresAt: input.expiresAt,
            method: "GET",
            objectId: input.objectId,
            path: existingObject.path,
            signingSecret: options.signingSecret,
            tenantId: input.tenantId,
          }),
        })
      );
    },
    generateUploadUrl(
      input: CreateSignedUploadInput
    ): Promise<StorageResult<SignedUpload>> {
      if (input.bucket !== options.bucket) {
        return Promise.resolve(
          createStorageFailure("access_denied", "Bucket is not allowed.")
        );
      }

      const objectId = createStorageObjectId();

      return Promise.resolve(
        createStorageSuccess({
          expiresAt: input.expiresAt,
          headers: {
            "content-type": input.mimeType,
          },
          method: "PUT",
          objectId,
          url: createSignedStorageUrl({
            baseUrl: options.baseUrl,
            expiresAt: input.expiresAt,
            method: "PUT",
            objectId,
            path: input.path,
            signingSecret: options.signingSecret,
            tenantId: input.tenantId,
          }),
        })
      );
    },
    getObject(
      input: GetStorageObjectInput
    ): Promise<StorageResult<StorageObject>> {
      const existingObject = objects.get(input.objectId);

      if (!existingObject || existingObject.tenantId !== input.tenantId) {
        return Promise.resolve(
          createStorageFailure("not_found", "Storage object was not found.")
        );
      }

      return Promise.resolve(createStorageSuccess(existingObject));
    },
    healthCheck(): Promise<StorageResult<StorageHealthCheck>> {
      return Promise.resolve(
        createStorageSuccess({
          checkedAt: new Date().toISOString(),
          provider: providerId,
          status: "healthy",
        })
      );
    },
  };
}

export function createR2StorageProvider(
  options: R2StorageProviderOptions
): StorageProvider {
  return createStorageProviderForProviderId("r2", options);
}
