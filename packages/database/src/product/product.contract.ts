/**
 * Product master data write governance — types and pure builders (no I/O).
 */
import type { MasterDataRecordStatus } from "../database.types.js";
import { assertMasterDataNaturalKey } from "../master-data/master-data-natural-key.js";

export interface ProductWriteInput {
  readonly displayName: string;
  readonly sku: string;
  readonly status?: MasterDataRecordStatus;
  readonly tenantId: string;
}

export interface ProductInsertRow {
  displayName: string;
  sku: string;
  status: MasterDataRecordStatus;
  tenantId: string;
}

export type ProductUpdatePatch = Partial<
  Pick<ProductInsertRow, "displayName" | "sku" | "status">
>;

/** Serializable read model aligned with kernel `ProductWireReference`. */
export interface ProductAuthorityRecord {
  readonly displayName: string;
  readonly productId: string;
  readonly sku: string;
  readonly status: MasterDataRecordStatus;
  readonly tenantId: string;
}

export function buildProductInsertRow(
  input: ProductWriteInput
): ProductInsertRow {
  return {
    tenantId: input.tenantId,
    sku: assertMasterDataNaturalKey(input.sku, "SKU"),
    displayName: input.displayName.trim(),
    status: input.status ?? "draft",
  };
}

export function buildProductUpdatePatch(
  input: ProductUpdatePatch
): ProductUpdatePatch {
  const patch: ProductUpdatePatch = {};

  if (input.sku !== undefined) {
    patch.sku = assertMasterDataNaturalKey(input.sku, "SKU");
  }
  if (input.displayName !== undefined) {
    patch.displayName = input.displayName.trim();
  }
  if (input.status !== undefined) {
    patch.status = input.status;
  }

  return patch;
}

export {
  MASTER_DATA_RECORD_STATUSES,
  type MasterDataRecordStatus,
} from "../database.types.js";
