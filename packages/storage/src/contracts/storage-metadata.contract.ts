export type StorageChecksumAlgorithm = "sha256" | "sha512";

export type StorageMetadataValue = boolean | number | string | null;

export interface StorageChecksum {
  readonly algorithm: StorageChecksumAlgorithm;
  readonly value: string;
}

export interface StorageMetadata {
  readonly checksum: StorageChecksum | null;
  readonly contentDisposition: string | null;
  readonly metadata: Record<string, StorageMetadataValue>;
}
