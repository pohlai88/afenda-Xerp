import type { StorageMetadata } from "./storage-metadata.contract.js";
import type {
  StorageObject,
  StorageObjectId,
} from "./storage-object.contract.js";

export interface CreateStorageObjectInput {
  readonly bucket: string;
  readonly checksum: StorageMetadata["checksum"];
  readonly companyId: string | null;
  readonly filename: string;
  readonly metadata: StorageMetadata["metadata"];
  readonly mimeType: string;
  readonly objectId: StorageObjectId;
  readonly organizationId: string | null;
  readonly path: string;
  readonly size: number;
  readonly tenantId: string;
}

export interface DeleteStorageObjectInput {
  readonly objectId: StorageObjectId;
  readonly tenantId: string;
}

export interface GetStorageObjectInput {
  readonly objectId: StorageObjectId;
  readonly tenantId: string;
}

export interface StorageHealthCheck {
  readonly checkedAt: string;
  readonly provider: StorageObject["provider"];
  readonly status: "healthy" | "unavailable";
}
