import type { StorageProvider } from "../contracts/storage-provider.contract.js";
import {
  createStorageProviderForProviderId,
  type R2StorageProviderOptions,
} from "./r2.provider.js";

export type BlobStorageProviderOptions = R2StorageProviderOptions;

export function createBlobStorageProvider(
  options: BlobStorageProviderOptions
): StorageProvider {
  return createStorageProviderForProviderId("blob", options);
}
