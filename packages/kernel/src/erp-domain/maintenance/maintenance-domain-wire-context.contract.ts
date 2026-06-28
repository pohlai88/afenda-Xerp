import type { MaintenancePriority } from "./maintenance-priority.contract.js";

export interface MaintenanceDomainWireContext {
  readonly companyId: string;
  readonly defaultMaintenancePriority: MaintenancePriority;
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

type _MaintenanceDomainWireSerializable =
  AssertJsonSerializable<MaintenanceDomainWireContext>;

export type assertMaintenanceDomainWireContextJsonSerializable =
  _MaintenanceDomainWireSerializable extends true ? true : never;
