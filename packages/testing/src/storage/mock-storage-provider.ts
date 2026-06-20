import {
  type CreateSignedDownloadInput,
  type CreateSignedUploadInput,
  type CreateStorageObjectInput,
  createStorageFailure,
  createStorageSuccess,
  type DeleteStorageObjectInput,
  type GetStorageObjectInput,
  type SignedDownload,
  type SignedUpload,
  type StorageHealthCheck,
  type StorageObject,
  type StorageProvider,
  type StorageProviderId,
  type StorageResult,
} from "@afenda/storage";

export interface MockStorageProviderOptions {
  readonly nowIso?: string;
  readonly providerId?: StorageProviderId;
}

const defaultNowIso = "2026-06-20T00:00:00.000Z";

function createSignedUrl(
  method: SignedDownload["method"] | SignedUpload["method"],
  objectId: string
): string {
  const url = new URL("https://storage.test/signed");
  url.searchParams.set("method", method);
  url.searchParams.set("objectId", objectId);

  return url.toString();
}

export function createMockStorageProvider(
  options: MockStorageProviderOptions = {}
): StorageProvider {
  const providerId = options.providerId ?? "r2";
  const nowIso = options.nowIso ?? defaultNowIso;
  const objects = new Map<string, StorageObject>();

  return {
    providerId,
    createObject(
      input: CreateStorageObjectInput
    ): Promise<StorageResult<StorageObject>> {
      const object: StorageObject = {
        bucket: input.bucket,
        checksum: input.checksum,
        companyId: input.companyId,
        createdAt: nowIso,
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
      const object = objects.get(input.objectId);

      if (!object || object.tenantId !== input.tenantId) {
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
      const object = objects.get(input.objectId);

      if (!object || object.tenantId !== input.tenantId) {
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
          url: createSignedUrl("GET", input.objectId),
        })
      );
    },
    generateUploadUrl(
      input: CreateSignedUploadInput
    ): Promise<StorageResult<SignedUpload>> {
      return Promise.resolve(
        createStorageSuccess({
          expiresAt: input.expiresAt,
          headers: {
            "content-type": input.mimeType,
          },
          method: "PUT",
          objectId: `${input.tenantId}:${input.path}`,
          url: createSignedUrl("PUT", `${input.tenantId}:${input.path}`),
        })
      );
    },
    getObject(
      input: GetStorageObjectInput
    ): Promise<StorageResult<StorageObject>> {
      const object = objects.get(input.objectId);

      if (!object || object.tenantId !== input.tenantId) {
        return Promise.resolve(
          createStorageFailure("not_found", "Storage object was not found.")
        );
      }

      return Promise.resolve(createStorageSuccess(object));
    },
    healthCheck(): Promise<StorageResult<StorageHealthCheck>> {
      return Promise.resolve(
        createStorageSuccess({
          checkedAt: nowIso,
          provider: providerId,
          status: "healthy",
        })
      );
    },
  };
}
