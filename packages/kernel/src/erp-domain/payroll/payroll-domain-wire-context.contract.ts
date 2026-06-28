import type { PayFrequency } from "./pay-frequency.contract.js";

export interface PayrollDomainWireContext {
  readonly companyId: string;
  readonly defaultPayFrequency: PayFrequency;
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

type _PayrollDomainWireSerializable =
  AssertJsonSerializable<PayrollDomainWireContext>;

export type assertPayrollDomainWireContextJsonSerializable =
  _PayrollDomainWireSerializable extends true ? true : never;
