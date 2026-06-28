import type { AccountTier } from "./account-tier.contract.js";

export interface CrmDomainWireContext {
  readonly companyId: string;
  readonly defaultAccountTier: AccountTier;
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

type _CrmDomainWireSerializable = AssertJsonSerializable<CrmDomainWireContext>;

export type assertCrmDomainWireContextJsonSerializable =
  _CrmDomainWireSerializable extends true ? true : never;
