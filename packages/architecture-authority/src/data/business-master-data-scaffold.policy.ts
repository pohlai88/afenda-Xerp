/**
 * ADR-0020 + TIP-008B Slice 4 — repo scaffold guard for reserved domain packages.
 * Blocks PKG-R02–R05 package directories until ADR grants reusable runtime ownership.
 * `packages/inventory` retired — inventory persistence lives in @afenda/database + apps/erp.
 */

export const BUSINESS_MASTER_DATA_RUNTIME_STATUS = "authority_only" as const;

export type BusinessMasterDataRuntimeStatus =
  typeof BUSINESS_MASTER_DATA_RUNTIME_STATUS;

export const BUSINESS_MASTER_DATA_RESERVED_PACKAGES = [
  "@afenda/crm",
  "@afenda/hrm",
  "@afenda/procurement",
] as const;

export type BusinessMasterDataReservedPackageId =
  (typeof BUSINESS_MASTER_DATA_RESERVED_PACKAGES)[number];

/** Repo-relative package roots that must not exist until ADR + registry promotion. */
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
      `Business master data runtime status must remain "${BUSINESS_MASTER_DATA_RUNTIME_STATUS}" until domain packages activate PKG-R02–R05 runtime. Received: ${runtimeStatus}`
    );
  }
}
