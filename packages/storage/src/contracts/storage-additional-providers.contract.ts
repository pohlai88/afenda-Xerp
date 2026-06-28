import type { StorageProviderId } from "./storage-object.contract.js";

/**
 * Additional storage backends approved by architecture but not deployed in production.
 * Authority: ARCH-SUPA-001 Slice 5.
 *
 * R2 remains production authority (`StorageProviderId`).
 * Supabase Storage is an additional option only — does not replace R2.
 * Requires storage PAS before adding to `StorageProviderId` or runtime adapters.
 */
export const STORAGE_ADDITIONAL_APPROVED_PROVIDERS = ["supabase"] as const;

export type StorageAdditionalApprovedProvider =
  (typeof STORAGE_ADDITIONAL_APPROVED_PROVIDERS)[number];

export const STORAGE_PRODUCTION_PROVIDER_IDS = [
  "blob",
  "r2",
] as const satisfies readonly StorageProviderId[];

export function isStorageProductionProviderId(
  value: string
): value is StorageProviderId {
  return (STORAGE_PRODUCTION_PROVIDER_IDS as readonly string[]).includes(value);
}
