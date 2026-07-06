import type { AssertJsonSerializable } from "../../contracts/json-wire.contract.js";
import type { AggregationGrain } from "./aggregation-grain.contract.js";

export interface AnalyticsDomainWireContext {
  readonly companyId: string;
  readonly defaultAggregationGrain: AggregationGrain;
  readonly enabled: boolean;
  readonly tenantId: string;
}

type _AnalyticsDomainWireSerializable =
  AssertJsonSerializable<AnalyticsDomainWireContext>;

export type assertAnalyticsDomainWireContextJsonSerializable =
  _AnalyticsDomainWireSerializable extends true ? true : never;
