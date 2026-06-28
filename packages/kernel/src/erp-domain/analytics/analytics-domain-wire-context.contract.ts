import type { AggregationGrain } from "./aggregation-grain.contract.js";

export interface AnalyticsDomainWireContext {
  readonly companyId: string;
  readonly defaultAggregationGrain: AggregationGrain;
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

type _AnalyticsDomainWireSerializable =
  AssertJsonSerializable<AnalyticsDomainWireContext>;

export type assertAnalyticsDomainWireContextJsonSerializable =
  _AnalyticsDomainWireSerializable extends true ? true : never;
