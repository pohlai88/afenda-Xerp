import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { ValuationMethod } from "./valuation-method.contract.js";

export interface InventoryDomainWireContext {
  readonly companyId: string;
  readonly defaultValuationMethod: ValuationMethod;
  readonly defaultWarehouseId: string | null;
  readonly lotTrackingEnabled: boolean;
  readonly tenantId: string;
}

type _InventoryDomainWireSerializable =
  AssertJsonSerializable<InventoryDomainWireContext>;

export type assertInventoryDomainWireContextJsonSerializable =
  _InventoryDomainWireSerializable extends true ? true : never;
