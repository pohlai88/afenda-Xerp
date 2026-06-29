import { z } from "zod";

const tenantBrandLogoMimeSchema = z
  .enum(["image/jpeg", "image/png", "image/webp"])
  .meta({
    description: "Allowed MIME type for tenant brand logo uploads.",
    example: "image/png",
  });

export const tenantBrandLogoUploadRequestSchema = z
  .object({
    filename: z.string().min(1).max(255).meta({
      description: "Original filename including extension.",
      example: "brand-logo.png",
    }),
    mimeType: tenantBrandLogoMimeSchema.meta({
      description: "Content type of the file to upload.",
    }),
    size: z
      .number()
      .int()
      .positive()
      .max(512 * 1024)
      .meta({
        description: "File size in bytes (maximum 512 KiB).",
        example: 48_640,
      }),
  })
  .meta({
    id: "TenantBrandLogoUploadRequest",
    description:
      "Metadata for requesting a presigned upload URL for a tenant brand logo.",
  });

export type TenantBrandLogoUploadRequestDto = z.infer<
  typeof tenantBrandLogoUploadRequestSchema
>;

export const tenantBrandLogoUploadResponseSchema = z
  .object({
    expiresAt: z.string().datetime().meta({
      description: "ISO-8601 timestamp when the presigned upload URL expires.",
      example: "2026-06-26T15:00:00.000Z",
    }),
    headers: z.record(z.string(), z.string()).meta({
      description:
        "Required HTTP headers the client must send with the presigned PUT request.",
      example: { "Content-Type": "image/png" },
    }),
    method: z.literal("PUT").meta({
      description: "HTTP method to use against the presigned upload URL.",
      example: "PUT",
    }),
    objectId: z.string().uuid().meta({
      description: "UUID identifying the storage object once upload completes.",
      example: "4dd643ff-7ec7-4666-9c88-50b7d3da34e4",
    }),
    path: z.string().min(1).meta({
      description: "Storage object key path within the tenant bucket.",
      example: "tenants/acme/brand/logo.png",
    }),
    uploadUrl: z.string().url().meta({
      description: "Presigned URL for direct binary upload via HTTP PUT.",
      example:
        "https://storage.example.com/tenants/acme/brand/logo.png?X-Amz-Signature=abc123",
    }),
  })
  .meta({
    id: "TenantBrandLogoUploadResponse",
    description:
      "Presigned upload instructions for a tenant brand logo binary object.",
  });

export type TenantBrandLogoUploadResponseDto = z.infer<
  typeof tenantBrandLogoUploadResponseSchema
>;
