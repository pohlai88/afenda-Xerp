import { describe, expect, it } from "vitest";
import { createMockStorageProvider } from "../storage/mock-storage-provider.js";

describe("mock storage provider", () => {
  it("keeps tenant-scoped object metadata deterministic", async () => {
    const provider = createMockStorageProvider({ providerId: "blob" });

    await provider.createObject({
      bucket: "tenant-files",
      checksum: null,
      companyId: null,
      filename: "contract.pdf",
      metadata: {},
      mimeType: "application/pdf",
      objectId: "object-1",
      organizationId: null,
      path: "tenant-1/contract.pdf",
      size: 256,
      tenantId: "tenant-1",
    });

    const result = await provider.getObject({
      objectId: "object-1",
      tenantId: "tenant-1",
    });

    expect(result.status).toBe("success");

    if (result.status !== "success") {
      return;
    }

    expect(result.value.provider).toBe("blob");
    expect(result.value.createdAt).toBe("2026-06-20T00:00:00.000Z");
  });
});
