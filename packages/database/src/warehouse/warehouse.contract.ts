/**
 * Warehouse master data write governance — types and pure builders (no I/O).
 */
import type { MasterDataRecordStatus } from "../database.types.js";
import { assertMasterDataNaturalKey } from "../master-data/master-data-natural-key.js";

export interface WarehouseWriteInput {
  readonly companyId: string;
  readonly displayName: string;
  readonly status?: MasterDataRecordStatus;
  readonly tenantId: string;
  readonly warehouseCode: string;
}

export interface WarehouseInsertRow {
  companyId: string;
  displayName: string;
  status: MasterDataRecordStatus;
  tenantId: string;
  warehouseCode: string;
}

export type WarehouseUpdatePatch = Partial<
  Pick<WarehouseInsertRow, "displayName" | "status" | "warehouseCode">
>;

/** Serializable read model aligned with kernel `WarehouseWireReference`. */
export interface WarehouseAuthorityRecord {
  readonly companyId: string;
  readonly displayName: string;
  readonly status: MasterDataRecordStatus;
  readonly tenantId: string;
  readonly warehouseCode: string;
  readonly warehouseId: string;
}

export function buildWarehouseInsertRow(
  input: WarehouseWriteInput
): WarehouseInsertRow {
  return {
    tenantId: input.tenantId,
    companyId: input.companyId,
    warehouseCode: assertMasterDataNaturalKey(
      input.warehouseCode,
      "Warehouse code"
    ),
    displayName: input.displayName.trim(),
    status: input.status ?? "draft",
  };
}

export function buildWarehouseUpdatePatch(
  input: WarehouseUpdatePatch
): WarehouseUpdatePatch {
  const patch: WarehouseUpdatePatch = {};

  if (input.warehouseCode !== undefined) {
    patch.warehouseCode = assertMasterDataNaturalKey(
      input.warehouseCode,
      "Warehouse code"
    );
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
