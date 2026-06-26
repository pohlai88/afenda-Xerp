import { z } from "zod";

const tenantBrandLogoMimeSchema = z.enum([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const tenantBrandLogoUploadRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: tenantBrandLogoMimeSchema,
  size: z
    .number()
    .int()
    .positive()
    .max(512 * 1024),
});

export type TenantBrandLogoUploadRequestDto = z.infer<
  typeof tenantBrandLogoUploadRequestSchema
>;

export const tenantBrandLogoUploadResponseSchema = z.object({
  expiresAt: z.string().datetime(),
  headers: z.record(z.string(), z.string()),
  method: z.literal("PUT"),
  objectId: z.string().uuid(),
  path: z.string().min(1),
  uploadUrl: z.string().url(),
});

export type TenantBrandLogoUploadResponseDto = z.infer<
  typeof tenantBrandLogoUploadResponseSchema
>;
