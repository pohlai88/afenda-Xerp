import {
  resolveObjectStorageBucketName,
  resolveObjectStorageService,
} from "@/lib/storage/resolve-object-storage-service.server";
import { tenantBrandLogoUploadPostContract } from "@/server/api/contracts/storage/tenant-brand-logo.contract";
import { ApiRouteError } from "@/server/api/runtime/api-validation";
import { createApiHandler } from "@/server/api/runtime/create-api-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIME_EXTENSION: Record<
  "image/jpeg" | "image/png" | "image/webp",
  string
> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const UPLOAD_TTL_SECONDS = 300;

export const POST = createApiHandler({
  contract: tenantBrandLogoUploadPostContract,
  async handler(context) {
    const body = context.requestBody;
    const storageService = resolveObjectStorageService();
    const bucket = resolveObjectStorageBucketName();

    if (storageService === null || bucket === null) {
      throw new ApiRouteError(
        "service_unavailable",
        "Object storage is not configured for this environment."
      );
    }

    const tenantId = context.operatingContext?.tenant.tenantId;

    if (tenantId === undefined || tenantId.length === 0) {
      throw new ApiRouteError("forbidden", "Tenant context is required.");
    }

    const extension = MIME_EXTENSION[body.mimeType];
    const path = `tenants/${tenantId}/brand/logo.${extension}`;
    const expiresAt = new Date(
      Date.now() + UPLOAD_TTL_SECONDS * 1000
    ).toISOString();

    const uploadResult = await storageService.generateUploadUrl({
      bucket,
      companyId: null,
      expiresAt,
      filename: body.filename,
      mimeType: body.mimeType,
      organizationId: null,
      path,
      size: body.size,
      tenantId,
    });

    if (uploadResult.status !== "success") {
      throw new ApiRouteError(
        "service_unavailable",
        "Unable to prepare logo upload."
      );
    }

    return {
      expiresAt: uploadResult.value.expiresAt,
      headers: uploadResult.value.headers,
      method: uploadResult.value.method,
      objectId: uploadResult.value.objectId,
      path,
      uploadUrl: uploadResult.value.url,
    };
  },
});
