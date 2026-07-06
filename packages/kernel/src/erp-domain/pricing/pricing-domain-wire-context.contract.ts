import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { PricingMethod } from "./pricing-method.contract.js";

export interface PricingDomainWireContext {
  readonly companyId: string;
  readonly defaultPricingMethod: PricingMethod;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _PricingDomainWireSerializable =
  AssertJsonSerializable<PricingDomainWireContext>;

export type assertPricingDomainWireContextJsonSerializable =
  _PricingDomainWireSerializable extends true ? true : never;
