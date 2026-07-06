import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { BillingCycle } from "./billing-cycle.contract.js";

export interface SubscriptionDomainWireContext {
  readonly companyId: string;
  readonly defaultBillingCycle: BillingCycle;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _SubscriptionDomainWireSerializable =
  AssertJsonSerializable<SubscriptionDomainWireContext>;

export type assertSubscriptionDomainWireContextJsonSerializable =
  _SubscriptionDomainWireSerializable extends true ? true : never;
