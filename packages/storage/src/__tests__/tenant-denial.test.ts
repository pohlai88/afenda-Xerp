import { describe, expect, it } from "vitest";
import {
  createBlobStorageProvider,
  createR2StorageProvider,
  type StorageProvider,
} from "../index.js";

const providerOptions = {
  baseUrl: "https://storage.example/signed",
  bucket: "tenant-files",
  signingSecret: "test-secret",
} as const;

const tenantAObjectInput = {
  bucket: "tenant-files",
  checksum: null,
  companyId: null,
  filename: "invoice.pdf",
  metadata: {},
  mimeType: "application/pdf",
  objectId: "object-tenant-a",
  organizationId: null,
  path: "tenant-a/invoice.pdf",
  size: 128,
  tenantId: "tenant-a",
} as const;

const disallowedBucketUploadInput = {
  bucket: "other-bucket",
  companyId: null,
  expiresAt: "2026-06-20T01:00:00.000Z",
  filename: "invoice.pdf",
  mimeType: "application/pdf",
  organizationId: null,
  path: "tenant-a/invoice.pdf",
  size: 128,
  tenantId: "tenant-a",
} as const;

async function seedTenantAObject(provider: StorageProvider): Promise<void> {
  const createResult = await provider.createObject({
    ...tenantAObjectInput,
  });

  expect(createResult.status).toBe("success");
}

describe.each([
  ["R2", createR2StorageProvider],
  ["Blob", createBlobStorageProvider],
] as const)("tenant denial — %s provider", (_label, createProvider) => {
  it("returns not_found when getObject tenantId mismatches stored object", async () => {
    const provider = createProvider(providerOptions);
    await seedTenantAObject(provider);

    const result = await provider.getObject({
      objectId: tenantAObjectInput.objectId,
      tenantId: "tenant-b",
    });

    expect(result.status).toBe("not_found");
  });

  it("returns not_found when deleteObject tenantId mismatches stored object", async () => {
    const provider = createProvider(providerOptions);
    await seedTenantAObject(provider);

    const deleteResult = await provider.deleteObject({
      objectId: tenantAObjectInput.objectId,
      tenantId: "tenant-b",
    });

    expect(deleteResult.status).toBe("not_found");

    const getResult = await provider.getObject({
      objectId: tenantAObjectInput.objectId,
      tenantId: tenantAObjectInput.tenantId,
    });

    expect(getResult.status).toBe("success");
  });

  it("returns not_found when generateDownloadUrl tenantId mismatches stored object", async () => {
    const provider = createProvider(providerOptions);
    await seedTenantAObject(provider);

    const result = await provider.generateDownloadUrl({
      expiresAt: "2026-06-20T01:00:00.000Z",
      objectId: tenantAObjectInput.objectId,
      tenantId: "tenant-b",
    });

    expect(result.status).toBe("not_found");
  });

  it("returns access_denied when createObject uses a disallowed bucket", async () => {
    const provider = createProvider(providerOptions);

    const result = await provider.createObject({
      ...tenantAObjectInput,
      bucket: "other-bucket",
    });

    expect(result.status).toBe("access_denied");
  });

  it("returns access_denied when generateUploadUrl uses a disallowed bucket", async () => {
    const provider = createProvider(providerOptions);

    const result = await provider.generateUploadUrl(
      disallowedBucketUploadInput
    );

    expect(result.status).toBe("access_denied");
  });
});
