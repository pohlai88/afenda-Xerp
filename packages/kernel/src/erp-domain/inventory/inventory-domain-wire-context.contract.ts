import type { ValuationMethod } from "./valuation-method.contract.js";

export interface InventoryDomainWireContext {
  readonly companyId: string;
  readonly defaultValuationMethod: ValuationMethod;
  readonly defaultWarehouseId: string | null;
  readonly lotTrackingEnabled: boolean;
  readonly tenantId: string;
}

type JsonPrimitive = string | number | boolean | null;

type AssertJsonSerializable<T> = T extends JsonPrimitive
  ? true
  : T extends readonly (infer U)[]
    ? AssertJsonSerializable<U>
    : T extends object
      ? { [K in keyof T]: AssertJsonSerializable<T[K]> } extends Record<
          keyof T,
          true
        >
        ? true
        : false
      : false;

type _InventoryDomainWireSerializable =
  AssertJsonSerializable<InventoryDomainWireContext>;

export type assertInventoryDomainWireContextJsonSerializable =
  _InventoryDomainWireSerializable extends true ? true : never;
