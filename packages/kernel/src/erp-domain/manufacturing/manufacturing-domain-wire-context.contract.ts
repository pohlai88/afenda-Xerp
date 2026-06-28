import type { CapacityPlanningMethod } from "./capacity-planning-method.contract.js";

export interface ManufacturingDomainWireContext {
  readonly companyId: string;
  readonly defaultCapacityPlanningMethod: CapacityPlanningMethod;
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

type _ManufacturingDomainWireSerializable =
  AssertJsonSerializable<ManufacturingDomainWireContext>;

export type assertManufacturingDomainWireContextJsonSerializable =
  _ManufacturingDomainWireSerializable extends true ? true : never;
