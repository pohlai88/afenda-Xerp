import type { PricingContext } from "./pricing-context.contract.js";

export interface SalesDomainWireContext {
  readonly companyId: string;
  readonly defaultPricingContext: PricingContext;
  readonly enabled: boolean;
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

type _SalesDomainWireSerializable =
  AssertJsonSerializable<SalesDomainWireContext>;

export type assertSalesDomainWireContextJsonSerializable =
  _SalesDomainWireSerializable extends true ? true : never;
