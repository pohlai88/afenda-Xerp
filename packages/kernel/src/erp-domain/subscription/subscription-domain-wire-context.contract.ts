import type { BillingCycle } from "./billing-cycle.contract.js";

export interface SubscriptionDomainWireContext {
  readonly companyId: string;
  readonly defaultBillingCycle: BillingCycle;
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

type _SubscriptionDomainWireSerializable =
  AssertJsonSerializable<SubscriptionDomainWireContext>;

export type assertSubscriptionDomainWireContextJsonSerializable =
  _SubscriptionDomainWireSerializable extends true ? true : never;
