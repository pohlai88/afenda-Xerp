import type { ServiceLevel } from "./service-level.contract.js";

export interface ServiceDomainWireContext {
  readonly companyId: string;
  readonly defaultServiceLevel: ServiceLevel;
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

type _ServiceDomainWireSerializable =
  AssertJsonSerializable<ServiceDomainWireContext>;

export type assertServiceDomainWireContextJsonSerializable =
  _ServiceDomainWireSerializable extends true ? true : never;
