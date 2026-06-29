/**
 * PAS-001 §4.7 — business reference identity wire references and scope guards.
 *
 * Wire interfaces keep plain string ids for JSON serialization.
 * Parse ids at explicit trust boundaries via family `parse*` helpers.
 */
import {
  type AssetId,
  type CustomerId,
  type DocumentId,
  type EmployeeId,
  type ProductId,
  parseOptionalAssetId,
  parseOptionalCustomerId,
  parseOptionalDocumentId,
  parseOptionalEmployeeId,
  parseOptionalProductId,
  parseOptionalSupplierId,
  parseOptionalWarehouseId,
  type SupplierId,
  toAssetId,
  toCustomerId,
  toDocumentId,
  toEmployeeId,
  toProductId,
  toSupplierId,
  toWarehouseId,
  type WarehouseId,
} from "../families/business-reference-id.contract.js";
import {
  type CompanyId,
  parseOptionalCompanyId,
  parseOptionalTenantId,
  type TenantId,
  toCompanyId,
  toTenantId,
} from "../families/tenant-hierarchy-id.contract.js";

/** How natural keys are scoped — mirrors architecture-authority registry column. */
export type BusinessMasterDataIdentityScope =
  | "tenant_and_company"
  | "tenant_catalog";

/** Discriminated identity scope — mirrors registry `identityScope` column. */
export type BusinessMasterDataIdentityScopeRule =
  | {
      readonly kind: "tenant_and_company";
      readonly tenantId: string;
      readonly companyId: string;
    }
  | {
      readonly kind: "tenant_catalog";
      readonly tenantId: string;
    };

export interface CustomerWireReference {
  readonly companyId: string;
  readonly customerCode: string;
  readonly customerId: string;
  readonly tenantId: string;
}

export interface SupplierWireReference {
  readonly companyId: string;
  readonly supplierId: string;
  readonly tenantId: string;
  readonly vendorCode: string;
}

export interface ProductWireReference {
  readonly productId: string;
  readonly sku: string;
  readonly tenantId: string;
}

export interface EmployeeWireReference {
  readonly companyId: string;
  readonly employeeId: string;
  readonly employeeNumber: string;
  readonly tenantId: string;
}

export interface WarehouseWireReference {
  readonly companyId: string;
  readonly tenantId: string;
  readonly warehouseCode: string;
  readonly warehouseId: string;
}

export interface DocumentWireReference {
  readonly companyId: string;
  readonly documentId: string;
  readonly documentNo: string;
  readonly documentType: string;
  readonly tenantId: string;
}

export interface AssetWireReference {
  readonly assetId: string;
  readonly assetTag: string;
  readonly companyId: string;
  readonly tenantId: string;
}

export type BusinessMasterDataWireReference =
  | CustomerWireReference
  | SupplierWireReference
  | ProductWireReference
  | EmployeeWireReference
  | WarehouseWireReference
  | DocumentWireReference
  | AssetWireReference;

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? {
          [K in keyof T]: AssertJsonSerializable<T[K]>;
        } extends Record<keyof T, true>
        ? true
        : false
      : false;

type _CustomerWireSerializable = AssertJsonSerializable<CustomerWireReference>;
type _SupplierWireSerializable = AssertJsonSerializable<SupplierWireReference>;
type _ProductWireSerializable = AssertJsonSerializable<ProductWireReference>;
type _EmployeeWireSerializable = AssertJsonSerializable<EmployeeWireReference>;
type _WarehouseWireSerializable =
  AssertJsonSerializable<WarehouseWireReference>;
type _DocumentWireSerializable = AssertJsonSerializable<DocumentWireReference>;
type _AssetWireSerializable = AssertJsonSerializable<AssetWireReference>;
type _IdentityScopeRuleSerializable =
  AssertJsonSerializable<BusinessMasterDataIdentityScopeRule>;

/**
 * Compile-time guard — business reference wire shapes must remain JSON-serializable.
 */
export type assertBusinessMasterDataWireJsonSerializable =
  _CustomerWireSerializable extends true
    ? _SupplierWireSerializable extends true
      ? _ProductWireSerializable extends true
        ? _EmployeeWireSerializable extends true
          ? _WarehouseWireSerializable extends true
            ? _DocumentWireSerializable extends true
              ? _AssetWireSerializable extends true
                ? _IdentityScopeRuleSerializable extends true
                  ? true
                  : never
                : never
              : never
            : never
          : never
        : never
      : never
    : never;

export interface BrandedCustomerReference
  extends Omit<CustomerWireReference, "tenantId" | "companyId" | "customerId"> {
  readonly companyId: CompanyId;
  readonly customerId: CustomerId;
  readonly tenantId: TenantId;
}

export interface BrandedSupplierReference
  extends Omit<SupplierWireReference, "tenantId" | "companyId" | "supplierId"> {
  readonly companyId: CompanyId;
  readonly supplierId: SupplierId;
  readonly tenantId: TenantId;
}

export interface BrandedProductReference
  extends Omit<ProductWireReference, "tenantId" | "productId"> {
  readonly productId: ProductId;
  readonly tenantId: TenantId;
}

export interface BrandedEmployeeReference
  extends Omit<EmployeeWireReference, "tenantId" | "companyId" | "employeeId"> {
  readonly companyId: CompanyId;
  readonly employeeId: EmployeeId;
  readonly tenantId: TenantId;
}

export interface BrandedWarehouseReference
  extends Omit<
    WarehouseWireReference,
    "tenantId" | "companyId" | "warehouseId"
  > {
  readonly companyId: CompanyId;
  readonly tenantId: TenantId;
  readonly warehouseId: WarehouseId;
}

export interface BrandedDocumentReference
  extends Omit<DocumentWireReference, "tenantId" | "companyId" | "documentId"> {
  readonly companyId: CompanyId;
  readonly documentId: DocumentId;
  readonly tenantId: TenantId;
}

export interface BrandedAssetReference
  extends Omit<AssetWireReference, "tenantId" | "companyId" | "assetId"> {
  readonly assetId: AssetId;
  readonly companyId: CompanyId;
  readonly tenantId: TenantId;
}

export function identityScopeRuleFromRegistry(
  scope: BusinessMasterDataIdentityScope,
  ids: { readonly tenantId: string; readonly companyId?: string }
): BusinessMasterDataIdentityScopeRule {
  if (scope === "tenant_catalog") {
    return { kind: "tenant_catalog", tenantId: ids.tenantId };
  }

  if (!ids.companyId) {
    throw new Error(
      "companyId is required for tenant_and_company identity scope."
    );
  }

  return {
    kind: "tenant_and_company",
    tenantId: ids.tenantId,
    companyId: ids.companyId,
  };
}

export function brandCustomerWireReference(
  wire: CustomerWireReference
): BrandedCustomerReference {
  const tenantId = parseOptionalTenantId(wire.tenantId);
  const companyId = parseOptionalCompanyId(wire.companyId);
  const customerId = parseOptionalCustomerId(wire.customerId);

  if (tenantId === null || companyId === null || customerId === null) {
    throw new Error("Customer wire reference ids are required.");
  }

  return {
    ...wire,
    tenantId,
    companyId,
    customerId,
  };
}

export function toCustomerWireReference(
  branded: BrandedCustomerReference
): CustomerWireReference {
  return {
    ...branded,
    tenantId: toTenantId(branded.tenantId),
    companyId: toCompanyId(branded.companyId),
    customerId: toCustomerId(branded.customerId),
  };
}

export function brandProductWireReference(
  wire: ProductWireReference
): BrandedProductReference {
  const tenantId = parseOptionalTenantId(wire.tenantId);
  const productId = parseOptionalProductId(wire.productId);

  if (tenantId === null || productId === null) {
    throw new Error("Product wire reference ids are required.");
  }

  return {
    ...wire,
    tenantId,
    productId,
  };
}

export function toProductWireReference(
  branded: BrandedProductReference
): ProductWireReference {
  return {
    ...branded,
    tenantId: toTenantId(branded.tenantId),
    productId: toProductId(branded.productId),
  };
}

export function brandSupplierWireReference(
  wire: SupplierWireReference
): BrandedSupplierReference {
  const tenantId = parseOptionalTenantId(wire.tenantId);
  const companyId = parseOptionalCompanyId(wire.companyId);
  const supplierId = parseOptionalSupplierId(wire.supplierId);

  if (tenantId === null || companyId === null || supplierId === null) {
    throw new Error("Supplier wire reference ids are required.");
  }

  return {
    ...wire,
    tenantId,
    companyId,
    supplierId,
  };
}

export function toSupplierWireReference(
  branded: BrandedSupplierReference
): SupplierWireReference {
  return {
    ...branded,
    tenantId: toTenantId(branded.tenantId),
    companyId: toCompanyId(branded.companyId),
    supplierId: toSupplierId(branded.supplierId),
  };
}

export function brandEmployeeWireReference(
  wire: EmployeeWireReference
): BrandedEmployeeReference {
  const tenantId = parseOptionalTenantId(wire.tenantId);
  const companyId = parseOptionalCompanyId(wire.companyId);
  const employeeId = parseOptionalEmployeeId(wire.employeeId);

  if (tenantId === null || companyId === null || employeeId === null) {
    throw new Error("Employee wire reference ids are required.");
  }

  return {
    ...wire,
    tenantId,
    companyId,
    employeeId,
  };
}

export function toEmployeeWireReference(
  branded: BrandedEmployeeReference
): EmployeeWireReference {
  return {
    ...branded,
    tenantId: toTenantId(branded.tenantId),
    companyId: toCompanyId(branded.companyId),
    employeeId: toEmployeeId(branded.employeeId),
  };
}

export function brandWarehouseWireReference(
  wire: WarehouseWireReference
): BrandedWarehouseReference {
  const tenantId = parseOptionalTenantId(wire.tenantId);
  const companyId = parseOptionalCompanyId(wire.companyId);
  const warehouseId = parseOptionalWarehouseId(wire.warehouseId);

  if (tenantId === null || companyId === null || warehouseId === null) {
    throw new Error("Warehouse wire reference ids are required.");
  }

  return {
    ...wire,
    tenantId,
    companyId,
    warehouseId,
  };
}

export function toWarehouseWireReference(
  branded: BrandedWarehouseReference
): WarehouseWireReference {
  return {
    ...branded,
    tenantId: toTenantId(branded.tenantId),
    companyId: toCompanyId(branded.companyId),
    warehouseId: toWarehouseId(branded.warehouseId),
  };
}

export function brandDocumentWireReference(
  wire: DocumentWireReference
): BrandedDocumentReference {
  const tenantId = parseOptionalTenantId(wire.tenantId);
  const companyId = parseOptionalCompanyId(wire.companyId);
  const documentId = parseOptionalDocumentId(wire.documentId);

  if (tenantId === null || companyId === null || documentId === null) {
    throw new Error("Document wire reference ids are required.");
  }

  return {
    ...wire,
    tenantId,
    companyId,
    documentId,
  };
}

export function toDocumentWireReference(
  branded: BrandedDocumentReference
): DocumentWireReference {
  return {
    ...branded,
    tenantId: toTenantId(branded.tenantId),
    companyId: toCompanyId(branded.companyId),
    documentId: toDocumentId(branded.documentId),
  };
}

export function brandAssetWireReference(
  wire: AssetWireReference
): BrandedAssetReference {
  const tenantId = parseOptionalTenantId(wire.tenantId);
  const companyId = parseOptionalCompanyId(wire.companyId);
  const assetId = parseOptionalAssetId(wire.assetId);

  if (tenantId === null || companyId === null || assetId === null) {
    throw new Error("Asset wire reference ids are required.");
  }

  return {
    ...wire,
    tenantId,
    companyId,
    assetId,
  };
}

export function toAssetWireReference(
  branded: BrandedAssetReference
): AssetWireReference {
  return {
    ...branded,
    tenantId: toTenantId(branded.tenantId),
    companyId: toCompanyId(branded.companyId),
    assetId: toAssetId(branded.assetId),
  };
}
