import { describe, expect, it } from "vitest";
import {
  createBlobStorageProvider,
  createR2StorageProvider,
} from "../index.js";

describe("storage provider adapters", () => {
  it("generates signed upload URLs without exposing unsigned object paths", async () => {
    const provider = createR2StorageProvider({
      baseUrl: "https://storage.example/signed",
      bucket: "tenant-files",
      signingSecret: "test-secret",
    });
    const result = await provider.generateUploadUrl({
      bucket: "tenant-files",
      companyId: "company-1",
      expiresAt: "2026-06-20T01:00:00.000Z",
      filename: "invoice.pdf",
      mimeType: "application/pdf",
      organizationId: "organization-1",
      path: "tenant-1/invoice.pdf",
      size: 128,
      tenantId: "tenant-1",
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      return;
    }

    const url = new URL(result.value.url);

    expect(result.value.method).toBe("PUT");
    expect(url.searchParams.get("signature")).toHaveLength(64);
    expect(url.searchParams.get("tenantId")).toBe("tenant-1");
  });

  it("stores and retrieves object metadata through provider boundaries", async () => {
    const provider = createBlobStorageProvider({
      baseUrl: "https://blob.example/signed",
      bucket: "tenant-files",
      signingSecret: "test-secret",
    });
    const createResult = await provider.createObject({
      bucket: "tenant-files",
      checksum: null,
      companyId: null,
      filename: "avatar.png",
      metadata: {},
      mimeType: "image/png",
      objectId: "object-1",
      organizationId: null,
      path: "tenant-1/avatar.png",
      size: 32,
      tenantId: "tenant-1",
    });

    expect(createResult.status).toBe("success");

    const getResult = await provider.getObject({
      objectId: "object-1",
      tenantId: "tenant-1",
    });

    expect(getResult.status).toBe("success");

    if (getResult.status !== "success") {
      return;
    }

    expect(getResult.value.provider).toBe("blob");
  });
});
