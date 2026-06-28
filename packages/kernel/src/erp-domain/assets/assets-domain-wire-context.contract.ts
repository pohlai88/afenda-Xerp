import type { DepreciationMethod } from "./depreciation-method.contract.js";

export interface AssetsDomainWireContext {
  readonly companyId: string;
  readonly defaultDepreciationMethod: DepreciationMethod;
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

type _AssetsDomainWireSerializable =
  AssertJsonSerializable<AssetsDomainWireContext>;

export type assertAssetsDomainWireContextJsonSerializable =
  _AssetsDomainWireSerializable extends true ? true : never;
