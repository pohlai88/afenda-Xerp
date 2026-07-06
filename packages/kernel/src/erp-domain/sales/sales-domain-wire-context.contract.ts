import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { PricingContext } from "./pricing-context.contract.js";

export interface SalesDomainWireContext {
  readonly companyId: string;
  readonly defaultPricingContext: PricingContext;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _SalesDomainWireSerializable =
  AssertJsonSerializable<SalesDomainWireContext>;

export type assertSalesDomainWireContextJsonSerializable =
  _SalesDomainWireSerializable extends true ? true : never;
