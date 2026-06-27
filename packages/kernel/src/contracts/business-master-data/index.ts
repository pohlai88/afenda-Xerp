/**
 * TIP-008B — governed export surface for business master data authority contracts.
 */
// biome-ignore-all lint/performance/noBarrelFile: TIP-008B requires a governed business master data authority export surface.

export {
  BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY,
  BUSINESS_MASTER_DATA_ENTITY_IDS,
  type BusinessMasterDataAuthorityEntry,
  type BusinessMasterDataEntityId,
  type BusinessMasterDataIdentityScope,
  type BusinessMasterDataPkgCode,
  getBusinessMasterDataAuthority,
  isBusinessMasterDataEntityId,
  TBD_BUSINESS_MASTER_DATA_ENTITIES,
} from "./business-master-data-authority.contract.js";
export type { assertBusinessMasterDataWireJsonSerializable } from "./business-master-data-id-boundary.contract.js";
export {
  type BrandedCustomerReference,
  type BrandedEmployeeReference,
  type BrandedProductReference,
  type BrandedSupplierReference,
  type BrandedWarehouseReference,
  type BusinessMasterDataIdentityScopeRule,
  type BusinessMasterDataWireReference,
  brandCustomerWireReference,
  brandEmployeeWireReference,
  brandProductWireReference,
  brandSupplierWireReference,
  brandWarehouseWireReference,
  type CustomerWireReference,
  type EmployeeWireReference,
  identityScopeRuleFromRegistry,
  type ProductWireReference,
  type SupplierWireReference,
  toCustomerWireReference,
  toEmployeeWireReference,
  toProductWireReference,
  toSupplierWireReference,
  toWarehouseWireReference,
  type WarehouseWireReference,
} from "./business-master-data-id-boundary.contract.js";
export {
  assertBusinessMasterDataImportBoundary,
  BUSINESS_MASTER_DATA_FORBIDDEN_IMPORT_PREFIXES,
} from "./business-master-data-import-boundary.policy.js";
export {
  assertSharedPackageOwnershipPolicy,
  type BusinessMasterDataPackageOwnershipSummary,
  getEntitiesForReservedPackage,
  INVENTORY_PERSISTENCE_ENTITY_IDS,
  INVENTORY_PERSISTENCE_PACKAGE_ID,
  summarizePackageOwnership,
} from "./business-master-data-shared-package.policy.js";
