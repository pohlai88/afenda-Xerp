import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { AttributionModel } from "./attribution-model.contract.js";

export interface MarketingDomainWireContext {
  readonly companyId: string;
  readonly defaultAttributionModel: AttributionModel;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _MarketingDomainWireSerializable =
  AssertJsonSerializable<MarketingDomainWireContext>;

export type assertMarketingDomainWireContextJsonSerializable =
  _MarketingDomainWireSerializable extends true ? true : never;
