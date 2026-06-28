import type { EmploymentType } from "./employment-type.contract.js";

export interface HcmDomainWireContext {
  readonly companyId: string;
  readonly defaultEmploymentType: EmploymentType;
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

type _HcmDomainWireSerializable = AssertJsonSerializable<HcmDomainWireContext>;

export type assertHcmDomainWireContextJsonSerializable =
  _HcmDomainWireSerializable extends true ? true : never;
