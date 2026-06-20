import type {
  StorageIsoTimestamp,
  StorageObjectId,
} from "./storage-object.contract.js";

export interface CreateSignedUploadInput {
  readonly bucket: string;
  readonly companyId: string | null;
  readonly expiresAt: StorageIsoTimestamp;
  readonly filename: string;
  readonly mimeType: string;
  readonly organizationId: string | null;
  readonly path: string;
  readonly size: number;
  readonly tenantId: string;
}

export interface SignedUpload {
  readonly expiresAt: StorageIsoTimestamp;
  readonly headers: Record<string, string>;
  readonly method: "PUT";
  readonly objectId: StorageObjectId;
  readonly url: string;
}
