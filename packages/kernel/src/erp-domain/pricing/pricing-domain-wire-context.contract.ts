import type { PricingMethod } from "./pricing-method.contract.js";

export interface PricingDomainWireContext {
  readonly companyId: string;
  readonly defaultPricingMethod: PricingMethod;
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

type _PricingDomainWireSerializable =
  AssertJsonSerializable<PricingDomainWireContext>;

export type assertPricingDomainWireContextJsonSerializable =
  _PricingDomainWireSerializable extends true ? true : never;
