import { describe, expect, it } from "vitest";
import {
  createStorageFailure,
  createStorageService,
  createStorageSuccess,
  type StorageObject,
  type StorageProvider,
  storageService,
} from "../index.js";

const storageObject: StorageObject = {
  bucket: "tenant-files",
  checksum: {
    algorithm: "sha256",
    value: "checksum",
  },
  companyId: "company-1",
  createdAt: "2026-06-20T00:00:00.000Z",
  filename: "invoice.pdf",
  metadata: {
    source: "test",
  },
  mimeType: "application/pdf",
  objectId: "object-1",
  organizationId: "organization-1",
  path: "tenant-1/invoice.pdf",
  provider: "r2",
  size: 128,
  tenantId: "tenant-1",
};

describe("storage service", () => {
  it("returns provider_unavailable before a provider is configured", async () => {
    const result = await storageService.healthCheck();

    expect(result.status).toBe("provider_unavailable");
  });

  it("delegates storage operations to the configured provider", async () => {
    const provider: StorageProvider = {
      providerId: "r2",
      createObject() {
        return Promise.resolve(createStorageSuccess(storageObject));
      },
      deleteObject() {
        return Promise.resolve(createStorageSuccess(null));
      },
      generateDownloadUrl() {
        return Promise.resolve(
          createStorageSuccess({
            expiresAt: "2026-06-20T01:00:00.000Z",
            headers: {},
            method: "GET",
            objectId: storageObject.objectId,
            url: "https://storage.example/download",
          })
        );
      },
      generateUploadUrl() {
        return Promise.resolve(
          createStorageSuccess({
            expiresAt: "2026-06-20T01:00:00.000Z",
            headers: {
              "content-type": storageObject.mimeType,
            },
            method: "PUT",
            objectId: storageObject.objectId,
            url: "https://storage.example/upload",
          })
        );
      },
      getObject() {
        return Promise.resolve(createStorageSuccess(storageObject));
      },
      healthCheck() {
        return Promise.resolve(
          createStorageSuccess({
            checkedAt: "2026-06-20T00:00:00.000Z",
            provider: "r2",
            status: "healthy",
          })
        );
      },
    };
    const service = createStorageService(provider);

    await expect(
      service.createObject({
        bucket: storageObject.bucket,
        checksum: storageObject.checksum,
        companyId: storageObject.companyId,
        filename: storageObject.filename,
        metadata: storageObject.metadata,
        mimeType: storageObject.mimeType,
        objectId: storageObject.objectId,
        organizationId: storageObject.organizationId,
        path: storageObject.path,
        size: storageObject.size,
        tenantId: storageObject.tenantId,
      })
    ).resolves.toEqual(createStorageSuccess(storageObject));
  });

  it("normalizes thrown provider errors into provider_unavailable", async () => {
    const provider: StorageProvider = {
      providerId: "r2",
      createObject() {
        return Promise.reject(new Error("provider failed"));
      },
      deleteObject() {
        return Promise.resolve(
          createStorageFailure("not_found", "Storage object was not found.")
        );
      },
      generateDownloadUrl() {
        return Promise.resolve(
          createStorageFailure("not_found", "Storage object was not found.")
        );
      },
      generateUploadUrl() {
        return Promise.resolve(
          createStorageFailure("provider_unavailable", "Provider unavailable.")
        );
      },
      getObject() {
        return Promise.resolve(
          createStorageFailure("not_found", "Storage object was not found.")
        );
      },
      healthCheck() {
        return Promise.resolve(
          createStorageFailure("provider_unavailable", "Provider unavailable.")
        );
      },
    };
    const service = createStorageService(provider);
    const result = await service.createObject({
      bucket: storageObject.bucket,
      checksum: storageObject.checksum,
      companyId: storageObject.companyId,
      filename: storageObject.filename,
      metadata: storageObject.metadata,
      mimeType: storageObject.mimeType,
      objectId: storageObject.objectId,
      organizationId: storageObject.organizationId,
      path: storageObject.path,
      size: storageObject.size,
      tenantId: storageObject.tenantId,
    });

    expect(result).toEqual(
      createStorageFailure("provider_unavailable", "provider failed")
    );
  });
});
