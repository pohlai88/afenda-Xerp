import type { DispatchPriority } from "./dispatch-priority.contract.js";

export interface FieldServiceDomainWireContext {
  readonly companyId: string;
  readonly defaultDispatchPriority: DispatchPriority;
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

type _FieldServiceDomainWireSerializable =
  AssertJsonSerializable<FieldServiceDomainWireContext>;

export type assertFieldServiceDomainWireContextJsonSerializable =
  _FieldServiceDomainWireSerializable extends true ? true : never;
