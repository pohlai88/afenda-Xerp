/**
 * TIP-008B — frozen business master data ownership map.
 * Serializable registry only; no persistence, authorization, or domain packages.
 */
import type { RepoRelativePath } from "../platform/platform-entity-authority.contract.js";

export const BUSINESS_MASTER_DATA_ENTITY_IDS = [
  "customer",
  "supplier",
  "product",
  "employee",
  "warehouse",
] as const;

export type BusinessMasterDataEntityId =
  (typeof BUSINESS_MASTER_DATA_ENTITY_IDS)[number];

/** How natural keys are scoped — mirrors glossary identity scope column. */
export type BusinessMasterDataIdentityScope =
  | "tenant_and_company"
  | "tenant_catalog";

export type BusinessMasterDataPkgCode =
  | "PKG-R02"
  | "PKG-R03"
  | "PKG-R04"
  | "PKG-R05";

export interface BusinessMasterDataAuthorityEntry {
  readonly displayName: string;
  readonly entityId: BusinessMasterDataEntityId;
  readonly identityScope: BusinessMasterDataIdentityScope;
  /** Kernel wire reference contract — populated in Slice 3. */
  readonly kernelContractExport: string | null;
  readonly kernelContractPath: RepoRelativePath | null;
  readonly naturalKeyField: string;
  readonly owningDomain: string;
  readonly pkgCode: BusinessMasterDataPkgCode;
  readonly reservedPackageId: string;
  /** Authority-only until domain TIPs scaffold PKG-R02–R05. */
  readonly runtimeStatus: "authority_only";
  readonly uniquenessRule: string;
}

export const BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY = [
  {
    entityId: "customer",
    displayName: "Customer",
    owningDomain: "CRM Authority",
    reservedPackageId: "@afenda/crm",
    pkgCode: "PKG-R04",
    identityScope: "tenant_and_company",
    naturalKeyField: "customerCode",
    uniquenessRule: "External customer code unique per company",
    kernelContractPath:
      "packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts",
    kernelContractExport: "CustomerWireReference",
    runtimeStatus: "authority_only",
  },
  {
    entityId: "supplier",
    displayName: "Supplier",
    owningDomain: "Procurement Authority",
    reservedPackageId: "@afenda/procurement",
    pkgCode: "PKG-R05",
    identityScope: "tenant_and_company",
    naturalKeyField: "vendorCode",
    uniquenessRule: "Vendor code unique per company",
    kernelContractPath:
      "packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts",
    kernelContractExport: "SupplierWireReference",
    runtimeStatus: "authority_only",
  },
  {
    entityId: "product",
    displayName: "Product",
    owningDomain: "Inventory Authority",
    reservedPackageId: "@afenda/inventory",
    pkgCode: "PKG-R02",
    identityScope: "tenant_catalog",
    naturalKeyField: "sku",
    uniquenessRule: "SKU unique per tenant catalog",
    kernelContractPath:
      "packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts",
    kernelContractExport: "ProductWireReference",
    runtimeStatus: "authority_only",
  },
  {
    entityId: "employee",
    displayName: "Employee",
    owningDomain: "HRM Authority",
    reservedPackageId: "@afenda/hrm",
    pkgCode: "PKG-R03",
    identityScope: "tenant_and_company",
    naturalKeyField: "employeeNumber",
    uniquenessRule: "Employee number unique per company",
    kernelContractPath:
      "packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts",
    kernelContractExport: "EmployeeWireReference",
    runtimeStatus: "authority_only",
  },
  {
    entityId: "warehouse",
    displayName: "Warehouse",
    owningDomain: "Inventory Authority",
    reservedPackageId: "@afenda/inventory",
    pkgCode: "PKG-R02",
    identityScope: "tenant_and_company",
    naturalKeyField: "warehouseCode",
    uniquenessRule: "Warehouse code unique per company",
    kernelContractPath:
      "packages/kernel/src/contracts/business-master-data/business-master-data-id-boundary.contract.ts",
    kernelContractExport: "WarehouseWireReference",
    runtimeStatus: "authority_only",
  },
] as const satisfies readonly BusinessMasterDataAuthorityEntry[];

/** Explicit TBD flags — not in governed core registry until future ADR. */
export const TBD_BUSINESS_MASTER_DATA_ENTITIES = [
  {
    entityId: "asset",
    displayName: "Asset",
    owningDomain: "Platform / TPM",
    reservedPackageId: "TBD via ADR",
    note: "Do not scaffold packages until ADR assigns ownership",
  },
  {
    entityId: "document",
    displayName: "Document",
    owningDomain: "Platform document service",
    reservedPackageId: "TBD via ADR",
    note: "Do not scaffold packages until ADR assigns ownership",
  },
] as const;

export function getBusinessMasterDataAuthority(
  entityId: BusinessMasterDataEntityId
): BusinessMasterDataAuthorityEntry {
  const entry = BUSINESS_MASTER_DATA_AUTHORITY_REGISTRY.find(
    (candidate) => candidate.entityId === entityId
  );

  if (!entry) {
    throw new Error(`Unknown business master data entity: ${entityId}`);
  }

  return entry;
}

export function isBusinessMasterDataEntityId(
  value: string
): value is BusinessMasterDataEntityId {
  return (BUSINESS_MASTER_DATA_ENTITY_IDS as readonly string[]).includes(value);
}
