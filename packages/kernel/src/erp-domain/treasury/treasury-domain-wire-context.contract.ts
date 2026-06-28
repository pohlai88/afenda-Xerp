import type { HedgeAccountingMethod } from "./hedge-accounting-method.contract.js";

export interface TreasuryDomainWireContext {
  readonly companyId: string;
  readonly defaultHedgeAccountingMethod: HedgeAccountingMethod;
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

type _TreasuryDomainWireSerializable =
  AssertJsonSerializable<TreasuryDomainWireContext>;

export type assertTreasuryDomainWireContextJsonSerializable =
  _TreasuryDomainWireSerializable extends true ? true : never;
