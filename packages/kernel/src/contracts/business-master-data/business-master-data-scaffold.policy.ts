/**
 * TIP-008B Slice 4 — authority-only scaffold guard.
 * Blocks PKG-R02–R05 filesystem packages until domain TIPs activate them.
 */

export const BUSINESS_MASTER_DATA_RUNTIME_STATUS = "authority_only" as const;

export type BusinessMasterDataRuntimeStatus =
  typeof BUSINESS_MASTER_DATA_RUNTIME_STATUS;

export const BUSINESS_MASTER_DATA_RESERVED_PACKAGES = [
  "@afenda/crm",
  "@afenda/inventory",
  "@afenda/hrm",
  "@afenda/procurement",
] as const;

export type BusinessMasterDataReservedPackageId =
  (typeof BUSINESS_MASTER_DATA_RESERVED_PACKAGES)[number];

/** Repo-relative package roots that must not exist until domain TIPs. */
export const BUSINESS_MASTER_DATA_FORBIDDEN_PACKAGE_DIRS = [
  "packages/crm",
  "packages/inventory",
  "packages/hrm",
  "packages/procurement",
] as const;

export function isBusinessMasterDataReservedPackage(
  packageId: string
): packageId is BusinessMasterDataReservedPackageId {
  return (BUSINESS_MASTER_DATA_RESERVED_PACKAGES as readonly string[]).includes(
    packageId
  );
}

export function assertAuthorityOnlyRuntimeStatus(
  runtimeStatus: string
): asserts runtimeStatus is BusinessMasterDataRuntimeStatus {
  if (runtimeStatus !== BUSINESS_MASTER_DATA_RUNTIME_STATUS) {
    throw new Error(
      `Business master data runtime status must remain "${BUSINESS_MASTER_DATA_RUNTIME_STATUS}" until domain TIPs activate PKG-R02–R05. Received: ${runtimeStatus}`
    );
  }
}
