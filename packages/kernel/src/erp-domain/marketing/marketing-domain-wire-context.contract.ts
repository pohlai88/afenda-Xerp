import type { AttributionModel } from "./attribution-model.contract.js";

export interface MarketingDomainWireContext {
  readonly companyId: string;
  readonly defaultAttributionModel: AttributionModel;
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

type _MarketingDomainWireSerializable =
  AssertJsonSerializable<MarketingDomainWireContext>;

export type assertMarketingDomainWireContextJsonSerializable =
  _MarketingDomainWireSerializable extends true ? true : never;
