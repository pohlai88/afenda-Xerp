import type { BillingMethod } from "./billing-method.contract.js";

export interface ProjectDomainWireContext {
  readonly companyId: string;
  readonly defaultBillingMethod: BillingMethod;
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

type _ProjectDomainWireSerializable =
  AssertJsonSerializable<ProjectDomainWireContext>;

export type assertProjectDomainWireContextJsonSerializable =
  _ProjectDomainWireSerializable extends true ? true : never;
