import {
  resolveObjectStorageBucketName,
  resolveObjectStorageService,
} from "@/lib/storage/resolve-object-storage-service.server";

const LOGO_DOWNLOAD_TTL_SECONDS = 300;

export async function resolveAppearanceLogoPreviewUrl(input: {
  readonly logoObjectId: string | null;
  readonly tenantId: string;
}): Promise<string | null> {
  if (input.logoObjectId === null) {
    return null;
  }

  const storageService = resolveObjectStorageService();

  if (storageService === null) {
    return null;
  }

  const expiresAt = new Date(
    Date.now() + LOGO_DOWNLOAD_TTL_SECONDS * 1000
  ).toISOString();

  const downloadResult = await storageService.generateDownloadUrl({
    expiresAt,
    objectId: input.logoObjectId,
    tenantId: input.tenantId,
  });

  if (downloadResult.status !== "success") {
    return null;
  }

  return downloadResult.value.url;
}

export async function finalizeTenantBrandLogoObject(input: {
  readonly logoObjectId: string;
  readonly mimeType: "image/jpeg" | "image/png" | "image/webp";
  readonly size: number;
  readonly tenantId: string;
}): Promise<boolean> {
  const storageService = resolveObjectStorageService();
  const bucket = resolveObjectStorageBucketName();

  if (storageService === null || bucket === null) {
    return false;
  }

  const extension =
    input.mimeType === "image/jpeg"
      ? "jpg"
      : input.mimeType === "image/png"
        ? "png"
        : "webp";

  const path = `tenants/${input.tenantId}/brand/logo.${extension}`;

  const createResult = await storageService.createObject({
    bucket,
    checksum: {
      algorithm: "sha256",
      value: "pending",
    },
    companyId: null,
    filename: `logo.${extension}`,
    metadata: {
      purpose: "tenant_auth_brand_logo",
    },
    mimeType: input.mimeType,
    objectId: input.logoObjectId,
    organizationId: null,
    path,
    size: input.size,
    tenantId: input.tenantId,
  });

  return createResult.status === "success";
}

export async function deleteTenantBrandLogoObject(input: {
  readonly logoObjectId: string;
  readonly tenantId: string;
}): Promise<void> {
  const storageService = resolveObjectStorageService();

  if (storageService === null) {
    return;
  }

  await storageService.deleteObject({
    objectId: input.logoObjectId,
    tenantId: input.tenantId,
  });
}
