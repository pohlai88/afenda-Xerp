import type { AllocationMethod } from "./allocation-method.contract.js";

export interface ControllingDomainWireContext {
  readonly companyId: string;
  readonly defaultAllocationMethod: AllocationMethod;
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

type _ControllingDomainWireSerializable =
  AssertJsonSerializable<ControllingDomainWireContext>;

export type assertControllingDomainWireContextJsonSerializable =
  _ControllingDomainWireSerializable extends true ? true : never;
