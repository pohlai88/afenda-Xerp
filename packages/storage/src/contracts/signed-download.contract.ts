import type {
  StorageIsoTimestamp,
  StorageObjectId,
} from "./storage-object.contract.js";

export interface CreateSignedDownloadInput {
  readonly expiresAt: StorageIsoTimestamp;
  readonly objectId: StorageObjectId;
  readonly tenantId: string;
}

export interface SignedDownload {
  readonly expiresAt: StorageIsoTimestamp;
  readonly headers: Record<string, string>;
  readonly method: "GET";
  readonly objectId: StorageObjectId;
  readonly url: string;
}
