import type { StorageMetadata } from "./storage-metadata.contract.js";

export type StorageIsoTimestamp = string;

export type StorageObjectId = string;

export type StorageProviderId = "blob" | "r2";

export interface StorageObject {
  readonly bucket: string;
  readonly checksum: StorageMetadata["checksum"];
  readonly companyId: string | null;
  readonly createdAt: StorageIsoTimestamp;
  readonly filename: string;
  readonly metadata: StorageMetadata["metadata"];
  readonly mimeType: string;
  readonly objectId: StorageObjectId;
  readonly organizationId: string | null;
  readonly path: string;
  readonly provider: StorageProviderId;
  readonly size: number;
  readonly tenantId: string;
}
