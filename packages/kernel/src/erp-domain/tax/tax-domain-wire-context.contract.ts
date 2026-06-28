import type { TaxCalculationMethod } from "./tax-calculation-method.contract.js";

export interface TaxDomainWireContext {
  readonly companyId: string;
  readonly defaultTaxCalculationMethod: TaxCalculationMethod;
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

type _TaxDomainWireSerializable = AssertJsonSerializable<TaxDomainWireContext>;

export type assertTaxDomainWireContextJsonSerializable =
  _TaxDomainWireSerializable extends true ? true : never;
