/** ADR-0027 skeleton — @afenda/storage removed; presigned upload routes return service_unavailable. */

export interface ObjectStorageUploadUrlResult {
  readonly expiresAt: string;
  readonly headers: Record<string, string>;
  readonly method: "PUT";
  readonly objectId: string;
  readonly url: string;
}

export interface ObjectStorageService {
  generateUploadUrl(input: {
    readonly bucket: string;
    readonly companyId: string | null;
    readonly expiresAt: string;
    readonly filename: string;
    readonly mimeType: string;
    readonly organizationId: string | null;
    readonly path: string;
    readonly size: number;
    readonly tenantId: string;
  }): Promise<
    | {
        readonly status: "success";
        readonly value: ObjectStorageUploadUrlResult;
      }
    | { readonly status: "error" }
  >;
}

export function resolveObjectStorageService(): ObjectStorageService | null {
  return null;
}

export function resolveObjectStorageBucketName(): string | null {
  return null;
}
